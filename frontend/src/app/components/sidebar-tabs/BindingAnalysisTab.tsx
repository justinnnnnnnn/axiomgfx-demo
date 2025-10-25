"use client";

import React from 'react';
import { Compound } from '../../lib/types';
import WebGLDockingViewer from './components/WebGLDockingViewer';
import VegaDoseResponseComparison from './components/VegaDoseResponseComparison';

interface BindingAnalysisTabProps {
  compound: Compound;
}

export default function BindingAnalysisTab({ compound }: BindingAnalysisTabProps) {
  // Get binding kinetics data based on compound
  const getBindingKinetics = (compound: Compound) => {
    const compoundKinetics: Record<string, any> = {
      'Metformin': {
        associationRate: '1.2×10⁶',
        dissociationRate: '2.1×10⁻³',
        residenceTime: '8.2',
        targetProtein: 'Complex I',
        bindingMode: 'Competitive'
      },
      'Nefazodone': {
        associationRate: '8.7×10⁵',
        dissociationRate: '4.3×10⁻³',
        residenceTime: '3.9',
        targetProtein: 'CYP3A4',
        bindingMode: 'Non-competitive'
      },
      'Troglitazone': {
        associationRate: '5.4×10⁵',
        dissociationRate: '7.8×10⁻³',
        residenceTime: '2.1',
        targetProtein: 'PPARγ',
        bindingMode: 'Allosteric'
      },
      'Aspirin': {
        associationRate: '2.3×10⁶',
        dissociationRate: '1.8×10⁻³',
        residenceTime: '9.3',
        targetProtein: 'COX-1',
        bindingMode: 'Irreversible'
      },
      'Atorvastatin': {
        associationRate: '1.8×10⁶',
        dissociationRate: '2.9×10⁻³',
        residenceTime: '5.7',
        targetProtein: 'HMG-CoA',
        bindingMode: 'Competitive'
      },
      default: {
        associationRate: '9.2×10⁵',
        dissociationRate: '3.5×10⁻³',
        residenceTime: '4.8',
        targetProtein: 'Target Protein',
        bindingMode: 'Mixed'
      }
    };

    return compoundKinetics[compound.name] || compoundKinetics.default;
  };

  const getStructuralFeatures = (compound: Compound) => {
    const features: Record<string, string[]> = {
      'Metformin': [
        'Biguanide core structure',
        'Multiple hydrogen bond donors',
        'High polarity (LogP = -2.64)',
        'Minimal protein binding'
      ],
      'Nefazodone': [
        'Triazolone pharmacophore',
        'Phenylpiperazine moiety',
        'Moderate lipophilicity',
        'CYP3A4 substrate'
      ],
      'Troglitazone': [
        'Thiazolidinedione core',
        'Chromane ring system',
        'Quinone-forming potential',
        'High protein binding'
      ],
      'Aspirin': [
        'Acetyl salicylic acid',
        'Irreversible COX inhibitor',
        'Rapid hydrolysis',
        'Low molecular weight'
      ],
      default: [
        'Standard pharmaceutical scaffold',
        'Moderate binding affinity',
        'Typical ADMET properties',
        'Drug-like characteristics'
      ]
    };

    return features[compound.name] || features.default;
  };

  const kinetics = getBindingKinetics(compound);
  const structuralFeatures = getStructuralFeatures(compound);

  // Get binding assessment
  const getBindingAssessment = (compound: Compound) => {
    if (compound.riskScore > 6.6) {
      return {
        overall: 'High Risk Binding Profile',
        color: 'text-red-600',
        bg: 'bg-red-50',
        description: 'Strong binding may contribute to toxicity through off-target effects or metabolite formation.'
      };
    } else if (compound.riskScore > 3.3) {
      return {
        overall: 'Moderate Binding Profile',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        description: 'Binding characteristics suggest moderate risk with potential for optimization.'
      };
    } else {
      return {
        overall: 'Favorable Binding Profile',
        color: 'text-green-600',
        bg: 'bg-green-50',
        description: 'Binding profile supports low toxicity risk with good selectivity.'
      };
    }
  };

  const assessment = getBindingAssessment(compound);

  return (
    <div className="space-y-4">
      {/* WebGL Protein-Ligand Docking */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-axiom-text-primary">
            Protein-Ligand Docking Simulation
          </h4>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
            WebGL
          </span>
        </div>
        
        <WebGLDockingViewer compound={compound} />
        
        <div className="mt-3 text-xs text-axiom-text-secondary">
          🔬 <strong>Real-time simulation:</strong> Molecular dynamics showing protein-ligand interactions
        </div>
      </div>

      {/* Vega Dose-Response Comparison */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <VegaDoseResponseComparison compound={compound} />
      </div>

      {/* Binding Kinetics Details */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <h4 className="text-sm font-medium text-axiom-text-primary mb-3">
          Binding Kinetics & Target Information
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Target Protein</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {kinetics.targetProtein}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Binding Mode</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {kinetics.bindingMode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Association Rate (ka)</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {kinetics.associationRate} M⁻¹s⁻¹
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Dissociation Rate (kd)</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {kinetics.dissociationRate} s⁻¹
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Residence Time</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {kinetics.residenceTime} minutes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-axiom-text-secondary">Selectivity Index</span>
              <span className="text-sm font-medium text-axiom-text-primary">
                {compound.riskScore < 3.3 ? '> 100' : compound.riskScore < 6.6 ? '25-100' : '< 25'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structural Features */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <h4 className="text-sm font-medium text-axiom-text-primary mb-3">
          Key Structural Features
        </h4>
        <div className="space-y-2">
          {structuralFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-axiom-graph-blue rounded-full mt-1.5 shrink-0"></div>
              <span className="text-sm text-axiom-text-primary">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Binding Assessment */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <h4 className="text-sm font-medium text-axiom-text-primary mb-3">
          Binding Profile Assessment
        </h4>
        <div className={`p-3 rounded-lg ${assessment.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-axiom-text-primary">Overall Assessment</span>
            <span className={`text-sm font-medium ${assessment.color}`}>
              {assessment.overall}
            </span>
          </div>
          <div className="text-sm text-axiom-text-secondary">
            {assessment.description}
          </div>
        </div>

        {/* Specific insights based on compound */}
        <div className="mt-3 space-y-2">
          {compound.name === 'Metformin' && (
            <div className="flex items-start space-x-2 p-2 bg-green-50 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <div className="text-sm">
                <span className="font-medium text-green-700">Favorable Profile:</span>
                <span className="text-green-600 ml-1">Minimal off-target binding, renal clearance</span>
              </div>
            </div>
          )}
          {compound.name === 'Troglitazone' && (
            <div className="flex items-start space-x-2 p-2 bg-red-50 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
              <div className="text-sm">
                <span className="font-medium text-red-700">Risk Factor:</span>
                <span className="text-red-600 ml-1">Quinone metabolites bind covalently to proteins</span>
              </div>
            </div>
          )}
          {compound.name === 'Nefazodone' && (
            <div className="flex items-start space-x-2 p-2 bg-orange-50 rounded">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
              <div className="text-sm">
                <span className="font-medium text-orange-700">Consideration:</span>
                <span className="text-orange-600 ml-1">Complex metabolism may affect binding kinetics</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <h4 className="text-sm font-medium text-axiom-text-primary mb-3">
          Binding Optimization Opportunities
        </h4>
        <div className="space-y-2 text-sm">
          {compound.riskScore > 6.6 ? (
            <>
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <span className="text-blue-600">🎯</span>
                <span className="text-blue-700">Reduce binding affinity to off-target proteins</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <span className="text-blue-600">⚡</span>
                <span className="text-blue-700">Modify structure to prevent reactive metabolite formation</span>
              </div>
            </>
          ) : compound.riskScore > 3.3 ? (
            <>
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <span className="text-blue-600">🔧</span>
                <span className="text-blue-700">Fine-tune selectivity profile for improved safety</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <span className="text-blue-600">📊</span>
                <span className="text-blue-700">Optimize residence time for better efficacy</span>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <span className="text-green-600">✅</span>
              <span className="text-green-700">Current binding profile supports continued development</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
