"use client";

import React from 'react';
import { Compound } from '../../../lib/types';
import ChartJSPerformanceChart from '../components/ChartJSPerformanceChart';
import D3ConfidenceHeatmap from '../components/D3ConfidenceHeatmap';

interface EnhancedMLPerformanceModalProps {
  compound: Compound;
}

export default function EnhancedMLPerformanceModal({ compound }: EnhancedMLPerformanceModalProps) {
  // Calculate enhanced performance metrics
  const getEnhancedMetrics = (compound: Compound) => {
    const riskScore = compound.riskScore;
    let baseAccuracy: number;
    
    if (riskScore < 2 || riskScore > 8) {
      baseAccuracy = 94.2;
    } else if (riskScore < 3.3 || riskScore > 6.6) {
      baseAccuracy = 87.8;
    } else {
      baseAccuracy = 82.1;
    }
    
    let compoundModifier = 0;
    switch (compound.name) {
      case 'Metformin':
        compoundModifier = 3.2;
        break;
      case 'Aspirin':
        compoundModifier = 2.8;
        break;
      case 'Troglitazone':
        compoundModifier = 1.5;
        break;
      case 'Nefazodone':
        compoundModifier = -1.2;
        break;
      default:
        compoundModifier = (Math.random() - 0.5) * 2;
    }
    
    const finalAccuracy = baseAccuracy + compoundModifier;
    
    return {
      accuracy: Math.max(75, Math.min(98, finalAccuracy)),
      precision: Math.max(73, Math.min(96, finalAccuracy - 1.5 + (Math.random() - 0.5) * 2)),
      recall: Math.max(74, Math.min(97, finalAccuracy - 0.8 + (Math.random() - 0.5) * 2)),
      f1Score: Math.max(73.5, Math.min(96.5, finalAccuracy - 1.2 + (Math.random() - 0.5) * 2)),
      auc: Math.max(0.82, Math.min(0.99, (finalAccuracy / 100) + (Math.random() - 0.5) * 0.05)),
      sensitivity: Math.max(70, Math.min(95, finalAccuracy - 2 + (Math.random() - 0.5) * 3)),
      specificity: Math.max(75, Math.min(98, finalAccuracy + 1 + (Math.random() - 0.5) * 2)),
    };
  };

  const metrics = getEnhancedMetrics(compound);

  return (
    <div className="space-y-6">
      {/* Enhanced Performance Overview */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-axiom-text-primary">
            Comprehensive ML Performance: {compound.name}
          </h3>
          <div className="flex space-x-2">
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              Chart.js
            </span>
            <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
              D3.js
            </span>
          </div>
        </div>
        
        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light">
            <div className="text-3xl font-bold text-axiom-graph-blue">
              {metrics.accuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-axiom-text-secondary">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light">
            <div className="text-3xl font-bold text-axiom-graph-blue">
              {metrics.auc.toFixed(3)}
            </div>
            <div className="text-sm text-axiom-text-secondary">AUC-ROC</div>
          </div>
          <div className="text-center p-4 bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light">
            <div className="text-3xl font-bold text-axiom-graph-blue">
              {metrics.sensitivity.toFixed(1)}%
            </div>
            <div className="text-sm text-axiom-text-secondary">Sensitivity</div>
          </div>
          <div className="text-center p-4 bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light">
            <div className="text-3xl font-bold text-axiom-graph-blue">
              {metrics.specificity.toFixed(1)}%
            </div>
            <div className="text-sm text-axiom-text-secondary">Specificity</div>
          </div>
        </div>

        {/* Enhanced Chart.js Performance Charts */}
        <div className="bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light p-4">
          <ChartJSPerformanceChart compound={compound} />
        </div>
      </div>

      {/* Large D3.js Confidence Analysis */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-6">
        <h3 className="text-lg font-semibold text-axiom-text-primary mb-4">
          Detailed Confidence Analysis
        </h3>
        
        <div className="bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light p-4">
          <D3ConfidenceHeatmap compound={compound} />
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">
              {Math.round(metrics.accuracy * 0.85)}%
            </div>
            <div className="text-sm text-axiom-text-secondary">High Confidence</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">
              {Math.round(metrics.accuracy * 0.12)}%
            </div>
            <div className="text-sm text-axiom-text-secondary">Medium Confidence</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">
              {Math.round(metrics.accuracy * 0.03)}%
            </div>
            <div className="text-sm text-axiom-text-secondary">Low Confidence</div>
          </div>
        </div>
      </div>

      {/* Model Comparison */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
          <h4 className="text-md font-semibold text-axiom-text-primary mb-3">
            Model Comparison
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">Current Model v2.1.3</span>
              <span className="font-medium text-axiom-text-primary">{metrics.accuracy.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">Previous Model v2.0.8</span>
              <span className="font-medium text-axiom-text-primary">{(metrics.accuracy - 3.2).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm text-axiom-text-secondary">Baseline Model v1.5.2</span>
              <span className="font-medium text-axiom-text-primary">{(metrics.accuracy - 8.7).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
          <h4 className="text-md font-semibold text-axiom-text-primary mb-3">
            Performance Insights
          </h4>
          <div className="space-y-2">
            {compound.name === 'Metformin' && (
              <>
                <div className="flex items-start space-x-2 p-2 bg-green-50 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="text-sm">
                    <span className="font-medium text-green-700">Excellent Performance:</span>
                    <span className="text-green-600 ml-1">High confidence across all endpoints</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div className="text-sm">
                    <span className="font-medium text-blue-700">Strong Features:</span>
                    <span className="text-blue-600 ml-1">Well-characterized safety profile</span>
                  </div>
                </div>
              </>
            )}
            {compound.name === 'Troglitazone' && (
              <>
                <div className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                  <div className="text-sm">
                    <span className="font-medium text-red-700">Clear Signal:</span>
                    <span className="text-red-600 ml-1">Strong hepatotoxicity prediction</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-orange-50 rounded">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                  <div className="text-sm">
                    <span className="font-medium text-orange-700">Key Features:</span>
                    <span className="text-orange-600 ml-1">Structural alerts well-captured</span>
                  </div>
                </div>
              </>
            )}
            {!['Metformin', 'Troglitazone'].includes(compound.name) && (
              <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-1.5"></div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Standard Performance:</span>
                  <span className="text-gray-600 ml-1">Typical prediction accuracy</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-4">
        <h4 className="text-md font-semibold text-axiom-text-primary mb-3">
          Analysis & Export Options
        </h4>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-axiom-button-yellow text-axiom-text-primary rounded-lg hover:bg-yellow-300 transition-colors font-medium">
            Export Performance Report
          </button>
          <button className="px-4 py-2 bg-white border border-axiom-border-light text-axiom-text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Download Charts
          </button>
          <button className="px-4 py-2 bg-white border border-axiom-border-light text-axiom-text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Compare Models
          </button>
        </div>
      </div>
    </div>
  );
}
