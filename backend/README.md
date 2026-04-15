# OptiSim Backend

This is the Python-based simulation engine for OptiSim, built with FastAPI.

## Local Development

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

## Deployment (Render)

To deploy this backend to [Render](https://render.com/):

1. **Create a New Web Service**: Point it to your GitHub repository.
2. **Environment**: Select `Python`.
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT`
5. **Environment Variables**:
   - `CORS_ORIGINS`: Set this to your frontend URL (e.g., `https://your-app.vercel.app`). Use commas to separate multiple origins.
   - `PYTHON_VERSION`: `3.10.0` (or your preferred version).

## API Endpoints

- `POST /api/simulate`: Runs a spectral simulation on a chain of optical components.
- `GET /api/health`: Basic health check.
