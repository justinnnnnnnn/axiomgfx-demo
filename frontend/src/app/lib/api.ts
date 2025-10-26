import { Compound, DosePoint } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export async function fetchCompounds(): Promise<Compound[]> {
  const res = await fetch(`${API_BASE}/api/compounds`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch compounds: ${res.status}`);
  return res.json();
}

export async function fetchDoseResponse(compoundId: string): Promise<DosePoint[]> {
  const res = await fetch(`${API_BASE}/api/dose-response/${encodeURIComponent(compoundId)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch dose response: ${res.status}`);
  const data = await res.json();
  return data.points as DosePoint[];
}



