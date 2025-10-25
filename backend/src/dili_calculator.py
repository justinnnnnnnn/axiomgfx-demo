# dili_calculator.py - DILI Risk Assessment Engine
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
import warnings
warnings.filterwarnings('ignore')

@dataclass
class DILIRiskProfile:
    """Data class for DILI risk assessment results"""
    compound_id: str
    compound_name: str
    risk_score: float
    risk_category: str
    safety_window: Tuple[float, float]
    risk_components: Dict[str, float]
    therapeutic_index: float
    mechanism_scores: Dict[str, float]
    recommendations: List[str]
    confidence: float

class DILIRiskCalculator:
    """
    Calculate Drug-Induced Liver Injury (DILI) risk based on 
    multiple in vitro assay endpoints and molecular properties
    """
    
    def __init__(self):
        """Initialize the DILI risk calculator"""
        
        # Weight factors for different endpoints
        self.endpoint_weights = {
            'cell_viability': 0.25,
            'cytoplasm_area': 0.15,
            'cell_death': 0.20,
            'necrosis': 0.15,
            'apoptosis': 0.15,
            'mitochondrial_toxicity': 0.10
        }
        
        # Mechanism pathway signatures
        self.mechanism_weights = {
            'oxidative_stress': 0.20,
            'mitochondrial_dysfunction': 0.25,
            'er_stress': 0.20,
            'apoptosis': 0.15,
            'necrosis': 0.20
        }
        
        # Risk thresholds (μM)
        self.risk_thresholds = {
            'low': 100.0,      # Safety window > 100x
            'medium': 10.0,    # Safety window 10-100x
            'high': 1.0        # Safety window < 10x
        }
        
        # Mock model parameters (in reality would load trained models)
        self.model_coefficients = {
            'intercept': 2.5,
            'tc50_coeff': -0.02,
            'ec50_coeff': -0.015,
            'logp_coeff': 0.3,
            'mw_coeff': 0.001
        }

    def calculate_risk(self, compound_id: str) -> Dict[str, Any]:
        """Calculate DILI risk for a compound by ID"""
        # Mock implementation - in reality would fetch from database
        from .mock_data import COMPOUNDS
        
        compound = next((c for c in COMPOUNDS if c.id == compound_id), None)
        if not compound:
            raise ValueError(f"Compound {compound_id} not found")
        
        return self._calculate_risk_from_data(
            compound_id=compound_id,
            compound_name=compound.name,
            tc50=compound.tc50,
            ec50=compound.ec50,
            tc20=compound.tc20,
            ec20=compound.ec20,
            risk_score=compound.riskScore
        )

    def predict_from_smiles(self, smiles: str, compound_name: str = "Unknown", 
                          assay_data: Optional[Any] = None) -> Dict[str, Any]:
        """Predict DILI risk from SMILES string"""
        
        # Mock molecular property calculation (would use RDKit in reality)
        molecular_weight = 300 + np.random.uniform(-100, 200)
        logp = 2.5 + np.random.uniform(-1.5, 2.0)
        
        # Mock assay predictions (would use trained models)
        tc50 = 50.0 + np.random.uniform(-30, 50)
        ec50 = 45.0 + np.random.uniform(-25, 45)
        tc20 = tc50 * 0.4 + np.random.uniform(-5, 5)
        ec20 = ec50 * 0.6 + np.random.uniform(-5, 5)
        
        # Calculate risk score
        risk_score = self._calculate_composite_risk_score(
            tc50=tc50, ec50=ec50, logp=logp, molecular_weight=molecular_weight
        )
        
        return self._calculate_risk_from_data(
            compound_id=f"pred_{hash(smiles) % 10000}",
            compound_name=compound_name,
            tc50=tc50,
            ec50=ec50,
            tc20=tc20,
            ec20=ec20,
            risk_score=risk_score,
            molecular_weight=molecular_weight,
            logp=logp
        )

    def _calculate_risk_from_data(self, compound_id: str, compound_name: str,
                                tc50: float, ec50: float, tc20: float, ec20: float,
                                risk_score: float, molecular_weight: float = None,
                                logp: float = None) -> Dict[str, Any]:
        """Calculate risk profile from compound data"""
        
        # Calculate safety window
        cmax_estimate = self._estimate_cmax(molecular_weight or 400, logp or 3.0)
        safety_window = (
            min(tc50, ec50) / cmax_estimate,
            max(tc50, ec50) / cmax_estimate
        )
        
        # Determine risk category
        if safety_window[0] > self.risk_thresholds['low']:
            risk_category = 'Low'
        elif safety_window[0] > self.risk_thresholds['medium']:
            risk_category = 'Medium'
        else:
            risk_category = 'High'
        
        # Calculate mechanism scores
        mechanism_scores = self._calculate_mechanism_scores(tc50, ec50, tc20, ec20)
        
        # Calculate therapeutic index
        therapeutic_index = min(tc50, ec50) / cmax_estimate
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            risk_score, risk_category, mechanism_scores, logp or 3.0
        )
        
        # Calculate confidence
        confidence = self._calculate_confidence(tc50, ec50, risk_score)
        
        return {
            "compound_id": compound_id,
            "compound_name": compound_name,
            "risk_score": round(risk_score, 2),
            "risk_category": risk_category,
            "safety_window": (round(safety_window[0], 2), round(safety_window[1], 2)),
            "therapeutic_index": round(therapeutic_index, 2),
            "mechanism_scores": mechanism_scores,
            "recommendations": recommendations,
            "confidence": round(confidence, 2)
        }

    def _calculate_composite_risk_score(self, tc50: float, ec50: float, 
                                      logp: float, molecular_weight: float) -> float:
        """Calculate composite DILI risk score (0-10 scale)"""
        
        # Base score from model
        score = self.model_coefficients['intercept']
        score += self.model_coefficients['tc50_coeff'] * tc50
        score += self.model_coefficients['ec50_coeff'] * ec50
        score += self.model_coefficients['logp_coeff'] * logp
        score += self.model_coefficients['mw_coeff'] * molecular_weight
        
        # Add some noise for realism
        score += np.random.uniform(-0.5, 0.5)
        
        # Ensure score is in valid range
        return max(0.0, min(10.0, score))

    def _estimate_cmax(self, molecular_weight: float, logp: float) -> float:
        """Estimate maximum plasma concentration (Cmax) in μM"""
        # Simplified pharmacokinetic estimation
        # In reality would use more sophisticated PBPK models
        
        # Base Cmax estimation (very simplified)
        base_cmax = 10.0  # μM
        
        # Adjust for molecular weight (larger molecules generally lower Cmax)
        mw_factor = 400.0 / max(molecular_weight, 200.0)
        
        # Adjust for lipophilicity (affects absorption and distribution)
        logp_factor = 1.0 + (logp - 3.0) * 0.1
        
        cmax = base_cmax * mw_factor * logp_factor
        
        # Add variability
        cmax *= (1.0 + np.random.uniform(-0.3, 0.3))
        
        return max(0.1, cmax)

    def _calculate_mechanism_scores(self, tc50: float, ec50: float, 
                                  tc20: float, ec20: float) -> Dict[str, float]:
        """Calculate mechanism-specific toxicity scores"""
        
        # Mock mechanism scoring based on endpoint ratios
        # In reality would use pathway-specific biomarkers
        
        mechanisms = {}
        
        # Oxidative stress (related to EC values)
        mechanisms['oxidative_stress'] = min(1.0, 100.0 / max(ec50, 10.0))
        
        # Mitochondrial dysfunction (related to TC values)
        mechanisms['mitochondrial_dysfunction'] = min(1.0, 100.0 / max(tc50, 10.0))
        
        # ER stress (combination of endpoints)
        mechanisms['er_stress'] = min(1.0, 150.0 / max(tc50 + ec50, 20.0))
        
        # Apoptosis (related to TC20/TC50 ratio)
        apoptosis_ratio = tc20 / max(tc50, 1.0)
        mechanisms['apoptosis'] = min(1.0, apoptosis_ratio * 2.0)
        
        # Necrosis (related to EC20/EC50 ratio)
        necrosis_ratio = ec20 / max(ec50, 1.0)
        mechanisms['necrosis'] = min(1.0, necrosis_ratio * 2.0)
        
        # Round values
        return {k: round(v, 3) for k, v in mechanisms.items()}

    def _generate_recommendations(self, risk_score: float, risk_category: str,
                                mechanism_scores: Dict[str, float], logp: float) -> List[str]:
        """Generate optimization recommendations"""
        
        recommendations = []
        
        if risk_category == 'High':
            recommendations.append("High DILI risk - consider structural optimization")
            
        if risk_score > 5.0:
            recommendations.append("Implement early safety screening")
            
        # Mechanism-specific recommendations
        if mechanism_scores.get('oxidative_stress', 0) > 0.7:
            recommendations.append("Consider antioxidant co-treatment")
            
        if mechanism_scores.get('mitochondrial_dysfunction', 0) > 0.7:
            recommendations.append("Evaluate mitochondrial toxicity markers")
            
        if logp > 4.0:
            recommendations.append("Reduce lipophilicity to improve safety profile")
            
        if not recommendations:
            recommendations.append("Acceptable safety profile - proceed with caution")
            
        return recommendations

    def _calculate_confidence(self, tc50: float, ec50: float, risk_score: float) -> float:
        """Calculate prediction confidence score"""
        
        # Base confidence
        confidence = 0.8
        
        # Reduce confidence for extreme values
        if tc50 < 1.0 or tc50 > 1000.0:
            confidence -= 0.1
            
        if ec50 < 1.0 or ec50 > 1000.0:
            confidence -= 0.1
            
        # Reduce confidence for very high or very low risk scores
        if risk_score < 0.5 or risk_score > 9.0:
            confidence -= 0.15
            
        # Add some variability
        confidence += np.random.uniform(-0.05, 0.05)
        
        return max(0.1, min(1.0, confidence))
