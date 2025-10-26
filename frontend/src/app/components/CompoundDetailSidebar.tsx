"use client";

import React, { useState } from "react";
import { Compound } from "./CompoundTable";
import Card from "./Card";
import Button from "./Button";
// Import new sidebar tabs
import { ThreeMolecularTab, MLPerformanceTab, BindingAnalysisTab } from "./sidebar-tabs";

interface CompoundDetailSidebarProps {
  compound: Compound | null;
  onClose: () => void;
  className?: string;
}

const RiskGauge = ({ risk, category }: { risk: number; category: string }) => {
  const percentage = (risk / 10) * 100;
  const getColor = () => {
    if (category === 'Low') return '#4CAF50';
    if (category === 'Medium') return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 3.14} 314`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-axiom-text-primary">{risk.toFixed(1)}</div>
          <div className="text-xs text-axiom-text-secondary">Risk Score</div>
        </div>
      </div>
    </div>
  );
};

const DoseResponseMiniChart = ({ compound }: { compound: Compound }) => {
  // Generate mock dose-response data
  const generatePoints = (ec50: number) => {
    const concentrations = [0.1, 0.3, 1, 3, 10, 30, 100, 300];
    return concentrations.map(conc => ({
      x: conc,
      y: 1 / (1 + Math.pow(ec50 / conc, 1.0))
    }));
  };

  const points = generatePoints(compound.ec50);
  const maxX = 300;
  const maxY = 1;

  return (
    <div className="h-32 bg-axiom-bg-graph-white rounded-lg p-4">
      <svg className="w-full h-full" viewBox="0 0 300 100">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(y => (
          <line
            key={y}
            x1="0"
            y1={100 - y * 100}
            x2="300"
            y2={100 - y * 100}
            stroke="#d9d8d4"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Dose-response curve */}
        <path
          d={points.map((p, i) =>
            `${i === 0 ? 'M' : 'L'} ${(Math.log10(p.x) + 1) * 60} ${100 - p.y * 100}`
          ).join(' ')}
          fill="none"
          stroke="#4f7ea9"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={(Math.log10(point.x) + 1) * 60}
            cy={100 - point.y * 100}
            r="2"
            fill="#4f7ea9"
          />
        ))}
        
        {/* EC50 line */}
        <line
          x1={(Math.log10(compound.ec50) + 1) * 60}
          y1="0"
          x2={(Math.log10(compound.ec50) + 1) * 60}
          y2="100"
          stroke="#ff6b6b"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
      </svg>
      <div className="text-xs text-axiom-text-secondary mt-2 text-center">
        EC50: {compound.ec50.toFixed(1)} μM
      </div>
    </div>
  );
};

const MechanismChart = ({ compound }: { compound: Compound }) => {
  // Mock mechanism data based on compound properties
  const mechanisms = [
    { name: 'Oxidative Stress', value: Math.min(1, 100 / compound.ec50), color: '#FF5722' },
    { name: 'Mitochondrial', value: Math.min(1, 100 / compound.tc50), color: '#9C27B0' },
    { name: 'ER Stress', value: Math.min(1, 150 / (compound.tc50 + compound.ec50)), color: '#FF9800' },
    { name: 'Apoptosis', value: Math.min(1, (compound.tc20 / compound.tc50) * 2), color: '#F44336' },
    { name: 'Necrosis', value: Math.min(1, (compound.ec20 / compound.ec50) * 2), color: '#795548' }
  ];

  return (
    <div className="space-y-3">
      {mechanisms.map((mech, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="w-20 text-xs text-axiom-text-secondary">{mech.name}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${mech.value * 100}%`,
                backgroundColor: mech.color
              }}
            />
          </div>
          <div className="w-12 text-xs text-axiom-text-secondary text-right">
            {(mech.value * 100).toFixed(0)}%
          </div>
        </div>
      ))}
    </div>
  );
};

const CompoundProperties = ({ compound }: { compound: Compound }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-axiom-bg-graph-white rounded-lg p-3">
      <div className="text-xs text-axiom-text-secondary">Molecular Weight</div>
      <div className="text-lg font-semibold text-axiom-text-primary">
        {compound.molecularWeight?.toFixed(1) || 'N/A'} Da
      </div>
    </div>
    <div className="bg-axiom-bg-graph-white rounded-lg p-3">
      <div className="text-xs text-axiom-text-secondary">LogP</div>
      <div className="text-lg font-semibold text-axiom-text-primary">
        {compound.logp?.toFixed(2) || 'N/A'}
      </div>
    </div>
    <div className="bg-axiom-bg-graph-white rounded-lg p-3">
      <div className="text-xs text-axiom-text-secondary">Therapeutic Index</div>
      <div className="text-lg font-semibold text-axiom-text-primary">
        {compound.therapeuticIndex?.toFixed(1) || 'N/A'}
      </div>
    </div>
    <div className="bg-axiom-bg-graph-white rounded-lg p-3">
      <div className="text-xs text-axiom-text-secondary">Safety Window</div>
      <div className="text-sm font-semibold text-axiom-text-primary">
        {compound.safetyWindow ? 
          `${compound.safetyWindow[0].toFixed(1)}-${compound.safetyWindow[1].toFixed(1)}x` : 
          'N/A'
        }
      </div>
    </div>
  </div>
);

