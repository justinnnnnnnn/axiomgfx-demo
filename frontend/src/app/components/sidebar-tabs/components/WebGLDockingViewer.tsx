"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Compound } from '../../../lib/types';

interface WebGLDockingViewerProps {
  compound: Compound;
}

export default function WebGLDockingViewer({ compound }: WebGLDockingViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [simulationTime, setSimulationTime] = useState(0);

  // Shader source code
  const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_matrix;
    uniform float u_time;
    varying vec4 v_color;
    
    void main() {
      // Add some animation based on time
      vec4 pos = a_position;
      pos.x += sin(u_time * 2.0 + pos.y * 3.0) * 0.1;
      pos.y += cos(u_time * 1.5 + pos.x * 2.0) * 0.05;
      
      gl_Position = u_matrix * pos;
      gl_PointSize = 3.0;
      v_color = a_color;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;
    
    void main() {
      gl_FragColor = v_color;
    }
  `;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;

    // Create shader program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // Get attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');

    // Create protein and ligand geometry
    const proteinData = createProteinGeometry(compound);
    const ligandData = createLigandGeometry(compound);

    // Create buffers
    const proteinPositionBuffer = gl.createBuffer();
    const proteinColorBuffer = gl.createBuffer();
    const ligandPositionBuffer = gl.createBuffer();
    const ligandColorBuffer = gl.createBuffer();

    // Upload protein data
    gl.bindBuffer(gl.ARRAY_BUFFER, proteinPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(proteinData.positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, proteinColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(proteinData.colors), gl.STATIC_DRAW);

    // Upload ligand data
    gl.bindBuffer(gl.ARRAY_BUFFER, ligandPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ligandData.positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, ligandColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ligandData.colors), gl.STATIC_DRAW);

    // Set up viewport and clear color
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.98, 0.98, 0.97, 1.0); // axiom-bg-graph-white

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);

    let startTime = Date.now();

    const render = () => {
      if (!isRunning) return;

      const currentTime = (Date.now() - startTime) / 1000;
      setSimulationTime(currentTime);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);

      // Create transformation matrix
      const matrix = createPerspectiveMatrix(canvas.width / canvas.height);
      gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
      gl.uniform1f(timeUniformLocation, currentTime);

      // Draw protein (as points)
      gl.bindBuffer(gl.ARRAY_BUFFER, proteinPositionBuffer);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, proteinColorBuffer);
      gl.enableVertexAttribArray(colorAttributeLocation);
      gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, proteinData.positions.length / 3);

      // Draw ligand (as points with different size)
      gl.bindBuffer(gl.ARRAY_BUFFER, ligandPositionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, ligandColorBuffer);
      gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, ligandData.positions.length / 3);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [compound, isRunning]);

  // Calculate binding metrics based on compound
  const getBindingMetrics = (compound: Compound) => {
    const compoundMetrics: Record<string, any> = {
      'Metformin': {
        bindingAffinity: 8.2,
        dockingScore: 94,
        interactionEnergy: -12.4,
        contacts: 8
      },
      'Nefazodone': {
        bindingAffinity: 6.7,
        dockingScore: 78,
        interactionEnergy: -9.8,
        contacts: 12
      },
      'Troglitazone': {
        bindingAffinity: 5.1,
        dockingScore: 62,
        interactionEnergy: -7.2,
        contacts: 15
      },
      'Aspirin': {
        bindingAffinity: 7.8,
        dockingScore: 85,
        interactionEnergy: -11.1,
        contacts: 6
      },
      default: {
        bindingAffinity: 7.3,
        dockingScore: 82,
        interactionEnergy: -10.5,
        contacts: 9
      }
    };

    return compoundMetrics[compound.name] || compoundMetrics.default;
  };

  const metrics = getBindingMetrics(compound);

  return (
    <div className="space-y-3">
      {/* WebGL Canvas */}
      <div className="bg-axiom-bg-graph-white rounded-lg p-2 border border-axiom-border-light">
        <canvas
          ref={canvasRef}
          width={260}
          height={140}
          className="w-full h-auto rounded"
        />
        
        {/* Simulation Controls */}
        <div className="flex items-center justify-between mt-2 px-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="text-xs px-2 py-1 rounded font-medium transition-colors"
              style={{ 
                backgroundColor: isRunning ? '#ffe562' : '#f5f5f5',
                color: '#0A0A0A'
              }}
            >
              {isRunning ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <span className="text-xs text-axiom-text-secondary">
              Time: {simulationTime.toFixed(1)}s
            </span>
          </div>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
            WebGL
          </span>
        </div>
      </div>
      
      {/* Binding Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-axiom-bg-card-white rounded border border-axiom-border-light">
          <div className="font-bold text-axiom-graph-blue text-lg">
            {metrics.bindingAffinity.toFixed(1)}
          </div>
          <div className="text-xs text-axiom-text-secondary">Binding Affinity</div>
          <div className="text-xs text-axiom-text-light">(pKd)</div>
        </div>
        <div className="text-center p-2 bg-axiom-bg-card-white rounded border border-axiom-border-light">
          <div className="font-bold text-axiom-graph-blue text-lg">
            {metrics.dockingScore}%
          </div>
          <div className="text-xs text-axiom-text-secondary">Docking Score</div>
          <div className="text-xs text-axiom-text-light">(Confidence)</div>
        </div>
        <div className="text-center p-2 bg-axiom-bg-card-white rounded border border-axiom-border-light">
          <div className="font-bold text-axiom-graph-green text-lg">
            {metrics.interactionEnergy.toFixed(1)}
          </div>
          <div className="text-xs text-axiom-text-secondary">Interaction Energy</div>
          <div className="text-xs text-axiom-text-light">(kcal/mol)</div>
        </div>
        <div className="text-center p-2 bg-axiom-bg-card-white rounded border border-axiom-border-light">
          <div className="font-bold text-axiom-graph-green text-lg">
            {metrics.contacts}
          </div>
          <div className="text-xs text-axiom-text-secondary">Key Contacts</div>
          <div className="text-xs text-axiom-text-light">(Residues)</div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for WebGL
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
}

function createProteinGeometry(compound: Compound) {
  const positions: number[] = [];
  const colors: number[] = [];
  
  // Create a simplified protein binding site
  for (let i = 0; i < 50; i++) {
    // Random positions in a roughly spherical distribution
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const radius = 0.8 + Math.random() * 0.4;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    positions.push(x, y, z);
    
    // Protein color (grayish blue)
    colors.push(0.6, 0.7, 0.8, 0.8);
  }
  
  return { positions, colors };
}

function createLigandGeometry(compound: Compound) {
  const positions: number[] = [];
  const colors: number[] = [];
  
  // Create ligand atoms based on compound risk
  const atomCount = compound.riskScore > 6.6 ? 15 : compound.riskScore > 3.3 ? 12 : 8;
  
  for (let i = 0; i < atomCount; i++) {
    // Position ligand atoms in the binding site center
    const x = (Math.random() - 0.5) * 0.6;
    const y = (Math.random() - 0.5) * 0.6;
    const z = (Math.random() - 0.5) * 0.6;
    
    positions.push(x, y, z);
    
    // Color based on risk level
    if (compound.riskScore > 6.6) {
      colors.push(1.0, 0.3, 0.3, 1.0); // Red for high risk
    } else if (compound.riskScore > 3.3) {
      colors.push(1.0, 0.6, 0.0, 1.0); // Orange for medium risk
    } else {
      colors.push(0.3, 0.8, 0.3, 1.0); // Green for low risk
    }
  }
  
  return { positions, colors };
}

function createPerspectiveMatrix(aspect: number): Float32Array {
  const fov = Math.PI / 4; // 45 degrees
  const near = 0.1;
  const far = 100.0;
  
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
  const rangeInv = 1.0 / (near - far);
  
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ]);
}
