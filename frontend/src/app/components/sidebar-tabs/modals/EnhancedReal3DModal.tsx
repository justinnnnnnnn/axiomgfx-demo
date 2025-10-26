'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Compound } from '../../../lib/types';

// Dynamically import Real3DMoleculeViewer to prevent SSR issues
const Real3DMoleculeViewer = dynamic(() => import('../components/Real3DMoleculeViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-axiom-bg-graph-white rounded-lg flex items-center justify-center">
      <div className="text-axiom-text-secondary">Loading 3D Structure...</div>
    </div>
  )
});

interface EnhancedReal3DModalProps {
  compound: Compound;
}

interface MoleculeData {
  source: string;
  name: string;
  cid?: number;
  smiles?: string;
  inchi?: string;
  sdf3d_url?: string;
  molecular_formula?: string;
  molecular_weight?: number;
}

export default function EnhancedReal3DModal({ compound }: EnhancedReal3DModalProps) {
  const [moleculeData, setMoleculeData] = useState<MoleculeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'structure' | 'properties' | 'identifiers'>('structure');

  useEffect(() => {
    fetchMoleculeData();
  }, [compound]);

  const fetchMoleculeData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/molecule/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: compound.name }),
      });

      if (response.ok) {
        const data: MoleculeData = await response.json();
        setMoleculeData(data);
      }
    } catch (err) {
      console.error('Error fetching molecule data:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadSDF = async () => {
    if (!moleculeData?.sdf3d_url) return;
    
    try {
      const response = await fetch(moleculeData.sdf3d_url);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${compound.name.replace(/\s+/g, '_')}_3D.sdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error downloading SDF:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with compound info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-axiom-text-primary">
            Real 3D Structure: {compound.name}
          </h2>
          <p className="text-sm text-axiom-text-secondary mt-1">
            Authentic molecular data from external databases
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {moleculeData?.source && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {moleculeData.source.toUpperCase()}
            </span>
          )}
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            3Dmol.js Enhanced
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-axiom-border-light">
        <nav className="flex space-x-8">
          {[
            { id: 'structure', label: '3D Structure', icon: '🧬' },
            { id: 'properties', label: 'Properties', icon: '📊' },
            { id: 'identifiers', label: 'Identifiers', icon: '🔍' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-axiom-primary text-axiom-primary'
                  : 'border-transparent text-axiom-text-secondary hover:text-axiom-text-primary hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'structure' && (
          <div className="space-y-4">
            {/* Large 3D viewer */}
            <div className="bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light overflow-hidden">
              <Real3DMoleculeViewer compound={compound} className="w-full" height={350} />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-axiom-text-secondary">
                <strong>Controls:</strong> Mouse to rotate • Scroll to zoom • Right-click to pan
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={downloadSDF}
                  disabled={!moleculeData?.sdf3d_url}
                  className="px-4 py-2 bg-axiom-primary text-white text-sm font-medium rounded-lg hover:bg-axiom-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Download SDF
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                  Export Image
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Molecular Properties */}
            <div className="bg-axiom-bg-card rounded-lg border border-axiom-border-light p-4">
              <h3 className="text-lg font-semibold text-axiom-text-primary mb-4">
                Molecular Properties
              </h3>
              <div className="space-y-3">
                {moleculeData?.molecular_formula && (
                  <div className="flex justify-between">
                    <span className="text-axiom-text-secondary">Molecular Formula:</span>
                    <span className="font-mono text-axiom-text-primary">{moleculeData.molecular_formula}</span>
                  </div>
                )}
                {moleculeData?.molecular_weight && (
                  <div className="flex justify-between">
                    <span className="text-axiom-text-secondary">Molecular Weight:</span>
                    <span className="font-mono text-axiom-text-primary">{moleculeData.molecular_weight.toFixed(2)} g/mol</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-axiom-text-secondary">Risk Score:</span>
                  <span className="font-mono text-axiom-text-primary">{compound.riskScore.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-axiom-text-secondary">TC50:</span>
                  <span className="font-mono text-axiom-text-primary">{compound.tc50.toFixed(1)} μM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-axiom-text-secondary">EC50:</span>
                  <span className="font-mono text-axiom-text-primary">{compound.ec50.toFixed(1)} μM</span>
                </div>
              </div>
            </div>

            {/* Database Information */}
            <div className="bg-axiom-bg-card rounded-lg border border-axiom-border-light p-4">
              <h3 className="text-lg font-semibold text-axiom-text-primary mb-4">
                Database Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-axiom-text-secondary">Source:</span>
                  <span className="font-mono text-axiom-text-primary">{moleculeData?.source?.toUpperCase() || 'Loading...'}</span>
                </div>
                {moleculeData?.cid && (
                  <div className="flex justify-between">
                    <span className="text-axiom-text-secondary">PubChem CID:</span>
                    <span className="font-mono text-axiom-text-primary">{moleculeData.cid}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-axiom-text-secondary">3D Structure:</span>
                  <span className={`font-mono ${moleculeData?.sdf3d_url ? 'text-green-600' : 'text-red-600'}`}>
                    {moleculeData?.sdf3d_url ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-axiom-text-secondary">Last Updated:</span>
                  <span className="font-mono text-axiom-text-primary">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'identifiers' && (
          <div className="space-y-6">
            {/* Chemical Identifiers */}
            <div className="bg-axiom-bg-card rounded-lg border border-axiom-border-light p-4">
              <h3 className="text-lg font-semibold text-axiom-text-primary mb-4">
                Chemical Identifiers
              </h3>
              <div className="space-y-4">
                {moleculeData?.smiles && (
                  <div>
                    <label className="block text-sm font-medium text-axiom-text-secondary mb-1">
                      SMILES:
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-axiom-text-primary break-all">
                      {moleculeData.smiles}
                    </div>
                  </div>
                )}
                {moleculeData?.inchi && (
                  <div>
                    <label className="block text-sm font-medium text-axiom-text-secondary mb-1">
                      InChI:
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-axiom-text-primary break-all max-h-32 overflow-y-auto">
                      {moleculeData.inchi}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* External Links */}
            <div className="bg-axiom-bg-card rounded-lg border border-axiom-border-light p-4">
              <h3 className="text-lg font-semibold text-axiom-text-primary mb-4">
                External Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {moleculeData?.cid && (
                  <a
                    href={`https://pubchem.ncbi.nlm.nih.gov/compound/${moleculeData.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-blue-800 font-medium">PubChem</span>
                    <span className="text-blue-600">↗</span>
                  </a>
                )}
                <a
                  href={`https://www.ebi.ac.uk/chembl/compound_report_card/${compound.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="text-green-800 font-medium">ChEMBL</span>
                  <span className="text-green-600">↗</span>
                </a>
                <a
                  href={`https://go.drugbank.com/drugs?q=${compound.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="text-purple-800 font-medium">DrugBank</span>
                  <span className="text-purple-600">↗</span>
                </a>
                <a
                  href={`https://www.genome.jp/entry/drug/${compound.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <span className="text-orange-800 font-medium">KEGG</span>
                  <span className="text-orange-600">↗</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-axiom-primary mx-auto mb-4"></div>
            <div className="text-axiom-text-secondary">Loading molecular data...</div>
          </div>
        </div>
      )}
    </div>
  );
}
