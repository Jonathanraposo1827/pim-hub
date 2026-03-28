from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, JSON
from datetime import datetime, timezone
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import os
from dotenv import load_dotenv

load_dotenv()

# ─── Database Connection ────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Convert to asyncpg driver prefix
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# asyncpg only understands 'ssl' — strip all other query params Neon adds
if DATABASE_URL:
    parsed = urlparse(DATABASE_URL)
    # Keep only asyncpg-compatible params, replace sslmode with ssl
    clean_params = {"ssl": ["require"]}
    DATABASE_URL = urlunparse((
        parsed.scheme, parsed.netloc, parsed.path,
        parsed.params, urlencode(clean_params, doseq=True), parsed.fragment
    ))

if DATABASE_URL:
    engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
else:
    engine = None
    AsyncSessionLocal = None

Base = declarative_base()

# ─── Product Model ──────────────────────────────────────────

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)
    name = Column(String(255), nullable=False)
    sku = Column(String(50), unique=True, nullable=False)
    description = Column(Text, default="")
    category = Column(String(100), default="Uncategorized")
    price = Column(Float, default=0.0)
    sale_price = Column(Float, nullable=True)
    stock = Column(Integer, default=0)
    status = Column(String(20), default="draft")  # published, draft, archived
    woo_synced = Column(Boolean, default=False)
    woo_id = Column(String(100), nullable=True)
    attributes = Column(JSON, default={})  # {color, material, weight, brand, origin, ...}
    images = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sku": self.sku,
            "description": self.description or "",
            "category": self.category or "Uncategorized",
            "price": self.price or 0,
            "salePrice": self.sale_price,
            "stock": self.stock or 0,
            "status": self.status or "draft",
            "wooSynced": self.woo_synced or False,
            "wooId": self.woo_id,
            "attributes": self.attributes or {},
            "images": self.images or [],
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }


# ─── DB Helpers ─────────────────────────────────────────────

async def get_db():
    """Dependency for FastAPI routes."""
    if AsyncSessionLocal is None:
        raise Exception("Database not configured. Set DATABASE_URL in .env")
    async with AsyncSessionLocal() as session:
        yield session

async def create_tables():
    """Create all tables on startup."""
    if engine is None:
        print("⚠️  DATABASE_URL not set — running without database (mock mode)")
        return
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created/verified")

def is_db_configured():
    return engine is not None
