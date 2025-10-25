"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Compound } from '../../../lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartJSPerformanceChartProps {
  compound: Compound;
}

export default function ChartJSPerformanceChart({ compound }: ChartJSPerformanceChartProps) {
  // Generate performance data based on compound characteristics
  const getPerformanceData = (compound: Compound) => {
    // Base accuracy depends on risk score - easier to predict extreme cases
    const baseAccuracy = compound.riskScore < 2 || compound.riskScore > 8 ? 0.95 : 
                        compound.riskScore < 3.3 || compound.riskScore > 6.6 ? 0.88 : 0.82;
    
    // Add some realistic variation
    const variation = () => (Math.random() - 0.5) * 0.08;
    
    return {
      hepatotoxicity: Math.max(0.75, Math.min(0.98, baseAccuracy + variation())),
      nephrotoxicity: Math.max(0.70, Math.min(0.96, baseAccuracy - 0.03 + variation())),
      cardiotoxicity: Math.max(0.72, Math.min(0.94, baseAccuracy - 0.05 + variation())),
      neurotoxicity: Math.max(0.68, Math.min(0.92, baseAccuracy - 0.07 + variation())),
      genotoxicity: Math.max(0.74, Math.min(0.95, baseAccuracy - 0.02 + variation())),
    };
  };

  const performance = getPerformanceData(compound);

  // Model accuracy by endpoint
  const barData = {
    labels: ['Hepatotoxicity', 'Nephrotoxicity', 'Cardiotoxicity', 'Neurotoxicity', 'Genotoxicity'],
    datasets: [
      {
        label: 'Model Accuracy (%)',
        data: [
          performance.hepatotoxicity * 100,
          performance.nephrotoxicity * 100,
          performance.cardiotoxicity * 100,
          performance.neurotoxicity * 100,
          performance.genotoxicity * 100,
        ],
        backgroundColor: '#4f7ea9', // axiom-graph-blue
        borderColor: '#4f7ea9',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Accuracy: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
          color: '#5A5A5A',
          font: {
            size: 10
          }
        },
        grid: {
          color: '#d9d8d4'
        }
      },
      x: {
        ticks: {
          color: '#5A5A5A',
          font: {
            size: 9
          },
          maxRotation: 45
        },
        grid: {
          display: false
        }
      }
    },
  };

  // Confidence distribution
  const getConfidenceDistribution = (compound: Compound) => {
    if (compound.riskScore < 2 || compound.riskScore > 8) {
      return [80, 15, 5]; // High confidence for extreme cases
    } else if (compound.riskScore < 3.3 || compound.riskScore > 6.6) {
      return [65, 25, 10]; // Medium confidence
    } else {
      return [45, 35, 20]; // Lower confidence for borderline cases
    }
  };

  const confidenceData = {
    labels: ['High Confidence', 'Medium Confidence', 'Low Confidence'],
    datasets: [
      {
        data: getConfidenceDistribution(compound),
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 12,
          font: {
            size: 10
          },
          color: '#3D3D3D'
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    },
  };

  // Training progress over time (simulated)
  const getTrainingProgress = () => {
    const epochs = Array.from({length: 10}, (_, i) => `Epoch ${i + 1}`);
    const accuracy = [0.72, 0.78, 0.82, 0.85, 0.87, 0.89, 0.90, 0.91, 0.91, 0.92];
    const loss = [0.45, 0.38, 0.32, 0.28, 0.25, 0.23, 0.21, 0.20, 0.19, 0.18];
    
    return { epochs, accuracy, loss };
  };

  const trainingData = getTrainingProgress();

  const lineData = {
    labels: trainingData.epochs,
    datasets: [
      {
        label: 'Accuracy',
        data: trainingData.accuracy.map(acc => acc * 100),
        borderColor: '#4f7ea9',
        backgroundColor: 'rgba(79, 126, 169, 0.1)',
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Loss',
        data: trainingData.loss.map(loss => loss * 100),
        borderColor: '#46695c',
        backgroundColor: 'rgba(70, 105, 92, 0.1)',
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 10
          },
          color: '#3D3D3D'
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#5A5A5A',
          font: {
            size: 9
          }
        },
        grid: {
          color: '#d9d8d4'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          color: '#5A5A5A',
          font: {
            size: 10
          },
          callback: function(value: any) {
            return value + '%';
          }
        },
        grid: {
          color: '#d9d8d4'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: {
          color: '#5A5A5A',
          font: {
            size: 10
          },
          callback: function(value: any) {
            return (value / 100).toFixed(2);
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Model Accuracy by Endpoint */}
      <div>
        <h5 className="text-sm font-medium text-axiom-text-primary mb-2">
          Prediction Accuracy by Toxicity Endpoint
        </h5>
        <div className="h-32 bg-axiom-bg-graph-white rounded p-2">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Confidence Distribution and Training Progress */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h5 className="text-sm font-medium text-axiom-text-primary mb-2">
            Prediction Confidence
          </h5>
          <div className="h-28 bg-axiom-bg-graph-white rounded p-2">
            <Doughnut data={confidenceData} options={doughnutOptions} />
          </div>
        </div>
        
        <div>
          <h5 className="text-sm font-medium text-axiom-text-primary mb-2">
            Training Progress
          </h5>
          <div className="h-28 bg-axiom-bg-graph-white rounded p-2">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
