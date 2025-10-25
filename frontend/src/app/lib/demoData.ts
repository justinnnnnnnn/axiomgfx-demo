import { Compound, DosePoint } from './types';

export const DEMO_COMPOUNDS: Compound[] = [
  { id: 'nefazodone', name: 'Nefazodone', tc20: 29.26, tc50: 74.49, ec20: 43.10, ec50: 63.18, riskScore: 3.94 },
  { id: 'sunitinib', name: 'Sunitinib', tc20: 4.43, tc50: 12.34, ec20: 6.08, ec50: 13.73, riskScore: 1.22 },
  { id: 'orfanglipron', name: 'Orfanglipron', tc20: 2.10, tc50: 6.00, ec20: 3.10, ec50: 7.20, riskScore: 6.04 },
  { id: 'lotiglipron', name: 'Lotiglipron', tc20: 90.0, tc50: 120.0, ec20: 85.0, ec50: 115.0, riskScore: 0.13 },
];

export function generateDoseResponse(ec50: number): DosePoint[] {
  const concentrations = [0.01, 0.03, 0.1, 0.3, 1, 3, 10, 30, 100];
  return concentrations.map((x) => {
    const hill = 1.0;
    const y = 1 / (1 + Math.pow(ec50 / x, hill));
    return { x, y: Math.max(0, Math.min(1, y)) };
  });
}


