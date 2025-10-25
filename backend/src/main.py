from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv
import os
import numpy as np
import json
from datetime import datetime
from enum import Enum

from .schemas import (
    Compound, DosePoint, DILIRiskRequest, DILIRiskResponse,
    OptimizationRequest, OptimizationResponse, ImageAnalysisRequest,
    ImageAnalysisResponse, BatchAnalysisRequest, BatchAnalysisResponse
)
from .mock_data import COMPOUNDS, generate_dose_response
from .dili_calculator import DILIRiskCalculator
from .structure_optimizer import StructureOptimizer

load_dotenv()

app = FastAPI(
    title="AxiomGFX DILI Platform API",
    description="AI-powered Drug-Induced Liver Injury prediction and optimization",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize calculators
dili_calculator = DILIRiskCalculator()
structure_optimizer = StructureOptimizer()

@app.get("/")
async def root():
    return {
        "message": "AxiomGFX DILI Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "api": "operational",
            "ml_engine": "operational",
            "database": "operational"
        }
    }

# ============= Compound Management Endpoints =============

@app.get("/api/compounds", response_model=Dict[str, Any])
async def get_compounds(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    risk_category: Optional[str] = None,
    tc50_min: Optional[float] = None,
    tc50_max: Optional[float] = None,
    sort_by: str = "name",
    sort_order: str = "asc"
):
    """Get compound library with filtering and pagination."""
    compounds = COMPOUNDS.copy()

    # Apply filters
    if search:
        compounds = [c for c in compounds if search.lower() in c.name.lower()]

    if risk_category:
        compounds = [c for c in compounds if get_risk_category(c.riskScore) == risk_category]

    if tc50_min is not None:
        compounds = [c for c in compounds if c.tc50 >= tc50_min]

    if tc50_max is not None:
        compounds = [c for c in compounds if c.tc50 <= tc50_max]

    # Apply sorting
    reverse = sort_order == "desc"
    if sort_by == "name":
        compounds.sort(key=lambda x: x.name, reverse=reverse)
    elif sort_by == "risk_score":
        compounds.sort(key=lambda x: x.riskScore, reverse=reverse)
    elif sort_by == "tc50":
        compounds.sort(key=lambda x: x.tc50, reverse=reverse)
    elif sort_by == "ec50":
        compounds.sort(key=lambda x: x.ec50, reverse=reverse)

    # Apply pagination
    total = len(compounds)
    compounds = compounds[skip:skip + limit]

    return {
        "compounds": compounds,
        "total": total,
        "page": skip // limit + 1,
        "pages": (total + limit - 1) // limit,
        "has_next": skip + limit < total,
        "has_prev": skip > 0
    }

@app.get("/api/compounds/{compound_id}", response_model=Dict[str, Any])
async def get_compound_detail(compound_id: str):
    """Get detailed information for a specific compound."""
    compound = next((c for c in COMPOUNDS if c.id == compound_id), None)
    if not compound:
        raise HTTPException(status_code=404, detail="Compound not found")

    # Generate additional details
    dili_risk = dili_calculator.calculate_risk(compound_id)
    similar_compounds = get_similar_compounds(compound_id)

    return {
        **compound.dict(),
        "dili_risk_profile": dili_risk,
        "similar_compounds": similar_compounds[:5],  # Top 5 similar
        "assay_results": generate_assay_results(compound_id),
        "optimization_suggestions": structure_optimizer.generate_suggestions(compound_id)[:3]
    }

# ============= Dose-Response Analysis Endpoints =============

@app.get("/api/dose-response/{compound_id}", response_model=Dict[str, Any])
async def get_dose_response(compound_id: str, assay_type: str = "cell_viability"):
    """Get dose-response curve data for a specific compound and assay."""
    compound = next((c for c in COMPOUNDS if c.id == compound_id), None)
    if not compound:
        raise HTTPException(status_code=404, detail="Compound not found")

    # Get EC50 value based on assay type
    ec50_value = getattr(compound, 'ec50', 50.0)  # Default fallback

    # Generate dose-response points
    points = generate_dose_response(ec50_value)

    # Calculate curve fit parameters
    curve_fit = calculate_curve_fit(points)

    # Generate quality metrics
    quality_metrics = {
        "z_factor": 0.7 + np.random.uniform(-0.2, 0.2),
        "signal_to_background": 5.2 + np.random.uniform(-1.0, 1.0),
        "cv_percent": 8.5 + np.random.uniform(-3.0, 3.0),
        "data_completeness": 0.95 + np.random.uniform(-0.05, 0.05)
    }

    return {
        "compound_id": compound_id,
        "assay_type": assay_type,
        "points": [{"x": p.x, "y": p.y, "confidence_interval": [p.y - 0.05, p.y + 0.05]} for p in points],
        "curve_fit": curve_fit,
        "quality_metrics": quality_metrics
    }

