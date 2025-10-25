export type RiskCategory = 'Low' | 'Medium' | 'High';

export type Compound = {
  id: string;
  name: string;
  tc20: number;
  tc50: number;
  ec20: number;
  ec50: number;
  riskScore: number;
};

export type DosePoint = { x: number; y: number };


