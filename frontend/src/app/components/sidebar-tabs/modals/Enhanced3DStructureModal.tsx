"use client";

import React from 'react';
import { Compound } from '../../../lib/types';
import ThreeJSMoleculeViewer from '../components/ThreeJSMoleculeViewer';

interface Enhanced3DStructureModalProps {
  compound: Compound;
}

export default function Enhanced3DStructureModal({ compound }: Enhanced3DStructureModalProps) {
  const getRiskLevel = (score: number) => {
    if (score < 3.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
    if (score < 6.6) return { level: 'Medium', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getCompoundProperties = (compoundName: string) => {
    switch (compoundName) {
      case 'Metformin':
        return { 
          mw: '129.16', 
          logp: '-2.64', 
          formula: 'C₄H₁₁N₅',
          hbd: '4',
          hba: '2',
          tpsa: '88.99',
          rotBonds: '2'
        };
      case 'Nefazodone':
        return { 
          mw: '466.51', 
          logp: '4.23', 
          formula: 'C₂₅H₃₂ClN₅O₂',
          hbd: '0',
          hba: '6',
          tpsa: '58.72',
          rotBonds: '8'
        };
      case 'Troglitazone':
        return { 
          mw: '441.54', 
          logp: '4.65', 
          formula: 'C₂₄H₂₇NO₅S',
          hbd: '1',
          hba: '6',
          tpsa: '93.06',
          rotBonds: '5'
        };
      default:
        return { 
          mw: '245.32', 
          logp: '2.15', 
          formula: 'C₁₂H₁₅NO₃',
          hbd: '2',
          hba: '4',
          tpsa: '65.35',
          rotBonds: '3'
        };
    }
  };

  const risk = getRiskLevel(compound.riskScore);
  const properties = getCompoundProperties(compound.name);

  return (
    <div className="space-y-6">
      {/* Large 3D Viewer */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-axiom-text-primary">
            3D Molecular Structure: {compound.name}
          </h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            Three.js Enhanced
          </span>
        </div>
        
        {/* Larger viewer for modal */}
        <div className="h-96 bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light overflow-hidden">
          <ThreeJSMoleculeViewer compound={compound} className="h-full" />
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-axiom-graph-blue">
              {compound.riskScore.toFixed(1)}
            </div>
            <div className="text-sm text-axiom-text-secondary">Risk Score</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-axiom-graph-blue">
              {properties.mw}
            </div>
            <div className="text-sm text-axiom-text-secondary">Mol. Weight</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-axiom-graph-blue">
              {properties.logp}
            </div>
            <div className="text-sm text-axiom-text-secondary">LogP</div>
          </div>
        </div>
      </div>

      {/* Detailed Properties Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Molecular Properties */}
        <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
          <h4 className="text-md font-semibold text-axiom-text-primary mb-4">
            Molecular Properties
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">Molecular Formula</span>
              <span className="font-medium text-axiom-text-primary">{properties.formula}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">H-Bond Donors</span>
              <span className="font-medium text-axiom-text-primary">{properties.hbd}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">H-Bond Acceptors</span>
              <span className="font-medium text-axiom-text-primary">{properties.hba}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">TPSA (Ų)</span>
              <span className="font-medium text-axiom-text-primary">{properties.tpsa}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">Rotatable Bonds</span>
              <span className="font-medium text-axiom-text-primary">{properties.rotBonds}</span>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
          <h4 className="text-md font-semibold text-axiom-text-primary mb-4">
            Risk Assessment
          </h4>
          <div className={`p-4 rounded-lg ${risk.bg} mb-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-axiom-text-primary">Overall Risk</span>
              <span className={`font-bold ${risk.color}`}>{risk.level}</span>
            </div>
            <div className="text-sm text-axiom-text-secondary">
              Risk Score: {compound.riskScore.toFixed(2)} / 10.0
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-axiom-text-primary mb-2">Key Risk Factors:</div>
            {compound.name === 'Troglitazone' && (
              <>
                <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-700">Quinone-forming potential</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-700">Mitochondrial toxicity</span>
                </div>
              </>
            )}
            {compound.name === 'Nefazodone' && (
              <>
                <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-orange-700">Complex metabolism</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-orange-700">CYP3A4 interactions</span>
                </div>
              </>
            )}
            {compound.name === 'Metformin' && (
              <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">Excellent safety profile</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <h4 className="text-md font-semibold text-axiom-text-primary mb-3">
          Export & Analysis Options
        </h4>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-axiom-button-yellow text-axiom-text-primary rounded-lg hover:bg-yellow-300 transition-colors font-medium">
            Export 3D Model
          </button>
          <button className="px-4 py-2 bg-white border border-axiom-border-light text-axiom-text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-white border border-axiom-border-light text-axiom-text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Compare Structure
          </button>
        </div>
      </div>
    </div>
  );
}
