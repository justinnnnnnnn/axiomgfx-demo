'use client';

import React from 'react';
import Real3DMoleculeViewer from '../components/sidebar-tabs/components/Real3DMoleculeViewer';
import { Compound } from '../lib/types';

const testCompound: Compound = {
  id: 'test-orfanglipron',
  name: 'Orfanglipron',
  tc20: 2.10,
  tc50: 6.00,
  ec20: 3.10,
  ec50: 7.20,
  riskScore: 6.04
};

export default function Test3DPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          3D Molecular Viewer Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Testing Real3DMoleculeViewer with Orfanglipron
          </h2>
          
          <div className="border border-gray-300 rounded-lg p-4">
            <Real3DMoleculeViewer 
              compound={testCompound} 
              className="w-full" 
              height={400} 
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Expected behavior:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Should load 3Dmol.js library from CDN</li>
              <li>Should fetch Orfanglipron data from /api/molecule/resolve</li>
              <li>Should fetch SDF data from /api/molecule/sdf?cid=155903239</li>
              <li>Should display 3D molecular structure with CPK coloring</li>
              <li>Should auto-rotate the molecule</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
