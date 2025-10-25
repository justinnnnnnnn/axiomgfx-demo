from typing import List
import numpy as np
from datetime import datetime, timedelta
from .schemas import Compound, DosePoint

# Comprehensive demo compound library with realistic pharmaceutical compounds
COMPOUNDS: List[Compound] = [
    # High DILI Risk Compounds (withdrawn or black box warnings)
    Compound(
        id='nefazodone',
        name='Nefazodone',
        tc20=29.26, tc50=74.49, ec20=43.10, ec50=63.18,
        riskScore=3.94,
        smiles='CCC1=NN(C2=CC=CC=C2N1CCCN3CCN(CC3)C4=CC=CC(=C4)OC(=O)C5=CC=CC=C5Cl)C',
        molecular_weight=470.01,
        logp=4.7,
        created_at=datetime.now() - timedelta(days=30)
    ),
    Compound(
        id='orfanglipron',
        name='Orfanglipron',
        tc20=2.10, tc50=6.00, ec20=3.10, ec50=7.20,
        riskScore=6.04,
        smiles='CC(C)(C)OC(=O)N1CCC(CC1)C(=O)N2CCC(CC2)C(=O)O',
        molecular_weight=385.45,
        logp=2.8,
        created_at=datetime.now() - timedelta(days=25)
    ),
    Compound(
        id='troglitazone',
        name='Troglitazone',
        tc20=8.5, tc50=22.3, ec20=12.1, ec50=28.7,
        riskScore=7.2,
        smiles='CC1=C(C(=O)N(N1C)C2=CC=C(C=C2)C)C3=CC=C(C=C3)OCC4=CC=C(C=C4)CC5C(=O)NC(=O)S5',
        molecular_weight=441.54,
        logp=5.2,
        created_at=datetime.now() - timedelta(days=45)
    ),

    # Medium DILI Risk Compounds
    Compound(
        id='ketoconazole',
        name='Ketoconazole',
        tc20=15.8, tc50=42.1, ec20=18.9, ec50=45.3,
        riskScore=4.1,
        smiles='CC(=O)N1CCN(CC1)C2=CC=C(C=C2)OCC3=C(C=CC=C3Cl)Cl',
        molecular_weight=531.43,
        logp=4.35,
        created_at=datetime.now() - timedelta(days=20)
    ),
    Compound(
        id='diclofenac',
        name='Diclofenac',
        tc20=25.4, tc50=58.9, ec20=22.7, ec50=52.1,
        riskScore=3.8,
        smiles='O=C(O)CC1=CC=CC=C1NC2=C(Cl)C=CC=C2Cl',
        molecular_weight=296.15,
        logp=4.51,
        created_at=datetime.now() - timedelta(days=35)
    ),
    Compound(
        id='amiodarone',
        name='Amiodarone',
        tc20=18.2, tc50=48.7, ec20=21.5, ec50=51.3,
        riskScore=4.3,
        smiles='CCCC1=CC(=C(C=C1)I)C(=O)C2=C(C=CC=C2I)OCCN(CC)CC',
        molecular_weight=645.31,
        logp=7.6,
        created_at=datetime.now() - timedelta(days=40)
    ),

    # Low DILI Risk Compounds (generally safe)
    Compound(
        id='sunitinib',
        name='Sunitinib',
        tc20=4.43, tc50=12.34, ec20=6.08, ec50=13.73,
        riskScore=1.22,
        smiles='CCN(CC)CCNC(=O)C1=C(NC(=C1C)/C=C/2\C3=C(NC2=O)C=C(C=C3)F)C',
        molecular_weight=398.47,
        logp=2.9,
        created_at=datetime.now() - timedelta(days=15)
    ),
    Compound(
        id='lotiglipron',
        name='Lotiglipron',
        tc20=90.0, tc50=120.0, ec20=85.0, ec50=115.0,
        riskScore=0.13,
        smiles='CC1=CC(=CC=C1)C2=CC=C(C=C2)C(=O)N3CCC(CC3)C(=O)O',
        molecular_weight=352.42,
        logp=2.1,
        created_at=datetime.now() - timedelta(days=10)
    ),
    Compound(
        id='metformin',
        name='Metformin',
        tc20=150.0, tc50=280.0, ec20=145.0, ec50=275.0,
        riskScore=0.08,
        smiles='CN(C)C(=N)NC(=N)N',
        molecular_weight=129.16,
        logp=-2.64,
        created_at=datetime.now() - timedelta(days=5)
    ),
    Compound(
        id='aspirin',
        name='Aspirin',
        tc20=125.0, tc50=245.0, ec20=118.0, ec50=238.0,
        riskScore=0.25,
        smiles='CC(=O)OC1=CC=CC=C1C(=O)O',
        molecular_weight=180.16,
        logp=1.19,
        created_at=datetime.now() - timedelta(days=8)
    ),

    # Additional compounds for comprehensive demo
    Compound(
        id='ibuprofen',
        name='Ibuprofen',
        tc20=85.3, tc50=165.7, ec20=78.9, ec50=158.2,
        riskScore=0.45,
        smiles='CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
        molecular_weight=206.28,
        logp=3.97,
        created_at=datetime.now() - timedelta(days=12)
    ),
    Compound(
        id='acetaminophen',
        name='Acetaminophen',
        tc20=95.2, tc50=185.4, ec20=88.7, ec50=178.9,
        riskScore=0.35,
        smiles='CC(=O)NC1=CC=C(C=C1)O',
        molecular_weight=151.16,
        logp=0.46,
        created_at=datetime.now() - timedelta(days=18)
    ),
    Compound(
        id='warfarin',
        name='Warfarin',
        tc20=45.8, tc50=89.3, ec20=42.1, ec50=85.7,
        riskScore=2.1,
        smiles='CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O',
        molecular_weight=308.33,
        logp=2.7,
        created_at=datetime.now() - timedelta(days=22)
    ),
    Compound(
        id='simvastatin',
        name='Simvastatin',
        tc20=65.4, tc50=128.9, ec20=61.2, ec50=124.3,
        riskScore=1.8,
        smiles='CCC(C)(C)C(=O)OC1CC(C=C2C1C(C(C=C2)C)CCC3CC(CC(=O)O3)O)C',
        molecular_weight=418.57,
        logp=4.68,
        created_at=datetime.now() - timedelta(days=28)
    ),
    Compound(
        id='atorvastatin',
        name='Atorvastatin',
        tc20=72.1, tc50=142.8, ec20=68.5, ec50=138.2,
        riskScore=1.5,
        smiles='CC(C)C1=C(C(=C(N1CC(CC(=O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4',
        molecular_weight=558.64,
        logp=5.7,
        created_at=datetime.now() - timedelta(days=33)
    ),
    Compound(
        id='lisinopril',
        name='Lisinopril',
        tc20=110.5, tc50=215.3, ec20=105.8, ec50=208.7,
        riskScore=0.18,
        smiles='CCCCN1CCCC1C(=O)N2CCCC2C(=O)N3CCC(CC3)C(=O)O',
        molecular_weight=405.49,
        logp=-1.22,
        created_at=datetime.now() - timedelta(days=14)
    ),
    Compound(
        id='omeprazole',
        name='Omeprazole',
        tc20=55.7, tc50=108.4, ec20=52.3, ec50=104.9,
        riskScore=2.3,
        smiles='COC1=CC2=C(C=C1)N=C(N2)S(=O)CC3=NC=C(C=C3OC)C',
        molecular_weight=345.42,
        logp=2.23,
        created_at=datetime.now() - timedelta(days=26)
    ),
    Compound(
        id='fluoxetine',
        name='Fluoxetine',
        tc20=38.9, tc50=76.2, ec20=35.4, ec50=72.8,
        riskScore=2.8,
        smiles='CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F',
        molecular_weight=309.33,
        logp=4.05,
        created_at=datetime.now() - timedelta(days=19)
    ),
    Compound(
        id='sertraline',
        name='Sertraline',
        tc20=42.3, tc50=82.7, ec20=39.1, ec50=78.5,
        riskScore=2.5,
        smiles='CNC1CCC(C2=CC=CC=C12)C3=CC(=C(C=C3)Cl)Cl',
        molecular_weight=306.23,
        logp=5.1,
        created_at=datetime.now() - timedelta(days=21)
    )
]


def generate_dose_response(ec50: float, hill_slope: float = 1.0,
                         add_noise: bool = True) -> List[DosePoint]:
    """Generate realistic dose-response curve with optional noise"""
    concentrations = [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 100, 300]
    points: List[DosePoint] = []

    for x in concentrations:
        # Hill equation: Y = Bottom + (Top-Bottom)/(1+10^((LogEC50-LogX)*HillSlope))
        log_x = np.log10(x)
        log_ec50 = np.log10(ec50)

        y = 1 / (1 + 10**((log_ec50 - log_x) * hill_slope))

        # Add realistic experimental noise
        if add_noise:
            noise = np.random.normal(0, 0.05)  # 5% CV
            y += noise

        # Ensure response is within valid range
        y = max(0.0, min(1.0, y))

        # Calculate confidence interval
        ci_width = 0.1 * y if y > 0.1 else 0.05
        confidence_interval = (max(0, y - ci_width), min(1, y + ci_width))

        points.append(DosePoint(
            x=float(x),
            y=float(y),
            confidence_interval=confidence_interval,
            replicate_count=3,
            standard_error=ci_width / 2
        ))

    return points


