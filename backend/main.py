from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy import select, delete as sa_delete
from sqlalchemy.ext.asyncio import AsyncSession

from database import Product, get_db, create_tables, is_db_configured

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="PIM Hub AI API",
    description="AI-powered Product Information Management with Gemini 2.5 Flash + Neon PostgreSQL",
    version="2.1.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# ─── Startup ────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    await create_tables()

# ─── Pydantic Models ────────────────────────────────────────

class ProductCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    description: Optional[str] = ""
    category: Optional[str] = "Uncategorized"
    price: float = 0
    salePrice: Optional[float] = None
    stock: int = 0
    status: Optional[str] = "draft"
    attributes: Optional[Dict[str, Any]] = {}
    wooSynced: Optional[bool] = False
    wooId: Optional[str] = None
    images: Optional[List[str]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    salePrice: Optional[float] = None
    stock: Optional[int] = None
    status: Optional[str] = None
    attributes: Optional[Dict[str, Any]] = None
    wooSynced: Optional[bool] = None
    wooId: Optional[str] = None

class PIMAnalysisRequest(BaseModel):
    products: List[Dict[str, Any]]

class WooSyncRequest(BaseModel):
    products: List[Dict[str, Any]]
    action: str = "push"

# ─── Root & Health ───────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "message": "PIM Hub AI API",
        "version": "2.1.0",
        "status": "online",
        "database": "connected" if is_db_configured() else "not configured (mock mode)",
        "endpoints": {
            "/products": "GET/POST - Product CRUD",
            "/pim/analyze": "POST - AI product analysis",
            "/pim/agent": "POST - AI agent flow",
            "/woo/products": "GET - Mock WooCommerce products",
            "/woo/sync": "POST - Sync simulation",
            "/health": "GET - Health check",
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "PIM Hub AI",
        "database": "neon_postgresql" if is_db_configured() else "none",
        "gemini_configured": bool(GEMINI_API_KEY),
        "model": "gemini-2.5-flash"
    }

# ─── Product CRUD API ───────────────────────────────────────

@app.get("/products")
async def list_products(db: AsyncSession = Depends(get_db)):
    """Get all products from database."""
    result = await db.execute(select(Product).order_by(Product.created_at.desc()))
    products = result.scalars().all()
    return [p.to_dict() for p in products]

@app.get("/products/{product_id}")
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single product by ID."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product.to_dict()

@app.post("/products")
async def create_product(data: ProductCreate, db: AsyncSession = Depends(get_db)):
    """Create a new product."""
    product = Product(
        id=f"pim-{uuid.uuid4().hex[:12]}",
        name=data.name,
        sku=data.sku or f"PIM-{uuid.uuid4().hex[:6].upper()}",
        description=data.description or "",
        category=data.category or "Uncategorized",
        price=data.price,
        sale_price=data.salePrice,
        stock=data.stock,
        status=data.status or "draft",
        woo_synced=data.wooSynced or False,
        woo_id=data.wooId,
        attributes=data.attributes or {},
        images=data.images or [],
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    logger.info(f"Created product: {product.sku} - {product.name}")
    return product.to_dict()

@app.put("/products/{product_id}")
async def update_product(product_id: str, data: ProductUpdate, db: AsyncSession = Depends(get_db)):
    """Update an existing product."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = data.dict(exclude_unset=True)
    # Map camelCase to snake_case
    field_map = {"salePrice": "sale_price", "wooSynced": "woo_synced", "wooId": "woo_id"}
    for key, value in update_data.items():
        db_key = field_map.get(key, key)
        setattr(product, db_key, value)
    product.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(product)
    logger.info(f"Updated product: {product.sku}")
    return product.to_dict()

@app.delete("/products/{product_id}")
async def delete_product(product_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a product."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await db.delete(product)
    await db.commit()
    logger.info(f"Deleted product: {product_id}")
    return {"success": True, "deleted": product_id}

@app.post("/products/bulk")
async def bulk_create_products(products: List[ProductCreate], db: AsyncSession = Depends(get_db)):
    """Import multiple products at once."""
    created = []
    for data in products:
        product = Product(
            id=f"pim-{uuid.uuid4().hex[:12]}",
            name=data.name,
            sku=data.sku or f"PIM-{uuid.uuid4().hex[:6].upper()}",
            description=data.description or "",
            category=data.category or "Uncategorized",
            price=data.price,
            sale_price=data.salePrice,
            stock=data.stock,
            status=data.status or "draft",
            woo_synced=data.wooSynced or False,
            woo_id=data.wooId,
            attributes=data.attributes or {},
            images=data.images or [],
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(product)
        created.append(product)

    await db.commit()
    logger.info(f"Bulk imported {len(created)} products")
    return {"success": True, "imported": len(created), "products": [p.to_dict() for p in created]}

@app.post("/products/seed")
async def seed_products(db: AsyncSession = Depends(get_db)):
    """Seed database with sample products (for demo). Skips if products already exist."""
    result = await db.execute(select(Product))
    existing = result.scalars().all()
    if len(existing) > 0:
        return {"message": f"Database already has {len(existing)} products. Skipping seed.", "count": len(existing)}

    from sample_data import SAMPLE_PRODUCTS
    for data in SAMPLE_PRODUCTS:
        product = Product(
            id=data["id"],
            name=data["name"],
            sku=data["sku"],
            description=data.get("description", ""),
            category=data.get("category", "Uncategorized"),
            price=data.get("price", 0),
            sale_price=data.get("salePrice"),
            stock=data.get("stock", 0),
            status=data.get("status", "draft"),
            woo_synced=data.get("wooSynced", False),
            woo_id=data.get("wooId"),
            attributes=data.get("attributes", {}),
            images=data.get("images", []),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(product)

    await db.commit()
    logger.info(f"Seeded {len(SAMPLE_PRODUCTS)} products")
    return {"success": True, "seeded": len(SAMPLE_PRODUCTS)}


# ─── PIM AI Analysis ────────────────────────────────────────

@app.post("/pim/analyze")
async def analyze_products(request: PIMAnalysisRequest):
    """Full AI analysis of product catalog."""
    try:
        if not request.products:
            raise HTTPException(status_code=400, detail="No products provided")

        logger.info(f"Analyzing {len(request.products)} products")

        prompt = f"""You are an expert Product Information Management (PIM) analyst. Analyze this product catalog and provide actionable insights.

Product Catalog ({len(request.products)} products):
{json.dumps(request.products, indent=2, default=str)}

Provide analysis in this EXACT JSON format (no markdown, no code blocks):

{{
  "summary": "2-3 sentence overview of the product catalog health, highlighting key findings",
  "topProducts": [
    {{"name": "Product Name", "sku": "SKU", "stock": 100, "reason": "Why this product is performing well"}}
  ],
  "lowPerforming": [
    {{"name": "Product Name", "sku": "SKU", "stock": 0, "reason": "Why this needs attention"}}
  ],
  "missingAttributes": [
    {{"name": "Product Name", "sku": "SKU", "missingFields": ["color", "weight"]}}
  ],
  "optimizations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2"
  ],
  "attributeCompleteness": {{
    "total": 75,
    "filled": 55
  }}
}}

Be specific. Identify REAL issues in the data."""

        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")

        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)

        if not response or not response.text:
            raise HTTPException(status_code=500, detail="Empty AI response")

        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()

        return json.loads(response_text)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/pim/agent")
async def agent_flow(request: PIMAnalysisRequest):
    """AI Agent flow — multi-step analysis."""
    try:
        if not request.products:
            raise HTTPException(status_code=400, detail="No products provided")

        prompt = f"""You are an intelligent PIM Agent. Analyze {len(request.products)} products:

{json.dumps(request.products, indent=2, default=str)}

OUTPUT (strict JSON, no markdown):

{{
  "summary": "Comprehensive 2-3 sentence analysis overview.",
  "topProducts": [{{"name": "Name", "sku": "SKU", "stock": 500, "reason": "Why"}}],
  "lowPerforming": [{{"name": "Name", "sku": "SKU", "stock": 0, "reason": "Why"}}],
  "missingAttributes": [{{"name": "Name", "sku": "SKU", "missingFields": ["description", "color"]}}],
  "optimizations": ["Recommendation 1", "Recommendation 2"],
  "attributeCompleteness": {{"total": 75, "filled": 55}}
}}

Check every product. Flag every issue."""

        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")

        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)

        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        return json.loads(response_text.strip())

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Agent flow error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Agent flow failed: {str(e)}")


# ─── WooCommerce Mock ───────────────────────────────────────

MOCK_WOO_PRODUCTS = [
    {"wooId": "woo-101", "name": "Wireless Bluetooth Headphones", "sku": "PIM-001", "price": "79.99", "status": "publish", "stockQuantity": 240},
    {"wooId": "woo-102", "name": "Organic Cotton T-Shirt", "sku": "PIM-002", "price": "24.99", "status": "publish", "stockQuantity": 520},
    {"wooId": "woo-104", "name": "Yoga Mat Premium", "sku": "PIM-004", "price": "34.99", "status": "publish", "stockQuantity": 305},
    {"wooId": "woo-107", "name": "Ceramic Coffee Mug Set", "sku": "PIM-007", "price": "28.00", "status": "publish", "stockQuantity": 410},
    {"wooId": "woo-108", "name": "USB-C Hub Adapter", "sku": "PIM-008", "price": "39.99", "status": "publish", "stockQuantity": 0},
    {"wooId": "woo-111", "name": "Wireless Charging Pad", "sku": "PIM-011", "price": "22.99", "status": "publish", "stockQuantity": 335},
    {"wooId": "woo-114", "name": "Leather Wallet RFID", "sku": "PIM-014", "price": "34.99", "status": "publish", "stockQuantity": 440},
    {"wooId": "woo-201", "name": "Portable Bluetooth Speaker", "sku": "WOO-201", "price": "49.99", "status": "publish", "stockQuantity": 180},
]

@app.get("/woo/products")
async def get_woo_products():
    return {"products": MOCK_WOO_PRODUCTS, "total": len(MOCK_WOO_PRODUCTS)}

@app.post("/woo/sync")
async def woo_sync(request: WooSyncRequest):
    return {
        "success": True,
        "action": request.action,
        "synced": len(request.products),
        "message": f"Successfully {'pushed' if request.action == 'push' else 'pulled'} {len(request.products)} products"
    }


# ─── Run ─────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv("DEBUG", "True").lower() == "true"
    )
