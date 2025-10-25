"use client";

import React, { useEffect, useRef } from 'react';
import * as vega from 'vega';
import * as vegaLite from 'vega-lite';
import vegaEmbed from 'vega-embed';
import { Compound } from '../../../lib/types';

interface VegaDoseResponseComparisonProps {
  compound: Compound;
}

export default function VegaDoseResponseComparison({ compound }: VegaDoseResponseComparisonProps) {
  const vegaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vegaRef.current) return;

    // Generate dose-response data for comparison
    const generateDoseResponseData = (compoundName: string, ec50: number, hillSlope: number = 1.0, maxResponse: number = 100) => {
      const doses = [-10, -9, -8, -7, -6, -5, -4, -3, -2];
      return doses.map(logDose => {
        const dose = Math.pow(10, logDose);
        // Hill equation: Response = MaxResponse / (1 + (EC50/dose)^HillSlope)
        const response = maxResponse / (1 + Math.pow(ec50 / dose, hillSlope));
        
        return {
          compound: compoundName,
          logDose,
          dose,
          response: Math.max(0, Math.min(maxResponse, response + (Math.random() - 0.5) * 5)), // Add some noise
          isSelected: compoundName === compound.name
        };
      });
    };

    // Get comparison compounds based on the selected compound's risk category
    const getComparisonCompounds = (selectedCompound: Compound) => {
      const riskCategory = selectedCompound.riskScore < 3.3 ? 'low' : 
                          selectedCompound.riskScore < 6.6 ? 'medium' : 'high';
      
      switch (riskCategory) {
        case 'low':
          return [
            { name: 'Safety Standard', ec50: 1e-4, hillSlope: 1.2, maxResponse: 95 },
            { name: 'Reference Low Risk', ec50: 5e-5, hillSlope: 1.0, maxResponse: 90 }
          ];
        case 'medium':
          return [
            { name: 'Safety Standard', ec50: 1e-4, hillSlope: 1.2, maxResponse: 95 },
            { name: 'Typical Medium Risk', ec50: 2e-5, hillSlope: 0.9, maxResponse: 85 }
          ];
        case 'high':
          return [
            { name: 'Safety Standard', ec50: 1e-4, hillSlope: 1.2, maxResponse: 95 },
            { name: 'Known Hepatotoxin', ec50: 8e-6, hillSlope: 1.4, maxResponse: 100 }
          ];
        default:
          return [
            { name: 'Safety Standard', ec50: 1e-4, hillSlope: 1.2, maxResponse: 95 }
          ];
      }
    };

    const comparisonCompounds = getComparisonCompounds(compound);
    
    // Generate data for all compounds
    const data = [
      // Selected compound
      ...generateDoseResponseData(compound.name, compound.ec50, 1.0, 100),
      // Comparison compounds
      ...comparisonCompounds.flatMap(comp => 
        generateDoseResponseData(comp.name, comp.ec50, comp.hillSlope, comp.maxResponse)
      )
    ];

    // Create Vega-Lite specification
    const spec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "background": "#f9faf8", // axiom-bg-graph-white
      "data": {"values": data},
      "mark": {
        "type": "line",
        "strokeWidth": 2,
        "point": {
          "size": 30,
          "filled": true
        },
        "tooltip": true
      },
      "encoding": {
        "x": {
          "field": "logDose",
          "type": "quantitative",
          "title": "Log Concentration (M)",
          "axis": {
            "titleColor": "#3D3D3D",
            "labelColor": "#5A5A5A",
            "titleFontSize": 11,
            "labelFontSize": 9,
            "grid": true,
            "gridColor": "#d9d8d4",
            "tickColor": "#d9d8d4"
          },
          "scale": {
            "domain": [-10, -2]
          }
        },
        "y": {
          "field": "response",
          "type": "quantitative",
          "title": "Response (%)",
          "axis": {
            "titleColor": "#3D3D3D",
            "labelColor": "#5A5A5A",
            "titleFontSize": 11,
            "labelFontSize": 9,
            "grid": true,
            "gridColor": "#d9d8d4",
            "tickColor": "#d9d8d4"
          },
          "scale": {
            "domain": [0, 105]
          }
        },
        "color": {
          "field": "compound",
          "type": "nominal",
          "scale": {
            "range": ["#4f7ea9", "#46695c", "#d9d8d4", "#FF9800"] // AxiomGFX colors
          },
          "legend": {
            "title": "Compounds",
            "titleColor": "#0A0A0A",
            "labelColor": "#3D3D3D",
            "titleFontSize": 11,
            "labelFontSize": 9,
            "orient": "bottom",
            "columns": 2,
            "symbolSize": 60
          }
        },
        "strokeWidth": {
          "field": "isSelected",
          "type": "nominal",
          "scale": {"range": [2, 3]},
          "legend": null
        },
        "opacity": {
          "field": "isSelected",
          "type": "nominal",
          "scale": {"range": [0.7, 1.0]},
          "legend": null
        },
        "tooltip": [
          {"field": "compound", "type": "nominal", "title": "Compound"},
          {"field": "logDose", "type": "quantitative", "title": "Log Dose", "format": ".1f"},
          {"field": "response", "type": "quantitative", "title": "Response (%)", "format": ".1f"}
        ]
      },
      "width": 240,
      "height": 120,
      "config": {
        "axis": {
          "labelFont": "system-ui",
          "titleFont": "system-ui"
        },
        "legend": {
          "labelFont": "system-ui",
          "titleFont": "system-ui"
        }
      }
    };

    // Embed the visualization
    vegaEmbed(vegaRef.current, spec, {
      actions: false,
      renderer: 'svg',
      hover: true
    }).catch(console.error);

  }, [compound]);

  // Calculate EC50 comparison metrics
  const getComparisonMetrics = (compound: Compound) => {
    const safetyStandardEC50 = 1e-4; // 100 μM
    const foldDifference = safetyStandardEC50 / compound.ec50;
    
    let safetyMargin: string;
    let safetyColor: string;
    
    if (foldDifference > 100) {
      safetyMargin = 'Excellent';
      safetyColor = 'text-green-600';
    } else if (foldDifference > 10) {
      safetyMargin = 'Good';
      safetyColor = 'text-blue-600';
    } else if (foldDifference > 3) {
      safetyMargin = 'Moderate';
      safetyColor = 'text-orange-600';
    } else {
      safetyMargin = 'Concerning';
      safetyColor = 'text-red-600';
    }

    return {
      foldDifference: foldDifference.toFixed(1),
      safetyMargin,
      safetyColor,
      ec50Display: compound.ec50.toExponential(1)
    };
  };

  const metrics = getComparisonMetrics(compound);

  return (
    <div className="space-y-3">
      {/* Vega Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-sm font-medium text-axiom-text-primary">
            Dose-Response Comparison
          </h5>
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
            Vega
          </span>
        </div>
        <div 
          ref={vegaRef} 
          className="border border-axiom-border-light rounded bg-axiom-bg-graph-white p-2"
        />
      </div>

      {/* Comparison Metrics */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-3">
        <h5 className="text-sm font-medium text-axiom-text-primary mb-2">
          Safety Comparison
        </h5>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-axiom-text-secondary">EC50 Value</div>
            <div className="font-medium text-axiom-text-primary">
              {metrics.ec50Display} M
            </div>
          </div>
          <div>
            <div className="text-axiom-text-secondary">vs Safety Standard</div>
            <div className="font-medium text-axiom-text-primary">
              {metrics.foldDifference}x more potent
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-axiom-text-secondary">Safety Margin</div>
            <div className={`font-medium ${metrics.safetyColor}`}>
              {metrics.safetyMargin}
            </div>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-axiom-bg-card-white rounded-lg border border-axiom-border-light p-3">
        <h5 className="text-sm font-medium text-axiom-text-primary mb-2">
          Curve Interpretation
        </h5>
        <div className="text-xs text-axiom-text-secondary space-y-1">
          <div>
            📊 <strong>Interactive:</strong> Hover over data points for detailed values
          </div>
          <div>
            🎯 <strong>EC50:</strong> Concentration causing 50% maximal response
          </div>
          <div>
            ⚡ <strong>Steepness:</strong> Hill slope indicates cooperativity
          </div>
          {compound.riskScore > 6.6 && (
            <div className="text-red-600">
              ⚠️ <strong>High Risk:</strong> Curve shows concerning potency profile
            </div>
          )}
          {compound.riskScore < 3.3 && (
            <div className="text-green-600">
              ✅ <strong>Low Risk:</strong> Favorable safety margin observed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
