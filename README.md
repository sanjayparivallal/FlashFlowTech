# Flash Flow Tech 🌿

A sustainable transportation comparison platform. Compare 8 transport modes and earn green credits for eco-friendly choices.

## Project Structure

```
FlashFlowTech/
├── frontend/          # React (Vite + Tailwind CSS + Recharts)
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # Navbar, TransportCard, GreenCredits
│   │   ├── context/       # UserContext (mock user)
│   │   └── pages/         # Home, Results, History, Dashboard, Profile
│   ├── package.json
│   └── vite.config.js
│
└── backend/           # FastAPI + MongoDB (Motor)
    ├── routers/       # trips.py, dashboard.py, profile.py
    ├── models/        # trip.py (Pydantic)
    ├── db/            # mongo.py (Motor client)
    ├── utils/         # transport.py (calculation engine)
    ├── main.py
    └── requirements.txt
```

## Tech Stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS v3, React Router v6, Recharts, Axios |
| Backend   | FastAPI, Python 3.11+, Uvicorn               |
| Database  | MongoDB (localhost:27017), Motor async driver |

## Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.11+
- **MongoDB** running locally on `localhost:27017`

## Getting Started

### 1. Start MongoDB

Make sure MongoDB is running on `localhost:27017`.

### 2. Start Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on **http://localhost:8000**  
API docs: **http://localhost:8000/docs**

> On first start, the mock user `sanjay@flashflowtech.com` is automatically seeded.

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

## API Endpoints

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | /trips/compare     | Compare 8 transport options    |
| POST   | /trips/select      | Save trip & award green points |
| GET    | /trips/history     | Trip history for mock user     |
| GET    | /dashboard/stats   | Aggregated stats + chart data  |
| GET    | /profile/me        | Get mock user profile          |
| PUT    | /profile/update    | Update user name               |

## Mock User

No authentication required. The app uses a hardcoded mock user:
- **ID:** `mock_user_001`
- **Name:** Sanjay
- **Email:** sanjay@flashflowtech.com
- **Starting Points:** 340
