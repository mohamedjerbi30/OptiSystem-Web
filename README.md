# OptiSim - Optical System Simulation Web App

OptiSim is a full-stack web application designed for simulating optical links and visualizing spectral propagation through various components (sources, fibers, modulators, etc.).

## Project Structure

- **`/frontend`**: React + Vite application for the user interface and visualization.
- **`/backend`**: FastAPI application containing the optical simulation engine.

## Quick Start

### 1. Start the Backend
```bash
cd backend
python -m venv venv
# Activate venv
pip install -r requirements.txt
python main.py
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment Guide

We recommend hosting the frontend on **Vercel** and the backend on **Render**.

### Backend (Render)
1. Build Command: `pip install -r requirements.txt`
2. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Environment Variable: `CORS_ORIGINS` (set to your Vercel URL).

### Frontend (Vercel)
1. Build Command: `npm run build`
2. Output Directory: `dist`
3. Environment Variable: `VITE_API_BASE_URL` (set to your Render service URL + `/api`, e.g., `https://api.onrender.com/api`).

---

## Tech Stack
- **Frontend**: React, Vite, Recharts (for visualization), Lucide (icons).
- **Backend**: FastAPI, NumPy, SciPy.
- **Styling**: TailwindCSS (if applicable) or Modern CSS.
