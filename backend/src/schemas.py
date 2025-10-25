from pydantic import BaseModel
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
from enum import Enum


class AssayType(str, Enum):
    CELL_VIABILITY = "cell_viability"
    CYTOPLASM_AREA = "cytoplasm_area"
    CELL_DEATH = "cell_death"
    NECROSIS = "necrosis"
    APOPTOSIS = "apoptosis"
    MITOCHONDRIAL = "mitochondrial_toxicity"


class RiskCategory(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Compound(BaseModel):
    id: str
    name: str
    tc20: float
    tc50: float
    ec20: float
    ec50: float
    riskScore: float
    smiles: Optional[str] = None
    molecular_weight: Optional[float] = None
    logp: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class DosePoint(BaseModel):
    x: float
    y: float
    confidence_interval: Optional[Tuple[float, float]] = None
    replicate_count: Optional[int] = None
    standard_error: Optional[float] = None


class EndpointData(BaseModel):
    tc20: Optional[float] = None
    tc50: Optional[float] = None
    ec20: Optional[float] = None
    ec50: Optional[float] = None
    confidence: Optional[float] = None


class AssayData(BaseModel):
    cell_viability: Optional[EndpointData] = None
    cytoplasm_area: Optional[EndpointData] = None
    cell_death: Optional[EndpointData] = None
    necrosis: Optional[EndpointData] = None
    apoptosis: Optional[EndpointData] = None
    mitochondrial_toxicity: Optional[EndpointData] = None


class DILIRiskRequest(BaseModel):
    smiles: str
    compound_name: Optional[str] = None
    assay_data: Optional[AssayData] = None
    include_optimization: bool = False


class DILIRiskResponse(BaseModel):
    compound_id: str
    risk_score: float
    risk_category: str
    safety_window: Tuple[float, float]
    therapeutic_index: float
    mechanism_scores: Dict[str, float]
    confidence: float
    recommendations: List[str]
    optimization_suggestions: Optional[List[Any]] = None


class OptimizationGoal(BaseModel):
    endpoint: str
    direction: str  # 'minimize' or 'maximize'
    weight: float


class OptimizationRequest(BaseModel):
    compound_id: Optional[str] = None
    smiles: Optional[str] = None
    optimization_goals: List[OptimizationGoal]
    max_suggestions: Optional[int] = 10
    similarity_threshold: Optional[float] = 0.7


class OptimizationSuggestion(BaseModel):
    id: str
    modified_smiles: str
    modification_description: str
    predicted_improvements: Dict[str, Dict[str, float]]
    similarity_score: float
    synthetic_accessibility: float
    overall_score: float


class OptimizationResponse(BaseModel):
    parent_compound: Optional[Compound] = None
    suggestions: List[OptimizationSuggestion]
    optimization_summary: Dict[str, Any]


class ImageAnalysisRequest(BaseModel):
    compound_id: str
    concentration: float
    timepoint: str
    staining_types: List[str]
    image_urls: List[str]


class ImageAnalysisResponse(BaseModel):
    compound_id: str
    analysis_id: str
    results: Dict[str, Dict[str, Any]]
    overall_toxicity_score: float
    quality_control: Dict[str, float]


class BatchAnalysisRequest(BaseModel):
    compounds: List[Dict[str, str]]
    analysis_types: List[str]
    priority: str = "normal"
    callback_url: Optional[str] = None


class BatchAnalysisResponse(BaseModel):
    job_id: str
    status: str
    estimated_completion: str
    progress: Dict[str, int]


