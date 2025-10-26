"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Compound } from '../../lib/types';
import ThreeJSMoleculeViewer from './components/ThreeJSMoleculeViewer';
import ExpandableModal from '../ExpandableModal';
import Enhanced3DStructureModal from './modals/Enhanced3DStructureModal';
import EnhancedReal3DModal from './modals/EnhancedReal3DModal';

// Dynamically import Real3DMoleculeViewer to prevent SSR issues
const Real3DMoleculeViewer = dynamic(() => import('./components/Real3DMoleculeViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-axiom-bg-graph-white rounded-lg flex items-center justify-center">
      <div className="text-axiom-text-secondary text-sm">Loading 3D Structure...</div>
    </div>
  )
});

interface ThreeMolecularTabProps {
  compound: Compound;
}

export default function ThreeMolecularTab({ compound }: ThreeMolecularTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRealModalOpen, setIsRealModalOpen] = useState(false);
  const getRiskLevel = (score: number) => {
    if (score < 3.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
    if (score < 6.6) return { level: 'Medium', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getCompoundProperties = (compoundName: string) => {
    switch (compoundName) {
      case 'Metformin':
        return { mw: '129.16', logp: '-2.64', formula: 'C₄H₁₁N₅' };
      case 'Nefazodone':
        return { mw: '466.51', logp: '4.23', formula: 'C₂₅H₃₂ClN₅O₂' };
      case 'Troglitazone':
        return { mw: '441.54', logp: '4.65', formula: 'C₂₄H₂₇NO₅S' };
      case 'Aspirin':
        return { mw: '180.16', logp: '1.19', formula: 'C₉H₈O₄' };
      case 'Atorvastatin':
        return { mw: '558.64', logp: '5.7', formula: 'C₃₃H₃₅FN₂O₅' };
      case 'Lisinopril':
        return { mw: '405.49', logp: '-1.22', formula: 'C₂₁H₃₁N₃O₅' };
      case 'Ketoconazole':
        return { mw: '531.43', logp: '4.35', formula: 'C₂₆H₂₈Cl₂N₄O₄' };
      case 'Diclofenac':
        return { mw: '296.15', logp: '4.51', formula: 'C₁₄H₁₁Cl₂NO₂' };
      case 'Amiodarone':
        return { mw: '645.31', logp: '7.6', formula: 'C₂₅H₂₉I₂NO₃' };
      default:
        return { mw: '245.32', logp: '2.15', formula: 'C₁₂H₁₅NO₃' };
    }
  };

  const getToxicityAnalysis = (compound: Compound) => {
    const riskLevel = getRiskLevel(compound.riskScore);
    
    switch (compound.name) {
      case 'Metformin':
        return {
          hepatotoxic: 'Minimal risk',
          reactive: 'Low potential',
          mechanism: 'Mitochondrial effects',
          sites: 'No major hotspots'
        };
      case 'Nefazodone':
        return {
          hepatotoxic: 'Moderate concern',
          reactive: 'CYP3A4 metabolites',
          mechanism: 'Oxidative stress',
          sites: 'Triazolone moiety'
        };
      case 'Troglitazone':
        return {
          hepatotoxic: 'High risk',
          reactive: 'Quinone formation',
          mechanism: 'Mitochondrial toxicity',
          sites: 'Chromane ring system'
        };
      default:
        return {
          hepatotoxic: riskLevel.level + ' concern',
          reactive: compound.riskScore > 6.6 ? 'High potential' : compound.riskScore > 3.3 ? 'Moderate' : 'Low risk',
          mechanism: 'Multiple pathways',
          sites: compound.riskScore > 6.6 ? 'Multiple sites' : 'Limited hotspots'
        };
    }
  };

  const risk = getRiskLevel(compound.riskScore);
  const properties = getCompoundProperties(compound.name);
  const toxicity = getToxicityAnalysis(compound);

  return (
    <div className="space-y-4">
      {/* Real 3D Structure Card */}
      <div
        className="bg-axiom-bg-card rounded-lg border border-axiom-border-light p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50"
        onClick={() => setIsRealModalOpen(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-axiom-text-primary">
            Real 3D Structure
          </h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            PubChem
          </span>
        </div>

        <div className="h-48 w-full">
          <Real3DMoleculeViewer key={compound.name} compound={compound} className="w-full h-full" height={180} />
        </div>

        <div className="mt-3 text-xs text-axiom-text-secondary">
          🧬 <strong>Authentic:</strong> Real molecular data from PubChem • Click to expand
        </div>
      </div>

      {/* Molecular Properties */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <h4 className="text-sm font-medium text-axiom-text-primary mb-3">
          Molecular Properties
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Formula</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {properties.formula}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Mol. Weight</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {properties.mw} g/mol
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">LogP</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {properties.logp}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Risk Score</span>
              <span className={`text-sm font-medium ${risk.color}`}>
                {compound.riskScore.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Category</span>
              <span className={`text-sm font-medium ${risk.color}`}>
                {risk.level}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">EC50</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {compound.ec50.toExponential(1)} M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structural Risk Analysis */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <h4 className="text-sm font-medium text-axiom-text-primary mb-3">
          Structural Risk Analysis
        </h4>
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${risk.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-axiom-text-primary">Hepatotoxic Potential</span>
              <span className={`text-sm font-medium ${risk.color}`}>
                {toxicity.hepatotoxic}
              </span>
            </div>
            <div className="text-xs text-axiom-text-secondary">
              Primary concern based on structural alerts and historical data
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">Reactive Metabolites</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {toxicity.reactive}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">Primary Mechanism</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {toxicity.mechanism}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">Risk Sites</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {toxicity.sites}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structural Alerts */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <h4 className="text-sm font-medium text-axiom-text-primary mb-3">
          Structural Alerts
        </h4>
        <div className="space-y-2">
          {compound.name === 'Troglitazone' && (
            <>
              <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-700">Quinone-forming potential</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-700">Thiazolidinedione core</span>
              </div>
            </>
          )}
          {compound.name === 'Nefazodone' && (
            <>
              <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-700">Triazolone metabolite</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-700">CYP3A4 substrate</span>
              </div>
            </>
          )}
          {compound.name === 'Metformin' && (
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">No major structural alerts</span>
            </div>
          )}
          {!['Troglitazone', 'Nefazodone', 'Metformin'].includes(compound.name) && (
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Standard pharmaceutical scaffold</span>
            </div>
          )}
        </div>
      </div>

      {/* 3D Molecular Viewer - Clickable Card */}
      <div
        className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4 cursor-pointer hover:shadow-md transition-all duration-200 relative group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-axiom-text-primary">
            Interactive 3D Structure
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
              Three.js
            </span>
            <span className="text-xs text-axiom-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              Click to expand
            </span>
          </div>
        </div>

        <div className="h-48">
          <ThreeJSMoleculeViewer compound={compound} className="h-full" />
        </div>

        <div className="mt-3 text-xs text-axiom-text-secondary">
          🖱️ <strong>Interactive:</strong> Click & drag to rotate • Hover to pause
        </div>
      </div>
      {/* Expandable Modals */}
      <ExpandableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`3D Structure Analysis: ${compound.name}`}
      >
        <Enhanced3DStructureModal compound={compound} />
      </ExpandableModal>

      <ExpandableModal
        isOpen={isRealModalOpen}
        onClose={() => setIsRealModalOpen(false)}
        title={`Real 3D Structure: ${compound.name}`}
      >
        <EnhancedReal3DModal compound={compound} />
      </ExpandableModal>
    </div>
  );
}