# ============= DILI Risk Prediction Endpoints =============

@app.post("/api/predict/dili-risk", response_model=DILIRiskResponse)
async def predict_dili_risk(request: DILIRiskRequest):
    """Predict DILI risk for a compound."""
    try:
        # Calculate DILI risk using the calculator
        risk_profile = dili_calculator.predict_from_smiles(
            smiles=request.smiles,
            compound_name=request.compound_name or "Unknown",
            assay_data=request.assay_data
        )

        # Generate optimization suggestions if requested
        optimization_suggestions = []
        if request.include_optimization and risk_profile["risk_score"] > 3.0:
            optimization_suggestions = structure_optimizer.optimize_smiles(
                request.smiles,
                max_suggestions=5
            )

        return DILIRiskResponse(
            compound_id=f"pred_{hash(request.smiles) % 10000}",
            risk_score=risk_profile["risk_score"],
            risk_category=risk_profile["risk_category"],
            safety_window=risk_profile["safety_window"],
            therapeutic_index=risk_profile["therapeutic_index"],
            mechanism_scores=risk_profile["mechanism_scores"],
            confidence=risk_profile["confidence"],
            recommendations=risk_profile["recommendations"],
            optimization_suggestions=optimization_suggestions
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

# ============= Structure Optimization Endpoints =============

@app.post("/api/optimize/structure", response_model=OptimizationResponse)
async def optimize_structure(request: OptimizationRequest):
    """Generate structural optimization suggestions."""
    try:
        # Get parent compound info
        parent_compound = None
        if request.compound_id:
            parent_compound = next((c for c in COMPOUNDS if c.id == request.compound_id), None)
            smiles = parent_compound.smiles if hasattr(parent_compound, 'smiles') else request.smiles
        else:
            smiles = request.smiles

        if not smiles:
            raise HTTPException(status_code=400, detail="Either compound_id or smiles must be provided")

        # Generate optimization suggestions
        suggestions = structure_optimizer.optimize_smiles(
            smiles=smiles,
            optimization_goals=request.optimization_goals,
            max_suggestions=request.max_suggestions or 10,
            similarity_threshold=request.similarity_threshold or 0.7
        )

        return OptimizationResponse(
            parent_compound=parent_compound,
            suggestions=suggestions,
            optimization_summary={
                "total_suggestions": len(suggestions),
                "avg_improvement": np.mean([s.overall_score for s in suggestions]),
                "best_suggestion_id": suggestions[0].id if suggestions else None
            }
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Optimization failed: {str(e)}")

# ============= Helper Functions =============

def get_risk_category(risk_score: float) -> str:
    """Convert risk score to category."""
    if risk_score < 3.3:
        return "Low"
    elif risk_score < 6.6:
        return "Medium"
    else:
        return "High"

def get_similar_compounds(compound_id: str, limit: int = 5) -> List[Compound]:
    """Get similar compounds based on mock similarity."""
    # Mock implementation - in reality would use chemical similarity
    all_compounds = [c for c in COMPOUNDS if c.id != compound_id]
    np.random.shuffle(all_compounds)
    return all_compounds[:limit]

def generate_assay_results(compound_id: str) -> List[Dict[str, Any]]:
    """Generate mock assay results for a compound."""
    compound = next((c for c in COMPOUNDS if c.id == compound_id), None)
    if not compound:
        return []

    assay_types = ["cell_viability", "cytoplasm_area", "cell_death", "necrosis", "apoptosis"]
    results = []

    for assay_type in assay_types:
        results.append({
            "assay_type": assay_type,
            "tc20": getattr(compound, 'tc20', 30.0) + np.random.uniform(-5, 5),
            "tc50": getattr(compound, 'tc50', 70.0) + np.random.uniform(-10, 10),
            "ec20": getattr(compound, 'ec20', 40.0) + np.random.uniform(-5, 5),
            "ec50": getattr(compound, 'ec50', 60.0) + np.random.uniform(-10, 10),
            "confidence": 0.85 + np.random.uniform(-0.1, 0.1),
            "replicate_count": 3,
            "quality_score": 0.9 + np.random.uniform(-0.1, 0.1)
        })

    return results

def calculate_curve_fit(points: List[DosePoint]) -> Dict[str, Any]:
    """Calculate curve fit parameters for dose-response data."""
    # Mock curve fitting - in reality would use scipy.optimize
    concentrations = [p.x for p in points]
    responses = [p.y for p in points]

    # Estimate EC50 as concentration at 50% response
    ec50_estimate = np.median(concentrations)

    return {
        "ec50": ec50_estimate,
        "hill_slope": 1.0 + np.random.uniform(-0.3, 0.3),
        "top": max(responses),
        "bottom": min(responses),
        "r_squared": 0.92 + np.random.uniform(-0.05, 0.05),
        "equation": f"Y = Bottom + (Top-Bottom)/(1+10^((LogEC50-X)*HillSlope))"
    }

# ============= Image Analysis Endpoints =============

@app.post("/api/analyze/images", response_model=ImageAnalysisResponse)
async def analyze_images(request: ImageAnalysisRequest):
    """Analyze high-content imaging data."""
    try:
        # Mock image analysis results
        results = {}

        for staining_type in request.staining_types:
            results[staining_type] = {
                "total_cells": 150 + np.random.randint(-20, 20),
                "viable_cells": 120 + np.random.randint(-15, 15),
                "affected_cells": 30 + np.random.randint(-10, 10),
                "morphology_score": 0.7 + np.random.uniform(-0.2, 0.2),
                "intensity_metrics": {
                    "mean": 128.5 + np.random.uniform(-20, 20),
                    "median": 125.0 + np.random.uniform(-15, 15),
                    "std_dev": 25.3 + np.random.uniform(-5, 5)
                },
                "phenotype_classification": {
                    "normal": 0.6 + np.random.uniform(-0.2, 0.2),
                    "stressed": 0.3 + np.random.uniform(-0.1, 0.1),
                    "dying": 0.1 + np.random.uniform(-0.05, 0.05)
                }
            }

        overall_toxicity = np.mean([r["morphology_score"] for r in results.values()])

        return ImageAnalysisResponse(
            compound_id=request.compound_id,
            analysis_id=f"img_{hash(request.compound_id) % 10000}",
            results=results,
            overall_toxicity_score=1.0 - overall_toxicity,  # Invert for toxicity
            quality_control={
                "image_quality": 0.9 + np.random.uniform(-0.1, 0.1),
                "cell_density": 0.8 + np.random.uniform(-0.1, 0.1),
                "staining_quality": 0.85 + np.random.uniform(-0.1, 0.1)
            }
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image analysis failed: {str(e)}")

# ============= Batch Processing Endpoints =============

@app.post("/api/batch/analyze", response_model=BatchAnalysisResponse)
async def submit_batch_analysis(request: BatchAnalysisRequest, background_tasks: BackgroundTasks):
    """Submit batch analysis job."""
    job_id = f"batch_{hash(str(request.compounds)) % 100000}"

    # Add background task for processing
    background_tasks.add_task(process_batch_analysis, job_id, request)

    return BatchAnalysisResponse(
        job_id=job_id,
        status="queued",
        estimated_completion=(datetime.utcnow().isoformat()),
        progress={
            "total": len(request.compounds),
            "completed": 0,
            "failed": 0
        }
    )

async def process_batch_analysis(job_id: str, request: BatchAnalysisRequest):
    """Background task to process batch analysis."""
    # Mock batch processing - in reality would process compounds
    import asyncio
    await asyncio.sleep(2)  # Simulate processing time
    print(f"Batch job {job_id} completed processing {len(request.compounds)} compounds")

@app.get("/api/batch/{job_id}/status")
async def get_batch_status(job_id: str):
    """Check batch job status."""
    # Mock status - in reality would check actual job status
    return {
        "job_id": job_id,
        "status": "completed",
        "progress": {
            "total": 10,
            "completed": 10,
            "failed": 0
        },
        "results_available": True
    }


@app.get("/api/compounds", response_model=list[Compound])
async def get_compounds(search: str | None = None, risk: str | None = None):
    def risk_category(score: float) -> str:
        if score < 3.3:
            return "Low"
        if score < 6.6:
            return "Medium"
        return "High"

    results = COMPOUNDS
    if search:
        s = search.lower()
        results = [c for c in results if s in c.name.lower()]
    if risk in {"Low", "Medium", "High"}:
        results = [c for c in results if risk_category(c.riskScore) == risk]
    return results


@app.get("/api/dose-response/{compound_id}", response_model=dict)
async def get_dose_response(compound_id: str):
    comp = next((c for c in COMPOUNDS if c.id == compound_id), None)
    if not comp:
        raise HTTPException(status_code=404, detail="Compound not found")
    points = generate_dose_response(comp.ec50)
    return {"points": points}

