"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compound } from '../../../lib/types';

interface ThreeJSMoleculeViewerProps {
  compound: Compound;
  className?: string;
}

export default function ThreeJSMoleculeViewer({ compound, className = '' }: ThreeJSMoleculeViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const moleculeGroupRef = useRef<THREE.Group>();
  const animationIdRef = useRef<number>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9faf8); // axiom-bg-graph-white
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 280 / 180, 0.1, 1000);
    camera.position.set(0, 0, 25);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(280, 180);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    
    // Create molecular structure based on compound
    const moleculeGroup = createMolecularStructure(compound);
    moleculeGroup.position.set(0, 0, 0); // Center at origin
    scene.add(moleculeGroup);
    
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(ambientLight);
    scene.add(directionalLight);
    
    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    moleculeGroupRef.current = moleculeGroup;
    
    // Animation loop
    const animate = () => {
      if (!isHovered && moleculeGroup) {
        moleculeGroup.rotation.y += 0.01;
        moleculeGroup.rotation.x += 0.005;
      }
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();
    
    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !moleculeGroup) return;
      
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      moleculeGroup.rotation.y += deltaMove.x * 0.01;
      moleculeGroup.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      renderer.dispose();
    };
  }, [compound, isHovered]);

  return (
    <div className={`bg-axiom-bg-graph-white rounded-lg overflow-hidden ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-44 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  );
}

// Helper function to create molecular structures based on compound
function createMolecularStructure(compound: Compound): THREE.Group {
  const group = new THREE.Group();
  
  // Define molecular structures for different compounds
  const getMolecularData = (compoundName: string) => {
    switch (compoundName) {
      case 'Metformin':
        return {
          atoms: [
            { pos: [0, 0, 0], element: 'C', color: 0x4CAF50 },
            { pos: [1.5, 0, 0], element: 'N', color: 0x2196F3 },
            { pos: [-1.5, 0, 0], element: 'N', color: 0x2196F3 },
            { pos: [0, 1.5, 0], element: 'N', color: 0x2196F3 },
            { pos: [0, -1.5, 0], element: 'N', color: 0x2196F3 },
            { pos: [3, 0, 0], element: 'C', color: 0x4CAF50 },
            { pos: [-3, 0, 0], element: 'C', color: 0x4CAF50 },
          ],
          bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6]]
        };
      case 'Nefazodone':
        return {
          atoms: [
            { pos: [0, 0, 0], element: 'C', color: 0xFF9800 },
            { pos: [1.5, 0.8, 0], element: 'C', color: 0xFF9800 },
            { pos: [1.5, -0.8, 0], element: 'C', color: 0xFF9800 },
            { pos: [-1.5, 0.8, 0], element: 'N', color: 0x2196F3 },
            { pos: [-1.5, -0.8, 0], element: 'O', color: 0xF44336 },
            { pos: [3, 0, 0], element: 'C', color: 0xFF9800 },
            { pos: [-3, 0, 0], element: 'C', color: 0xFF9800 },
            { pos: [0, 2.2, 0], element: 'Cl', color: 0x9E9E9E },
          ],
          bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 5], [3, 6], [2, 7]]
        };
      case 'Troglitazone':
        return {
          atoms: [
            { pos: [0, 0, 0], element: 'C', color: 0xF44336 },
            { pos: [2, 2, 0], element: 'C', color: 0xF44336 },
            { pos: [2, -2, 0], element: 'C', color: 0xF44336 },
            { pos: [-2, 2, 0], element: 'O', color: 0xFF5722 },
            { pos: [-2, -2, 0], element: 'S', color: 0xFFEB3B },
            { pos: [4, 0, 0], element: 'C', color: 0xF44336 },
            { pos: [-4, 0, 0], element: 'C', color: 0xF44336 },
            { pos: [0, 4, 0], element: 'N', color: 0x2196F3 },
            { pos: [0, -4, 0], element: 'O', color: 0xFF5722 },
          ],
          bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 5], [3, 6], [2, 8], [1, 7]]
        };
      default:
        return {
          atoms: [
            { pos: [0, 0, 0], element: 'C', color: 0x666666 },
            { pos: [2, 0, 0], element: 'C', color: 0x666666 },
            { pos: [-2, 0, 0], element: 'C', color: 0x666666 },
            { pos: [0, 2, 0], element: 'O', color: 0xFF5722 },
            { pos: [0, -2, 0], element: 'N', color: 0x2196F3 },
          ],
          bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
        };
    }
  };

  const molecularData = getMolecularData(compound.name);
  
  // Create atoms
  const atomGeometry = new THREE.SphereGeometry(0.8, 16, 16);
  const atoms: THREE.Mesh[] = [];
  
  molecularData.atoms.forEach((atomData, index) => {
    const atomMaterial = new THREE.MeshLambertMaterial({ 
      color: atomData.color,
      transparent: true,
      opacity: 0.9
    });
    
    const atom = new THREE.Mesh(atomGeometry, atomMaterial);
    atom.position.set(atomData.pos[0], atomData.pos[1], atomData.pos[2]);
    atom.castShadow = true;
    atom.receiveShadow = true;
    
    group.add(atom);
    atoms.push(atom);
  });
  
  // Create bonds
  const bondMaterial = new THREE.MeshLambertMaterial({ 
    color: 0xcccccc,
    transparent: true,
    opacity: 0.8
  });
  
  molecularData.bonds.forEach(([startIdx, endIdx]) => {
    const startPos = atoms[startIdx].position;
    const endPos = atoms[endIdx].position;
    
    const distance = startPos.distanceTo(endPos);
    const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, distance, 8);
    const bond = new THREE.Mesh(bondGeometry, bondMaterial);
    
    // Position bond between atoms
    bond.position.copy(startPos).add(endPos).multiplyScalar(0.5);
    
    // Orient bond towards end atom
    bond.lookAt(endPos);
    bond.rotateX(Math.PI / 2);
    
    bond.castShadow = true;
    bond.receiveShadow = true;
    
    group.add(bond);
  });
  
  return group;
}
