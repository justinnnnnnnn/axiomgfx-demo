import { Compound } from '../components/CompoundTable';

// Comprehensive mock compound library with realistic pharmaceutical data
export const MOCK_COMPOUNDS: Compound[] = [
  // High DILI Risk Compounds (withdrawn or black box warnings)
  {
    id: 'nefazodone',
    name: 'Nefazodone',
    tc20: 29.26,
    tc50: 74.49,
    ec20: 43.10,
    ec50: 63.18,
    riskScore: 3.94,
    riskCategory: 'Medium',
    molecularWeight: 470.01,
    logp: 4.7,
    smiles: 'CCC1=NN(C2=CC=CC=C2N1CCCN3CCN(CC3)C4=CC=CC(=C4)OC(=O)C5=CC=CC=C5Cl)C',
    therapeuticIndex: 1.6,
    safetyWindow: [0.09, 4.44]
  },
  {
    id: 'orfanglipron',
    name: 'Orfanglipron',
    tc20: 2.10,
    tc50: 6.00,
    ec20: 3.10,
    ec50: 7.20,
    riskScore: 6.04,
    riskCategory: 'High',
    molecularWeight: 385.45,
    logp: 2.8,
    smiles: 'CC(C)(C)OC(=O)N1CCC(CC1)C(=O)N2CCC(CC2)C(=O)O',
    therapeuticIndex: 0.8,
    safetyWindow: [0.02, 0.85]
  },
  {
    id: 'troglitazone',
    name: 'Troglitazone',
    tc20: 8.5,
    tc50: 22.3,
    ec20: 12.1,
    ec50: 28.7,
    riskScore: 7.2,
    riskCategory: 'High',
    molecularWeight: 441.54,
    logp: 5.2,
    smiles: 'CC1=C(C(=O)N(N1C)C2=CC=C(C=C2)C)C3=CC=C(C=C3)OCC4=CC=C(C=C4)CC5C(=O)NC(=O)S5',
    therapeuticIndex: 0.6,
    safetyWindow: [0.01, 0.45]
  },
  {
    id: 'ketoconazole',
    name: 'Ketoconazole',
    tc20: 15.8,
    tc50: 42.1,
    ec20: 18.9,
    ec50: 45.3,
    riskScore: 4.1,
    riskCategory: 'Medium',
    molecularWeight: 531.43,
    logp: 4.35,
    smiles: 'CC(=O)N1CCN(CC1)C2=CC=C(C=C2)OCC3=C(C=CC=C3Cl)Cl',
    therapeuticIndex: 2.1,
    safetyWindow: [0.15, 2.8]
  },
  {
    id: 'diclofenac',
    name: 'Diclofenac',
    tc20: 25.4,
    tc50: 58.9,
    ec20: 22.7,
    ec50: 52.1,
    riskScore: 3.8,
    riskCategory: 'Medium',
    molecularWeight: 296.15,
    logp: 4.51,
    smiles: 'O=C(O)CC1=CC=CC=C1NC2=C(Cl)C=CC=C2Cl',
    therapeuticIndex: 3.2,
    safetyWindow: [0.25, 5.2]
  },
  {
    id: 'amiodarone',
    name: 'Amiodarone',
    tc20: 18.2,
    tc50: 48.7,
    ec20: 21.5,
    ec50: 51.3,
    riskScore: 4.3,
    riskCategory: 'Medium',
    molecularWeight: 645.31,
    logp: 7.6,
    smiles: 'CCCC1=CC(=C(C=C1)I)C(=O)C2=C(C=CC=C2I)OCCN(CC)CC',
    therapeuticIndex: 2.8,
    safetyWindow: [0.18, 4.1]
  },
  
  // Low DILI Risk Compounds (generally safe)
  {
    id: 'sunitinib',
    name: 'Sunitinib',
    tc20: 4.43,
    tc50: 12.34,
    ec20: 6.08,
    ec50: 13.73,
    riskScore: 1.22,
    riskCategory: 'Low',
    molecularWeight: 398.47,
    logp: 2.9,
    smiles: 'CCN(CC)CCNC(=O)C1=C(NC(=C1C)/C=C/2\\C3=C(NC2=O)C=C(C=C3)F)C',
    therapeuticIndex: 8.9,
    safetyWindow: [2.1, 15.8]
  },
  {
    id: 'lotiglipron',
    name: 'Lotiglipron',
    tc20: 90.0,
    tc50: 120.0,
    ec20: 85.0,
    ec50: 115.0,
    riskScore: 0.13,
    riskCategory: 'Low',
    molecularWeight: 352.42,
    logp: 2.1,
    smiles: 'CC1=CC(=CC=C1)C2=CC=C(C=C2)C(=O)N3CCC(CC3)C(=O)O',
    therapeuticIndex: 45.2,
    safetyWindow: [15.2, 85.0]
  },
  {
    id: 'metformin',
    name: 'Metformin',
    tc20: 150.0,
    tc50: 280.0,
    ec20: 145.0,
    ec50: 275.0,
    riskScore: 0.08,
    riskCategory: 'Low',
    molecularWeight: 129.16,
    logp: -2.64,
    smiles: 'CN(C)C(=N)NC(=N)N',
    therapeuticIndex: 125.8,
    safetyWindow: [45.0, 250.0]
  },
  {
    id: 'aspirin',
    name: 'Aspirin',
    tc20: 125.0,
    tc50: 245.0,
    ec20: 118.0,
    ec50: 238.0,
    riskScore: 0.25,
    riskCategory: 'Low',
    molecularWeight: 180.16,
    logp: 1.19,
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    therapeuticIndex: 89.5,
    safetyWindow: [25.0, 180.0]
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    tc20: 85.3,
    tc50: 165.7,
    ec20: 78.9,
    ec50: 158.2,
    riskScore: 0.45,
    riskCategory: 'Low',
    molecularWeight: 206.28,
    logp: 3.97,
    smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
    therapeuticIndex: 52.3,
    safetyWindow: [18.5, 125.0]
  },
  {
    id: 'acetaminophen',
    name: 'Acetaminophen',
    tc20: 95.2,
    tc50: 185.4,
    ec20: 88.7,
    ec50: 178.9,
    riskScore: 0.35,
    riskCategory: 'Low',
    molecularWeight: 151.16,
    logp: 0.46,
    smiles: 'CC(=O)NC1=CC=C(C=C1)O',
    therapeuticIndex: 68.9,
    safetyWindow: [22.0, 145.0]
  },
  {
    id: 'warfarin',
    name: 'Warfarin',
    tc20: 45.8,
    tc50: 89.3,
    ec20: 42.1,
    ec50: 85.7,
    riskScore: 2.1,
    riskCategory: 'Low',
    molecularWeight: 308.33,
    logp: 2.7,
    smiles: 'CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O',
    therapeuticIndex: 15.8,
    safetyWindow: [4.5, 25.0]
  },
  {
    id: 'simvastatin',
    name: 'Simvastatin',
    tc20: 65.4,
    tc50: 128.9,
    ec20: 61.2,
    ec50: 124.3,
    riskScore: 1.8,
    riskCategory: 'Low',
    molecularWeight: 418.57,
    logp: 4.68,
    smiles: 'CCC(C)(C)C(=O)OC1CC(C=C2C1C(C(C=C2)C)CCC3CC(CC(=O)O3)O)C',
    therapeuticIndex: 28.5,
    safetyWindow: [8.5, 45.0]
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    tc20: 72.1,
    tc50: 142.8,
    ec20: 68.5,
    ec50: 138.2,
    riskScore: 1.5,
    riskCategory: 'Low',
    molecularWeight: 558.64,
    logp: 5.7,
    smiles: 'CC(C)C1=C(C(=C(N1CC(CC(=O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4',
    therapeuticIndex: 35.2,
    safetyWindow: [12.0, 58.0]
  },
  {
    id: 'lisinopril',
    name: 'Lisinopril',
    tc20: 110.5,
    tc50: 215.3,
    ec20: 105.8,
    ec50: 208.7,
    riskScore: 0.18,
    riskCategory: 'Low',
    molecularWeight: 405.49,
    logp: -1.22,
    smiles: 'CCCCN1CCCC1C(=O)N2CCCC2C(=O)N3CCC(CC3)C(=O)O',
    therapeuticIndex: 95.8,
    safetyWindow: [35.0, 185.0]
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    tc20: 55.7,
    tc50: 108.4,
    ec20: 52.3,
    ec50: 104.9,
    riskScore: 2.3,
    riskCategory: 'Low',
    molecularWeight: 345.42,
    logp: 2.23,
    smiles: 'COC1=CC2=C(C=C1)N=C(N2)S(=O)CC3=NC=C(C=C3OC)C',
    therapeuticIndex: 18.5,
    safetyWindow: [5.5, 32.0]
  },
  {
    id: 'fluoxetine',
    name: 'Fluoxetine',
    tc20: 38.9,
    tc50: 76.2,
    ec20: 35.4,
    ec50: 72.8,
    riskScore: 2.8,
    riskCategory: 'Medium',
    molecularWeight: 309.33,
    logp: 4.05,
    smiles: 'CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F',
    therapeuticIndex: 12.5,
    safetyWindow: [3.8, 22.0]
  },
  {
    id: 'sertraline',
    name: 'Sertraline',
    tc20: 42.3,
    tc50: 82.7,
    ec20: 39.1,
    ec50: 78.5,
    riskScore: 2.5,
    riskCategory: 'Medium',
    molecularWeight: 306.23,
    logp: 5.1,
    smiles: 'CNC1CCC(C2=CC=CC=C12)C3=CC(=C(C=C3)Cl)Cl',
    therapeuticIndex: 15.2,
    safetyWindow: [4.2, 28.0]
  },
  
  // Additional compounds for comprehensive demo
  {
    id: 'compound_x1',
    name: 'AXM-2847',
    tc20: 32.5,
    tc50: 78.9,
    ec20: 28.7,
    ec50: 71.2,
    riskScore: 3.2,
    riskCategory: 'Medium',
    molecularWeight: 425.67,
    logp: 3.8,
    smiles: 'CC1=CC=C(C=C1)C2=CC=C(C=C2)C(=O)N3CCC(CC3)C(=O)O',
    therapeuticIndex: 8.5,
    safetyWindow: [3.2, 18.5]
  },
  {
    id: 'compound_x2',
    name: 'GFX-1205',
    tc20: 156.8,
    tc50: 298.4,
    ec20: 142.3,
    ec50: 285.7,
    riskScore: 0.09,
    riskCategory: 'Low',
    molecularWeight: 287.34,
    logp: 1.8,
    smiles: 'CN1CCN(CC1)C2=CC=C(C=C2)C(=O)N3CCC(CC3)C(=O)O',
    therapeuticIndex: 158.2,
    safetyWindow: [85.0, 245.0]
  }
];

