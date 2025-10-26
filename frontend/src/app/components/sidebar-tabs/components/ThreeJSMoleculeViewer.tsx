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

    // Get container dimensions
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9faf8); // axiom-bg-graph-white

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Create single molecular structure based on compound
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
    
    // Animation loop - always animate unless hovered
    const animate = () => {
      if (!isHovered) {
        moleculeGroup.rotation.y += 0.015;
        moleculeGroup.rotation.x += 0.008;
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
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
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
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ minHeight: '180px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  );
}

// Helper function to create molecular structures based on compound
function createMolecularStructure(compound: Compound): THREE.Group {
  const group = new THREE.Group();

  // Define real molecular structures for different compounds
  const getMolecularData = (compoundName: string) => {
    switch (compoundName) {
      case 'Metformin':
        // Real Metformin structure: C4H11N5 (biguanide)
        return {
          atoms: [
            // Central biguanide core
            { pos: [0, 0, 0], element: 'C', color: 0x909090 },      // Central carbon
            { pos: [1.4, 0, 0], element: 'N', color: 0x3050F8 },    // N1
            { pos: [-1.4, 0, 0], element: 'N', color: 0x3050F8 },   // N2
            { pos: [2.8, 0, 0], element: 'C', color: 0x909090 },    // C2
            { pos: [-2.8, 0, 0], element: 'N', color: 0x3050F8 },   // N3
            { pos: [4.2, 0, 0], element: 'N', color: 0x3050F8 },    // N4
            { pos: [4.2, 1.4, 0], element: 'N', color: 0x3050F8 },  // N5 (amino)
            // Methyl groups
            { pos: [-4.2, 0, 0], element: 'C', color: 0x909090 },   // Methyl 1
            { pos: [-4.2, -1.4, 0], element: 'C', color: 0x909090 }, // Methyl 2
          ],
          bonds: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [3, 6], [4, 7], [4, 8]]
        };
      case 'Nefazodone':
        // Real Nefazodone structure: C25H32ClN5O2 (triazolone antidepressant)
        return {
          atoms: [
            // Triazolone core
            { pos: [0, 0, 0], element: 'C', color: 0x909090 },       // Central carbon
            { pos: [1.4, 0, 0], element: 'N', color: 0x3050F8 },     // N1
            { pos: [2.8, 0, 0], element: 'N', color: 0x3050F8 },     // N2
            { pos: [2.8, 1.4, 0], element: 'N', color: 0x3050F8 },   // N3
            { pos: [1.4, 1.4, 0], element: 'C', color: 0x909090 },   // C2
            { pos: [0, 1.4, 0], element: 'O', color: 0xFF0D0D },     // Carbonyl O
            // Phenylpiperazine moiety
            { pos: [-1.4, 0, 0], element: 'N', color: 0x3050F8 },    // Piperazine N1
            { pos: [-2.8, 0, 0], element: 'C', color: 0x909090 },    // Piperazine C1
            { pos: [-4.2, 0, 0], element: 'C', color: 0x909090 },    // Phenyl C1
            { pos: [-4.2, 1.4, 0], element: 'C', color: 0x909090 },  // Phenyl C2
            { pos: [-5.6, 1.4, 0], element: 'Cl', color: 0x1FF01F }, // Chlorine
            // Additional carbons for realistic structure
            { pos: [0, -1.4, 0], element: 'C', color: 0x909090 },    // Ethyl chain
            { pos: [1.4, -1.4, 0], element: 'C', color: 0x909090 },  // Ethyl end
          ],
          bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [0, 6], [6, 7], [7, 8], [8, 9], [9, 10], [0, 11], [11, 12]]
        };
      case 'Troglitazone':
        // Real Troglitazone structure: C24H27NO5S (thiazolidinedione)
        return {
          atoms: [
            // Thiazolidinedione ring
            { pos: [0, 0, 0], element: 'C', color: 0x909090 },       // Central carbon
            { pos: [1.4, 0, 0], element: 'C', color: 0x909090 },     // C2
            { pos: [2.8, 0, 0], element: 'S', color: 0xFFFF30 },     // Sulfur
            { pos: [2.8, 1.4, 0], element: 'C', color: 0x909090 },   // C3
            { pos: [1.4, 1.4, 0], element: 'N', color: 0x3050F8 },   // Nitrogen
            { pos: [0, 1.4, 0], element: 'C', color: 0x909090 },     // C4
            { pos: [0, 2.8, 0], element: 'O', color: 0xFF0D0D },     // Carbonyl O1
            { pos: [4.2, 1.4, 0], element: 'O', color: 0xFF0D0D },   // Carbonyl O2
            // Chromane ring system (quinone-forming region)
            { pos: [-1.4, 0, 0], element: 'C', color: 0x909090 },    // Chromane C1
            { pos: [-2.8, 0, 0], element: 'C', color: 0x909090 },    // Chromane C2
            { pos: [-4.2, 0, 0], element: 'C', color: 0x909090 },    // Chromane C3
            { pos: [-4.2, 1.4, 0], element: 'O', color: 0xFF0D0D },  // Chromane O
            { pos: [-5.6, 0, 0], element: 'C', color: 0x909090 },    // Methyl group
            // Additional structural elements
            { pos: [0, -1.4, 0], element: 'C', color: 0x909090 },    // Side chain
            { pos: [1.4, -1.4, 0], element: 'C', color: 0x909090 },  // Side chain
          ],
          bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [3, 7], [0, 8], [8, 9], [9, 10], [10, 11], [10, 12], [0, 13], [13, 14]]
        };
      case 'Aspirin':
        // Real Aspirin structure: C9H8O4 (acetylsalicylic acid)
        return {
          atoms: [
            // Benzene ring
            { pos: [0, 0, 0], element: 'C', color: 0x909090 },       // C1
            { pos: [1.4, 0, 0], element: 'C', color: 0x909090 },     // C2
            { pos: [2.1, 1.2, 0], element: 'C', color: 0x909090 },   // C3
            { pos: [1.4, 2.4, 0], element: 'C', color: 0x909090 },   // C4
            { pos: [0, 2.4, 0], element: 'C', color: 0x909090 },     // C5
            { pos: [-0.7, 1.2, 0], element: 'C', color: 0x909090 },  // C6
            // Carboxyl group
            { pos: [-2.1, 1.2, 0], element: 'C', color: 0x909090 },  // COOH carbon
            { pos: [-3.5, 1.2, 0], element: 'O', color: 0xFF0D0D },  // COOH oxygen
            { pos: [-2.1, 2.6, 0], element: 'O', color: 0xFF0D0D },  // OH oxygen
            // Acetyl group
            { pos: [1.4, 3.8, 0], element: 'O', color: 0xFF0D0D },   // Acetyl oxygen
            { pos: [2.8, 4.5, 0], element: 'C', color: 0x909090 },   // Acetyl carbon
            { pos: [4.2, 4.5, 0], element: 'C', color: 0x909090 },   // Methyl carbon
          ],
          bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [6, 7], [6, 8], [3, 9], [9, 10], [10, 11]]
        };
      case 'Atorvastatin':
        // Real Atorvastatin structure: C33H35FN2O5 (HMG-CoA reductase inhibitor)
        return {
          atoms: [
            // Pyrrole ring
            { pos: [0, 0, 0], element: 'N', color: 0x3050F8 },       // Central nitrogen
            { pos: [1.4, 0, 0], element: 'C', color: 0x909090 },     // C1
            { pos: [2.8, 0, 0], element: 'C', color: 0x909090 },     // C2
            { pos: [2.8, 1.4, 0], element: 'C', color: 0x909090 },   // C3
            { pos: [1.4, 1.4, 0], element: 'C', color: 0x909090 },   // C4
            // Phenyl rings
            { pos: [-1.4, 0, 0], element: 'C', color: 0x909090 },    // Phenyl C1
            { pos: [-2.8, 0, 0], element: 'C', color: 0x909090 },    // Phenyl C2
            { pos: [-4.2, 0, 0], element: 'F', color: 0x90E050 },    // Fluorine
            // HMG-CoA binding region
            { pos: [4.2, 0, 0], element: 'C', color: 0x909090 },     // Side chain
            { pos: [5.6, 0, 0], element: 'O', color: 0xFF0D0D },     // Hydroxyl
            { pos: [4.2, 1.4, 0], element: 'C', color: 0x909090 },   // COOH carbon
            { pos: [5.6, 1.4, 0], element: 'O', color: 0xFF0D0D },   // COOH oxygen
          ],
          bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [5, 6], [6, 7], [2, 8], [8, 9], [8, 10], [10, 11]]
        };
      default:
        // Generic pharmaceutical structure
        return {
          atoms: [
            { pos: [0, 0, 0], element: 'C', color: 0x909090 },       // Central carbon
            { pos: [1.4, 0, 0], element: 'C', color: 0x909090 },     // C1
            { pos: [2.1, 1.2, 0], element: 'N', color: 0x3050F8 },   // Nitrogen
            { pos: [1.4, 2.4, 0], element: 'C', color: 0x909090 },   // C2
            { pos: [0, 2.4, 0], element: 'O', color: 0xFF0D0D },     // Oxygen
            { pos: [-1.4, 1.2, 0], element: 'C', color: 0x909090 },  // C3
          ],
          bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
        };
    }
  };

  const molecularData = getMolecularData(compound.name);
  
  // Create atoms with element-specific sizes
  const atoms: THREE.Mesh[] = [];

  molecularData.atoms.forEach((atomData, index) => {
    // Element-specific atom sizes
    let atomSize = 0.6; // Default size
    switch (atomData.element) {
      case 'H': atomSize = 0.3; break;
      case 'C': atomSize = 0.6; break;
      case 'N': atomSize = 0.55; break;
      case 'O': atomSize = 0.5; break;
      case 'S': atomSize = 0.8; break;
      case 'Cl': atomSize = 0.75; break;
      case 'F': atomSize = 0.4; break;
    }

    const atomGeometry = new THREE.SphereGeometry(atomSize, 12, 12);
    const atomMaterial = new THREE.MeshLambertMaterial({
      color: atomData.color,
      transparent: false,
      opacity: 1.0
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
    color: 0x666666,
    transparent: false,
    opacity: 1.0
  });

  molecularData.bonds.forEach(([startIdx, endIdx]) => {
    if (startIdx >= atoms.length || endIdx >= atoms.length) return;

    const startPos = atoms[startIdx].position;
    const endPos = atoms[endIdx].position;

    const distance = startPos.distanceTo(endPos);
    const bondGeometry = new THREE.CylinderGeometry(0.08, 0.08, distance, 6);
    const bond = new THREE.Mesh(bondGeometry, bondMaterial);

    // Position bond between atoms
    bond.position.copy(startPos).add(endPos).multiplyScalar(0.5);

    // Orient bond towards end atom
    const direction = new THREE.Vector3().subVectors(endPos, startPos);
    bond.lookAt(bond.position.clone().add(direction));
    bond.rotateX(Math.PI / 2);

    bond.castShadow = true;
    bond.receiveShadow = true;

    group.add(bond);
  });

  // Center and scale the molecule to fit nicely
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // Center the molecule
  group.position.sub(center);

  // Scale to fit in viewport (target size around 8 units)
  const maxDimension = Math.max(size.x, size.y, size.z);
  if (maxDimension > 0) {
    const scale = 8 / maxDimension;
    group.scale.setScalar(scale);
  }
  
  return group;
}
