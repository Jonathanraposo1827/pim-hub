# 📦 PIM Hub — Product Information Management System

A modern **Product Information Management (PIM)** system integrated with **WooCommerce** (simulated), featuring **AI-powered product insights** via Google Gemini.

> ⚠️ Includes real-world challenges like API limitations, AI integration, and full-stack system design.

> Built for hackathon: WooCommerce integration is simulated with mock data, but the system is designed to be easily extendable to real APIs.

---

## 🎥 Demo Video

👉 Watch the full project demo here:
https://drive.google.com/file/d/11wdhjCC70f5l6S34Z-zGInjRt-vGdymb/view?usp=sharing

---

## ✨ Features

### 📊 PIM Dashboard

* Real-time product KPIs (total, published, synced, inventory value)
* Attribute completeness tracking
* Category distribution charts
* Recent activity feed

### 📦 Product Catalog

* Full CRUD with rich attributes (color, size, material, brand, etc.)
* CSV/JSON import & export
* Search, filter by category & status
* Attribute completeness indicators
* Product status management (draft → published → archived)

### 🤖 AI Insights (3 Layers)

1. **Insight Generation** — Gemini analyzes the full product catalog to identify top/low performers, optimization opportunities
2. **Attribute Intelligence** — Automatically detects missing, incomplete, or inconsistent product attributes
3. **Agent Workflow** — Multi-step reasoning flow with real-time step visualization:

   * Step 1: Fetch product data
   * Step 2: Analyze attributes
   * Step 3: Generate AI insights (via Gemini)
   * Step 4: Structure results

### 🔗 WooCommerce Sync (Mock)

* **Push to WooCommerce** — Sync PIM products to store
* **Pull from WooCommerce** — Import new store products to PIM
* Sync status tracking & conflict detection
* Sync activity log

---

## ⚠️ Challenges Faced

During development of PIM Hub, several real-world challenges were encountered:

### 🔗 WooCommerce API Limitations

* Direct WooCommerce API integration was not available during the hackathon
* Implemented a **mock WooCommerce service** to simulate real-world behavior
* Designed system to be easily extendable for future real API integration

### 🌐 Frontend ↔ Backend Integration

* Faced issues connecting React frontend with FastAPI backend
* Solved **CORS errors**, API routing mismatches, and async request handling
* Stabilized communication using Axios and structured endpoints

### 🗄 Backend ↔ Database Connectivity

* Initial challenges in database setup and schema consistency
* Ensured reliable CRUD operations and proper data flow
* Handled edge cases like empty datasets and sync conflicts

### 🤖 AI Integration (Gemini)

* Managing and structuring AI responses into meaningful insights was complex
* Built a **mock AI fallback system** to ensure functionality without API
* Implemented a multi-step agent workflow for better transparency

---

## 💡 Learnings

* Built scalable and modular full-stack architecture
* Learned to handle real-world API limitations with fallback strategies
* Improved debugging in frontend-backend integration
* Gained hands-on experience with AI-powered workflows and reasoning systems

---

## 🏗 Architecture

```
Frontend (React 19 + Tailwind)
  ├── Dashboard (KPIs, Charts)
  ├── Product Catalog (CRUD, Import/Export)
  ├── AI Insights (Agent Flow Visualization)
  └── WooCommerce Sync (Push/Pull Mock)
          │
          │ HTTP (axios)
          ▼
Backend (FastAPI)
  ├── POST /pim/analyze  — Full AI analysis
  ├── POST /pim/agent    — Agent workflow
  ├── GET  /woo/products — Mock WooCommerce
  └── POST /woo/sync     — Sync simulation
          │
          ▼
     Gemini 2.5 Flash (LLM)
```

---

## 🚀 Quick Start

### Prerequisites

* Node.js v14+
* Python 3.9+ (for AI backend)
* Gemini API key ([get one here](https://makersuite.google.com/app/apikey))

### Frontend

```bash
npm install
npm start
# Opens http://localhost:3000
```

### Backend (for live AI)

```bash
cd backend
pip install -r requirements.txt
# Set your Gemini key in backend/.env:
# GEMINI_API_KEY=your_key_here
python main.py
# Runs on http://localhost:8000
```

> **Note:** The frontend works without the backend — AI insights fall back to a mock analysis engine.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/Layout.js        # PIM Hub sidebar + topbar
│   └── ui/                     # Reusable UI components
├── contexts/
│   └── ProductContext.js       # Central state (replaces Firebase)
├── data/
│   ├── sampleProducts.js       # 15 sample products
│   └── wooMockData.js          # Mock WooCommerce store
├── pages/
│   ├── Dashboard.js            # PIM dashboard
│   ├── Products.js             # Product catalog + CRUD
│   ├── AIInsights.js           # AI agent flow + insights
│   ├── WooCommerceSync.js      # Push/Pull sync UI
│   └── Settings.js             # Theme + system info
├── services/
│   ├── aiInsightsService.js    # AI API + mock fallback
│   └── wooCommerceService.js   # WooCommerce mock service
├── __tests__/
│   └── pim.test.js             # Test suite
└── App.js                      # Routes (no auth)

backend/
├── main.py                     # FastAPI + Gemini endpoints
└── requirements.txt
```

---

## 🧪 Testing

```bash
npm test -- --watchAll=false
```

Tests cover:

* Product data structure validation
* WooCommerce mock data integrity
* AI data quality detection (missing descriptions, attributes, pricing)
* Edge cases (empty datasets, synced state consistency)

---

## 📋 Data Model

```javascript
{
  id, name, sku, description,
  category, price, salePrice, stock,
  status: "published" | "draft" | "archived",
  attributes: { color, material, weight, brand, origin, ... },
  wooSynced: boolean, wooId: string | null
}
```

---

## 📄 License

MIT License