export interface DosePoint {
  x: number;
  y: number;
  confidence?: [number, number];
}

export const generateDoseResponse = (ec50: number, hillSlope: number = 1.0): DosePoint[] => {
  const concentrations = [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 100, 300];
  
  return concentrations.map(conc => {
    // Hill equation: Y = 1/(1+10^((LogEC50-LogX)*HillSlope))
    const logX = Math.log10(conc);
    const logEC50 = Math.log10(ec50);
    
    let y = 1 / (1 + Math.pow(10, (logEC50 - logX) * hillSlope));
    
    // Add realistic experimental noise
    const noise = (Math.random() - 0.5) * 0.1;
    y = Math.max(0, Math.min(1, y + noise));
    
    // Calculate confidence interval
    const ciWidth = 0.05 + (y * (1 - y)) * 0.1; // Wider CI at middle response
    
    return {
      x: conc,
      y: y,
      confidence: [Math.max(0, y - ciWidth), Math.min(1, y + ciWidth)]
    };
  });
};

// Mock API functions
export const fetchCompounds = async (): Promise<Compound[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_COMPOUNDS;
};

export const fetchDoseResponse = async (compoundId: string): Promise<DosePoint[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const compound = MOCK_COMPOUNDS.find(c => c.id === compoundId);
  if (!compound) return [];
  
  return generateDoseResponse(compound.ec50);
};
