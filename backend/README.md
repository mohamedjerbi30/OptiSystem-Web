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
4. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**:
   - `CORS_ORIGINS`: Set this to your frontend URL (e.g., `https://your-app.vercel.app`). Use commas to separate multiple origins.
   - `PYTHON_VERSION`: `3.10.0` (or your preferred version).

## API Endpoints

- `POST /api/simulate`: Runs a spectral simulation on a chain of optical components.
- `GET /api/health`: Basic health check.


# 🛠️ OptiSim Backend: Technical Documentation

This backend serves as a high-performance **Optical Propagation Engine** built with FastAPI and NumPy. It simulates the physical layer of optical fiber communication systems using a spectral model.

---

## 🏗️ Core Architecture

The engine uses a **Component-Based Linear Propagation Model**. The optical signal is represented as a Power Spectral Density (PSD) vector in the frequency domain.

### 📡 Data Flow
1. **Request**: The frontend sends a JSON list of components (`chain`).
2. **Initialization**: `PropagationEngine` finds the first **Source** (Laser/LED) to initialize the signal.
3. **Propagation**: The engine iterates through the chain, calling the `.process(signal)` method on each component.
4. **Result**: The final signal, along with intermediate power points for the budget chart, is returned to the frontend.

---

## 📂 File Structure & Modules

### 1. `main.py`
The FastAPI entry point. It handles:
- **CORS Configuration**: Enabling cross-origin requests from Vercel.
- **REST Endpoints**: `POST /api/simulate` and `GET /api/health`.
- **Pydantic Models**: Validating input schemas.

### 2. `engine/signal.py` (The Physics Core)
Defines how light is represented in code.
- **`create_signal()`**: Initializes a signal dictionary with `frequency_array`, `power_spectral_density`, and `phase`.
- **Conversions**: Utility functions for `dbm_to_watts`, `watts_to_dbm`, and `wavelength_to_frequency`.
- **Constants**: Physical constants like the speed of light.

### 3. `engine/base.py`
Defines the `OpticalComponent` abstract base class. All components must implement:
```python
def process(self, signal: Dict[str, Any]) -> Dict[str, Any]:
    # Transformation logic here
    return modified_signal
```

### 4. `engine/propagation.py`
The "Brain" of the simulation.
- Logic for finding the source and starting the chain.
- Distance tracking to generate the "Power vs. Distance" chart.
- Downsampling spectral data (to 500 points) for efficient frontend rendering.

---

## 🧩 Components Module (`engine/components/`)

| File | Responsibility |
| :--- | :--- |
| **`sources.py`** | Lasers (DFB, FP) and LEDs. Defines linewidth, shape, and RIN. |
| **`fibers.py`** | SMF/MMF models. Handles attenuation (dB/km) and chromatic dispersion. |
| **`amplifiers.py`** | EDFA/SOA models. Implements Gain, Saturation, and Noise Figure (ASE). |
| **`filters.py`** | Gaussian, Butterworth, FBG, and AWG spectral profiles. |
| **`modulators.py`** | Mach-Zehnder (MZM) and EAM models. |
| **`detectors.py`** | PIN/APD Responsivity and BER estimation. |
| **`passive.py`** | Fixed losses (Connectors, Splices, Couplers, Isolators). |
| **`wdm.py`** | Multiplexing and Demultiplexing logic. |

---

## 🚀 How to Add a New Component

To extend the simulator with a new component:

1. **Implement Class**: Create a class in the relevant file (e.g., `passive.py`) inheriting from `OpticalComponent`.
2. **Define logic**: Implement the `process()` method.
3. **Register**: Add your class to the `COMPONENT_REGISTRY` in `engine/components/__init__.py`.
4. **Frontend Support**: Ensure the frontend `data/defaults.js` has a matching block for the new type.

---

## 🛠️ Deployment (Render)

- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `CORS_ORIGINS`: Frontend Vercel URL.
