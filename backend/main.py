from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import uvicorn
from engine.propagation import PropagationEngine

app = FastAPI(title="OptiSim Backend API", description="Spectral Simulation Engine for OptiSim")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust this in production, e.g., ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = PropagationEngine()

class ComponentData(BaseModel):
    id: str
    type: str
    label: str = ""
    shortLabel: str = ""
    category: str = ""
    params: Dict[str, Any]

class SimulationRequest(BaseModel):
    chain: List[ComponentData]

@app.post("/api/simulate")
async def simulate_optical_link(request: SimulationRequest):
    try:
        # Convert Pydantic models to dicts
        chain_data = [comp.dict() for comp in request.chain]
        
        # Run simulation
        result = engine.simulate_chain(chain_data)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
            
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "OptiSim Engine is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
