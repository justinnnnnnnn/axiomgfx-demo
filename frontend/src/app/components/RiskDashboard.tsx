import React, { useState } from "react";
import { Compound } from "./CompoundTable";

interface RiskDashboardProps {
  compounds: Compound[];
  onCompoundSelect?: (compound: Compound) => void;
  selectedCompound?: Compound | null;
  className?: string;
}

const HorizontalBarChart = ({ compounds, onCompoundSelect, selectedCompound }: {
  compounds: Compound[];
  onCompoundSelect?: (compound: Compound) => void;
  selectedCompound?: Compound | null;
}) => {
  const maxRisk = Math.max(...compounds.map(c => c.riskScore));
  const sortedCompounds = [...compounds].sort((a, b) => b.riskScore - a.riskScore);

  const getRiskColor = (risk: number) => {
    if (risk < 3.3) return 'from-green-400 to-green-600';
    if (risk < 6.6) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  const getRiskBgColor = (risk: number) => {
    if (risk < 3.3) return 'bg-green-50';
    if (risk < 6.6) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-2">
      {sortedCompounds.map((compound, index) => {
        const barWidth = (compound.riskScore / maxRisk) * 100;
        const isSelected = selectedCompound?.id === compound.id;
        
        return (
          <div
            key={compound.id}
            className={`
              group cursor-pointer transition-all duration-200 rounded-lg p-3 overflow-hidden
              ${isSelected ? 'bg-axiom-yellow-light border-2 border-axiom-yellow-button' : getRiskBgColor(compound.riskScore)}
              hover:shadow-md hover:scale-[1.01]
            `}
            onClick={() => onCompoundSelect?.(compound)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-axiom-text-primary min-w-0 flex-1">
                  {compound.name}
                </div>
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${compound.riskCategory === 'Low' ? 'bg-green-100 text-green-800' :
                    compound.riskCategory === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }
                `}>
                  {compound.riskCategory}
                </div>
              </div>
              <div className="text-lg font-bold text-axiom-text-primary">
                {compound.riskScore.toFixed(1)}
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-linear-to-r ${getRiskColor(compound.riskScore)} transition-all duration-1000 ease-out`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              
              {/* Safety window indicator */}
              {compound.safetyWindow && (
                <div className="flex justify-between text-xs text-axiom-text-secondary mt-1">
                  <span>Safety Window: {compound.safetyWindow[0].toFixed(1)}-{compound.safetyWindow[1].toFixed(1)}x</span>
                  <span>TI: {compound.therapeuticIndex?.toFixed(1) || 'N/A'}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const RiskDistributionChart = ({ compounds }: { compounds: Compound[] }) => {
  const lowRisk = compounds.filter(c => c.riskCategory === 'Low').length;
  const mediumRisk = compounds.filter(c => c.riskCategory === 'Medium').length;
  const highRisk = compounds.filter(c => c.riskCategory === 'High').length;
  const total = compounds.length;

  const data = [
    { label: 'Low Risk', count: lowRisk, percentage: (lowRisk / total) * 100, color: 'bg-green-500' },
    { label: 'Medium Risk', count: mediumRisk, percentage: (mediumRisk / total) * 100, color: 'bg-yellow-500' },
    { label: 'High Risk', count: highRisk, percentage: (highRisk / total) * 100, color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-axiom-border-light">
      <h3 className="text-lg font-semibold text-axiom-text-primary mb-4">Risk Distribution</h3>
      
      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {data.map((item, index) => {
              const radius = 45;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = (item.percentage / 100) * circumference;
              const strokeDashoffset = -data.slice(0, index).reduce((acc, d) => acc + (d.percentage / 100) * circumference, 0);
              
              return (
                <circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={item.color.replace('bg-', '').replace('-500', '')}
                  strokeWidth="12"
                  strokeDasharray={`${strokeDasharray} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-axiom-text-primary">{total}</div>
              <div className="text-xs text-axiom-text-secondary">Compounds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm text-axiom-text-secondary">{item.label}</span>
            </div>
            <div className="text-sm font-medium text-axiom-text-primary">
              {item.count} ({item.percentage.toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RiskMetrics = ({ compounds }: { compounds: Compound[] }) => {
  const avgRisk = compounds.reduce((sum, c) => sum + c.riskScore, 0) / compounds.length;
  const highRiskCount = compounds.filter(c => c.riskCategory === 'High').length;
  const safeCompounds = compounds.filter(c => c.riskCategory === 'Low').length;
  const avgMW = compounds.reduce((sum, c) => sum + (c.molecularWeight || 0), 0) / compounds.length;

  const metrics = [
    {
      label: 'Average Risk Score',
      value: avgRisk.toFixed(2),
      trend: avgRisk > 5 ? 'up' : 'down',
      color: avgRisk > 5 ? 'text-red-600' : 'text-green-600'
    },
    {
      label: 'High Risk Compounds',
      value: highRiskCount.toString(),
      trend: 'neutral',
      color: 'text-axiom-text-primary'
    },
    {
      label: 'Safe Compounds',
      value: safeCompounds.toString(),
      trend: 'down',
      color: 'text-green-600'
    },
    {
      label: 'Avg Molecular Weight',
      value: avgMW.toFixed(0) + ' Da',
      trend: 'neutral',
      color: 'text-axiom-text-primary'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg p-4 border border-axiom-border-light">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-axiom-text-secondary">{metric.label}</div>
              <div className={`text-xl font-bold ${metric.color}`}>{metric.value}</div>
            </div>
            <div className="text-axiom-text-secondary">
              {metric.trend === 'up' && '↗️'}
              {metric.trend === 'down' && '↘️'}
              {metric.trend === 'neutral' && '➡️'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function RiskDashboard({ compounds, onCompoundSelect, selectedCompound, className = "" }: RiskDashboardProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-axiom-text-primary">DILI Risk Dashboard</h2>
          <p className="text-axiom-text-secondary">Comprehensive toxicity risk analysis</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'chart'
                ? 'bg-axiom-yellow-button text-axiom-text-primary'
                : 'bg-white text-axiom-text-secondary hover:text-axiom-text-primary'
            }`}
          >
            Chart View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-axiom-yellow-button text-axiom-text-primary'
                : 'bg-white text-axiom-text-secondary hover:text-axiom-text-primary'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <RiskMetrics compounds={compounds} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 border border-axiom-border-light overflow-hidden">
            <h3 className="text-lg font-semibold text-axiom-text-primary mb-4">
              Compound Risk Comparison
            </h3>
            <div className="max-h-96 overflow-y-auto overflow-x-hidden">
              <HorizontalBarChart
                compounds={compounds}
                onCompoundSelect={onCompoundSelect}
                selectedCompound={selectedCompound}
              />
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div>
          <RiskDistributionChart compounds={compounds} />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-lg p-6 border border-axiom-border-light">
        <h3 className="text-lg font-semibold text-axiom-text-primary mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-axiom-text-secondary">
                {compounds.filter(c => c.riskScore > 7).length} compounds require immediate attention
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-axiom-text-secondary">
                {compounds.filter(c => c.riskScore > 3.3 && c.riskScore < 6.6).length} compounds need optimization
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-axiom-text-secondary">
                {compounds.filter(c => c.riskScore < 3.3).length} compounds show acceptable safety profiles
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-axiom-text-secondary">
              • Average safety window: {(compounds.reduce((sum, c) => sum + (c.safetyWindow?.[0] || 0), 0) / compounds.length).toFixed(1)}x
            </div>
            <div className="text-axiom-text-secondary">
              • Compounds with TI &gt; 10: {compounds.filter(c => (c.therapeuticIndex || 0) > 10).length}
            </div>
            <div className="text-axiom-text-secondary">
              • Optimization candidates: {compounds.filter(c => c.riskScore > 3.3).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
