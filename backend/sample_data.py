# Sample products for database seeding
# Used by POST /products/seed endpoint

SAMPLE_PRODUCTS = [
    {
        "id": "pim-seed-001", "name": "Wireless Bluetooth Headphones", "sku": "PIM-001",
        "description": "Premium noise-cancelling wireless headphones with 30-hour battery life and deep bass.",
        "category": "Electronics", "price": 79.99, "salePrice": 64.99, "stock": 245,
        "status": "published", "wooSynced": True, "wooId": "woo-101",
        "attributes": {"color": "Matte Black", "material": "ABS Plastic", "weight": "250g", "brand": "SoundMax", "warranty": "2 years", "origin": "China"},
        "images": []
    },
    {
        "id": "pim-seed-002", "name": "Organic Cotton T-Shirt", "sku": "PIM-002",
        "description": "Eco-friendly organic cotton crew-neck t-shirt. Pre-shrunk, breathable fabric.",
        "category": "Clothing", "price": 24.99, "salePrice": None, "stock": 530,
        "status": "published", "wooSynced": True, "wooId": "woo-102",
        "attributes": {"size": "M", "color": "Navy Blue", "material": "100% Organic Cotton", "weight": "180g", "brand": "EcoWear", "origin": "India"},
        "images": []
    },
    {
        "id": "pim-seed-003", "name": "Smart LED Desk Lamp", "sku": "PIM-003",
        "description": "Touch-controlled LED desk lamp with 5 brightness levels and USB charging port.",
        "category": "Electronics", "price": 45.00, "salePrice": 38.50, "stock": 182,
        "status": "published", "wooSynced": False, "wooId": None,
        "attributes": {"color": "White", "material": "Aluminum + ABS", "weight": "1.2kg", "brand": "LumiTech", "warranty": "1 year", "origin": "China"},
        "images": []
    },
    {
        "id": "pim-seed-004", "name": "Yoga Mat Premium", "sku": "PIM-004",
        "description": "Non-slip yoga mat with alignment marks. 6mm thickness for joint protection.",
        "category": "Sports", "price": 34.99, "salePrice": None, "stock": 310,
        "status": "published", "wooSynced": True, "wooId": "woo-104",
        "attributes": {"color": "Purple", "material": "TPE Eco-Foam", "weight": "1.8kg", "brand": "ZenFlex", "origin": "Taiwan"},
        "images": []
    },
    {
        "id": "pim-seed-005", "name": "Stainless Steel Water Bottle", "sku": "PIM-005",
        "description": "Double-wall vacuum insulated. Keeps drinks cold 24hr, hot 12hr.",
        "category": "Home & Kitchen", "price": 19.99, "salePrice": 16.99, "stock": 890,
        "status": "published", "wooSynced": False, "wooId": None,
        "attributes": {"color": "Silver", "material": "18/8 Stainless Steel", "weight": "350g", "brand": "HydroKeep", "warranty": "Lifetime", "origin": "USA"},
        "images": []
    },
    {
        "id": "pim-seed-006", "name": "Running Shoes Pro", "sku": "PIM-006",
        "description": "",
        "category": "Sports", "price": 89.99, "salePrice": None, "stock": 67,
        "status": "draft", "wooSynced": False, "wooId": None,
        "attributes": {"size": "L", "color": "Red/Black", "material": "Mesh + Rubber", "brand": "SpeedStrike"},
        "images": []
    },
    {
        "id": "pim-seed-007", "name": "Ceramic Coffee Mug Set", "sku": "PIM-007",
        "description": "Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe.",
        "category": "Home & Kitchen", "price": 28.00, "salePrice": 22.00, "stock": 415,
        "status": "published", "wooSynced": True, "wooId": "woo-107",
        "attributes": {"color": "Assorted Earth Tones", "material": "Ceramic", "weight": "1.6kg", "brand": "ArtisanHome", "origin": "Portugal"},
        "images": []
    },
    {
        "id": "pim-seed-008", "name": "USB-C Hub Adapter", "sku": "PIM-008",
        "description": "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.",
        "category": "Electronics", "price": 39.99, "salePrice": 34.99, "stock": 0,
        "status": "published", "wooSynced": True, "wooId": "woo-108",
        "attributes": {"color": "Space Gray", "material": "Aluminum", "weight": "85g", "brand": "ConnectPro", "warranty": "18 months", "origin": "China"},
        "images": []
    },
    {
        "id": "pim-seed-009", "name": "Natural Face Moisturizer", "sku": "PIM-009",
        "description": "Lightweight daily moisturizer with hyaluronic acid and vitamin E.",
        "category": "Beauty", "price": 18.50, "salePrice": None, "stock": 275,
        "status": "published", "wooSynced": False, "wooId": None,
        "attributes": {"weight": "50ml", "brand": "PureGlow", "origin": "France"},
        "images": []
    },
    {
        "id": "pim-seed-010", "name": "Bamboo Cutting Board", "sku": "PIM-010",
        "description": "",
        "category": "Home & Kitchen", "price": 15.99, "salePrice": None, "stock": 620,
        "status": "draft", "wooSynced": False, "wooId": None,
        "attributes": {"material": "Bamboo", "brand": "GreenChef"},
        "images": []
    },
    {
        "id": "pim-seed-011", "name": "Wireless Charging Pad", "sku": "PIM-011",
        "description": "15W fast wireless charger. Compatible with all Qi-enabled devices.",
        "category": "Electronics", "price": 22.99, "salePrice": 19.99, "stock": 340,
        "status": "published", "wooSynced": True, "wooId": "woo-111",
        "attributes": {"color": "Black", "material": "ABS + Silicone", "weight": "120g", "brand": "ChargeMate", "warranty": "1 year", "origin": "South Korea"},
        "images": []
    },
    {
        "id": "pim-seed-012", "name": "Adventure Novel Collection", "sku": "PIM-012",
        "description": "Box set of 5 bestselling adventure novels. Hardcover edition.",
        "category": "Books", "price": 49.99, "salePrice": 39.99, "stock": 88,
        "status": "published", "wooSynced": False, "wooId": None,
        "attributes": {"weight": "2.5kg", "brand": "PageTurner Publishing", "origin": "UK"},
        "images": []
    },
    {
        "id": "pim-seed-013", "name": "Kids Building Blocks Set", "sku": "PIM-013",
        "description": "200-piece colorful building blocks. STEM-approved educational toy for ages 3+.",
        "category": "Toys", "price": 29.99, "salePrice": 24.99, "stock": 156,
        "status": "published", "wooSynced": False, "wooId": None,
        "attributes": {"color": "Multicolor", "material": "ABS Plastic (BPA-free)", "weight": "1.1kg", "brand": "BuildBright", "warranty": "6 months", "origin": "Germany"},
        "images": []
    },
    {
        "id": "pim-seed-014", "name": "Leather Wallet RFID", "sku": "PIM-014",
        "description": "Slim bifold wallet with RFID blocking technology. 8 card slots.",
        "category": "Clothing", "price": 34.99, "salePrice": None, "stock": 445,
        "status": "published", "wooSynced": True, "wooId": "woo-114",
        "attributes": {"color": "Brown", "material": "Genuine Leather", "weight": "90g", "brand": "CraftHide", "origin": "Italy"},
        "images": []
    },
    {
        "id": "pim-seed-015", "name": "Resistance Bands Set", "sku": "PIM-015",
        "description": "",
        "category": "Sports", "price": 0, "salePrice": None, "stock": 200,
        "status": "draft", "wooSynced": False, "wooId": None,
        "attributes": {"color": "Multi", "brand": "FlexForce"},
        "images": []
    },
]