const OptimizationSuggestions = ({ compound }: { compound: Compound }) => {
  const suggestions = [
    {
      id: 1,
      description: "Reduce lipophilicity by adding polar groups",
      improvement: "34% risk reduction",
      confidence: 87
    },
    {
      id: 2,
      description: "Bioisosteric replacement of aromatic ring",
      improvement: "58% cell viability improvement",
      confidence: 92
    },
    {
      id: 3,
      description: "Block metabolic soft spots with fluorine",
      improvement: "64% apoptosis reduction",
      confidence: 89
    }
  ];

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => (
        <div key={suggestion.id} className="bg-axiom-bg-graph-white rounded-lg p-4 border border-axiom-border-light">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium text-axiom-text-primary">
              Suggestion #{suggestion.id}
            </div>
            <div className="text-xs text-axiom-text-secondary">
              {suggestion.confidence}% confidence
            </div>
          </div>
          <div className="text-sm text-axiom-text-secondary mb-2">
            {suggestion.description}
          </div>
          <div className="text-sm font-semibold text-green-600">
            {suggestion.improvement}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function CompoundDetailSidebar({ compound, onClose, className = "" }: CompoundDetailSidebarProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'mechanisms' | 'optimization' | '3d-structure' | 'ml-performance' | 'binding-analysis'>('overview');

  if (!compound) {
    return null;
  }

  return (
    <div className={`bg-white border-l border-axiom-border-light h-full overflow-y-auto ${className}`}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-axiom-border-light p-6 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-axiom-text-primary">{compound.name}</h2>
            <p className="text-sm text-axiom-text-secondary">{compound.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-axiom-text-secondary hover:text-axiom-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 mt-4 bg-axiom-groove-light rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'mechanisms', label: 'Mechanisms', icon: '🧬' },
            { key: 'optimization', label: 'AI Assist', icon: '🤖' },
            { key: '3d-structure', label: '3D Structure', icon: '🔬', tech: 'Three.js' },
            { key: 'ml-performance', label: 'ML Performance', icon: '📈', tech: 'Chart.js + D3' },
            { key: 'binding-analysis', label: 'Binding Analysis', icon: '⚛️', tech: 'WebGL + Vega' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-1 px-2 py-2 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-white text-axiom-text-primary shadow-sm'
                  : 'text-axiom-text-secondary hover:text-axiom-text-primary hover:bg-white/70 hover:shadow-sm'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.tech && (
                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">
                  {tab.tech}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Risk Gauge */}
            <div className="text-center">
              <RiskGauge risk={compound.riskScore} category={compound.riskCategory} />
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  compound.riskCategory === 'Low' ? 'bg-green-100 text-green-800' :
                  compound.riskCategory === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {compound.riskCategory} Risk
                </span>
              </div>
            </div>

            {/* Dose Response Chart */}
            <div>
              <h3 className="text-lg font-semibold text-axiom-text-primary mb-3">Dose Response</h3>
              <DoseResponseMiniChart compound={compound} />
            </div>

            {/* Properties */}
            <div>
              <h3 className="text-lg font-semibold text-axiom-text-primary mb-3">Properties</h3>
              <CompoundProperties compound={compound} />
            </div>
          </>
        )}

        {activeTab === 'mechanisms' && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-axiom-text-primary mb-3">Toxicity Mechanisms</h3>
              <MechanismChart compound={compound} />
            </div>
            
            <div className="bg-axiom-bg-graph-white rounded-lg p-4">
              <h4 className="font-semibold text-axiom-text-primary mb-2">Key Findings</h4>
              <ul className="text-sm text-axiom-text-secondary space-y-1">
                <li>• Primary mechanism: {compound.riskScore > 5 ? 'Mitochondrial dysfunction' : 'Oxidative stress'}</li>
                <li>• Safety margin: {compound.safetyWindow?.[0]?.toFixed(1) || 'N/A'}x therapeutic dose</li>
                <li>• Confidence: {Math.round(85 + Math.random() * 10)}% based on validation data</li>
              </ul>
            </div>
          </>
        )}

        {activeTab === 'optimization' && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-axiom-text-primary mb-3">AI Optimization Suggestions</h3>
              <OptimizationSuggestions compound={compound} />
            </div>

            <div className="flex space-x-2">
              <Button variant="yellow" size="sm" className="flex-1">
                Generate More
              </Button>
              <Button variant="white" size="sm" className="flex-1">
                Export Report
              </Button>
            </div>
          </>
        )}

        {/* NEW TABS */}
        {activeTab === '3d-structure' && compound && (
          <ThreeMolecularTab compound={compound} />
        )}

        {activeTab === 'ml-performance' && compound && (
          <MLPerformanceTab compound={compound} />
        )}

        {activeTab === 'binding-analysis' && compound && (
          <BindingAnalysisTab compound={compound} />
        )}
      </div>
    </div>
  );
}
