"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Compound } from '../../../lib/types';

interface D3ConfidenceHeatmapProps {
  compound: Compound;
}

interface HeatmapData {
  endpoint: string;
  assay: string;
  confidence: number;
  samples: number;
}

export default function D3ConfidenceHeatmap({ compound }: D3ConfidenceHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<HeatmapData | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 280;
    const height = 140;
    const margin = { top: 25, right: 20, bottom: 35, left: 80 };

    // Generate heatmap data based on compound characteristics
    const endpoints = ['Hepatotoxicity', 'Nephrotoxicity', 'Cardiotoxicity', 'Neurotoxicity'];
    const assays = ['Viability', 'Apoptosis', 'Necrosis'];
    
    const generateConfidenceData = (compound: Compound): HeatmapData[] => {
      const data: HeatmapData[] = [];
      
      // Base confidence varies by compound risk profile
      const getBaseConfidence = (endpoint: string) => {
        const riskScore = compound.riskScore;
        
        // Higher confidence for extreme risk scores (easier to predict)
        let baseConf = riskScore < 2 || riskScore > 8 ? 0.92 : 
                      riskScore < 3.3 || riskScore > 6.6 ? 0.85 : 0.78;
        
        // Hepatotoxicity typically has highest confidence
        if (endpoint === 'Hepatotoxicity') baseConf += 0.05;
        if (endpoint === 'Neurotoxicity') baseConf -= 0.03; // Hardest to predict
        
        return baseConf;
      };
      
      endpoints.forEach(endpoint => {
        assays.forEach(assay => {
          const baseConfidence = getBaseConfidence(endpoint);
          
          // Add assay-specific variation
          let assayModifier = 0;
          if (assay === 'Viability') assayModifier = 0.02; // Most reliable
          if (assay === 'Necrosis') assayModifier = -0.02; // Less reliable
          
          // Add some realistic noise
          const noise = (Math.random() - 0.5) * 0.1;
          
          const confidence = Math.max(0.5, Math.min(0.98, 
            baseConfidence + assayModifier + noise
          ));
          
          // Sample count varies by compound popularity and assay complexity
          const baseSamples = compound.name === 'Metformin' ? 5000 : 
                             compound.name === 'Aspirin' ? 4500 :
                             compound.name === 'Troglitazone' ? 1200 : 2800;
          
          const assaySamples = assay === 'Viability' ? baseSamples : 
                              assay === 'Apoptosis' ? baseSamples * 0.7 :
                              baseSamples * 0.5;
          
          data.push({
            endpoint,
            assay,
            confidence,
            samples: Math.floor(assaySamples + (Math.random() - 0.5) * 500)
          });
        });
      });
      
      return data;
    };

    const data = generateConfidenceData(compound);

    // Scales
    const xScale = d3.scaleBand()
      .domain(endpoints)
      .range([margin.left, width - margin.right])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(assays)
      .range([margin.top, height - margin.bottom])
      .padding(0.05);

    // Color scale using AxiomGFX colors
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateRgb("#f5f3f2", "#4f7ea9")) // axiom colors
      .domain([0.5, 1.0]);

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Create heatmap rectangles
    const rects = svg.selectAll('.heatmap-rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-rect')
      .attr('x', d => xScale(d.endpoint)!)
      .attr('y', d => yScale(d.assay)!)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.confidence))
      .attr('stroke', '#d9d8d4') // axiom-border-light
      .attr('stroke-width', 1)
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Highlight cell
        d3.select(this)
          .attr('stroke', '#4f7ea9')
          .attr('stroke-width', 2);
        
        setHoveredCell(d);
        
        // Position tooltip
        const rect = (event.target as Element).getBoundingClientRect();
        const container = svgRef.current!.getBoundingClientRect();
        
        tooltip
          .style('opacity', 1)
          .style('left', (rect.left - container.left + rect.width / 2) + 'px')
          .style('top', (rect.top - container.top - 10) + 'px');
      })
      .on('mouseout', function() {
        // Remove highlight
        d3.select(this)
          .attr('stroke', '#d9d8d4')
          .attr('stroke-width', 1);
        
        setHoveredCell(null);
        tooltip.style('opacity', 0);
      });

    // Add confidence percentage text
    svg.selectAll('.confidence-text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'confidence-text')
      .attr('x', d => xScale(d.endpoint)! + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.assay)! + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', d => d.confidence > 0.75 ? '#ffffff' : '#0A0A0A')
      .attr('pointer-events', 'none')
      .text(d => (d.confidence * 100).toFixed(0) + '%');

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', '#3D3D3D')
      .style('text-anchor', 'middle')
      .each(function() {
        const text = d3.select(this);
        const words = text.text().split(/(?=[A-Z])/); // Split on capital letters
        text.text('');
        
        words.forEach((word, i) => {
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? '0.71em' : '1em')
            .text(word);
        });
      });

    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickSize(0))
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', '#3D3D3D');

    // Remove axis lines
    svg.selectAll('.domain').remove();

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#0A0A0A')
      .text(`Model Confidence: ${compound.name}`);

  }, [compound]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={280}
        height={140}
        className="border border-axiom-border-light rounded bg-axiom-bg-graph-white"
      />
      
      {/* Custom tooltip */}
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none opacity-0 transition-opacity duration-200 z-50"
        style={{
          transform: 'translateX(-50%) translateY(-100%)',
        }}
      >
        {hoveredCell && (
          <div className="bg-white border border-axiom-border-light rounded-lg shadow-xl p-3 text-xs backdrop-blur-sm"
               style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
            <div className="font-semibold text-axiom-text-primary mb-2">
              {hoveredCell.endpoint} - {hoveredCell.assay}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-axiom-text-secondary">Confidence:</span>
                <span className="font-medium text-axiom-text-primary">
                  {(hoveredCell.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-axiom-text-secondary">Samples:</span>
                <span className="font-medium text-axiom-text-primary">
                  {hoveredCell.samples.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-axiom-text-secondary">Quality:</span>
                <span className={`font-medium ${
                  hoveredCell.confidence > 0.9 ? 'text-green-600' :
                  hoveredCell.confidence > 0.8 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {hoveredCell.confidence > 0.9 ? 'Excellent' :
                   hoveredCell.confidence > 0.8 ? 'Good' : 'Fair'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="mt-2 flex items-center justify-center space-x-4 text-xs text-axiom-text-secondary">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f5f3f2' }}></div>
          <span>50%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#a8b8c8' }}></div>
          <span>75%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#4f7ea9' }}></div>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
