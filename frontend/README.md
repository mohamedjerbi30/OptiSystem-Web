# OptiSim Frontend

This is the React-based frontend for OptiSim, built with Vite.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Deployment (Vercel)

1. **Push to GitHub**: Connect your repository to Vercel.
2. **Framework Preset**: Vercel should auto-detect `Vite`.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_BASE_URL`: Set this to your backend API URL (e.g., `https://your-api.onrender.com/api`).

## Configuration

The application uses environment variables for configuration. See `.env.example` for the required keys.
