'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Compound } from '../../../lib/types';

interface Real3DMoleculeViewerProps {
  compound: Compound;
  className?: string;
  height?: number;
}

interface MoleculeData {
  source: string;
  name: string;
  cid?: number;
  smiles?: string;
  inchi?: string;
  sdf3d_url?: string;
  molecular_formula?: string;
  molecular_weight?: number;
}

export default function Real3DMoleculeViewer({
  compound,
  className = "",
  height = 200
}: Real3DMoleculeViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [moleculeData, setMoleculeData] = useState<MoleculeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const viewerInstanceRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const animationRef = useRef<number | null>(null);


  // Initialize component when compound changes
  useEffect(() => {
    let isMounted = true;

    const initializeComponent = async () => {
      try {
        console.log('[Real3D] mount/init for', compound.name, 'height=', height);
        setLoading(true);
        setError(null);
        setIsInitialized(false);

        // Load 3Dmol.js if not already loaded
        if (!window.$3Dmol) {
          const script = document.createElement('script');
          script.src = 'https://3dmol.csb.pitt.edu/build/3Dmol-min.js';
          script.async = true;

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          // Wait for library to initialize
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        if (isMounted) {
          await fetchMoleculeData();
        }
      } catch (err) {
        console.error('Error loading 3Dmol.js:', err);
        if (isMounted) {
          setError('Failed to load 3D viewer');
          setLoading(false);
        }
      }
    };

    initializeComponent();

    return () => {
      isMounted = false;
    };
  }, [compound.name]);

  // Cleanup on unmount
  useEffect(() => {

      if (resizeObserverRef.current) { resizeObserverRef.current.disconnect(); resizeObserverRef.current = null; }
      if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.innerHTML = '';
      }
      setMoleculeData(null);
      setLoading(false);
      setError(null);
      setIsInitialized(false);
    };
  }, []);

  const fetchMoleculeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/molecule/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: compound.name }),
      });

      if (!response.ok) {
        throw new Error(`Failed to resolve molecule: ${response.statusText}`);
      }

      const data: MoleculeData = await response.json();
      console.log('[Real3D] resolved', { name: data.name, source: data.source, url: data.sdf3d_url });
      setMoleculeData(data);

      // Initialize viewer after data is loaded (first attempt)
      if (viewerRef.current && window.$3Dmol && !isInitialized) {
        await initializeViewer(data);
      }
    } catch (err) {
      console.error('Error fetching molecule data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load molecule data');
    } finally {
      setLoading(false);
    }
  };

  const initializeViewer = async (data: MoleculeData) => {
    if (!viewerRef.current || !window.$3Dmol || isInitialized) return;

    try {
      console.log('Initializing viewer for:', data.name, 'url:', data.sdf3d_url);

      // Ensure the container has a non-zero size; if not, retry shortly
      const rect = viewerRef.current.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) {
        console.warn('3D viewer container has zero size; retrying initialization...');
        setTimeout(() => {
          if (viewerRef.current) initializeViewer(data);
        }, 300);
        return;
      }

      if (data.sdf3d_url) {
        // Try to load 3D structure
        const sdfResponse = await fetch(data.sdf3d_url);

        if (sdfResponse.ok) {
          const sdfData = await sdfResponse.text();

          try {
            if (sdfData && sdfData.trim().length > 0) {
              console.log('Creating 3Dmol viewer...');

              // Clear container and create viewer
              viewerRef.current.innerHTML = '';

              const viewer = window.$3Dmol.createViewer(viewerRef.current, {
                backgroundColor: 'white'
              });

              viewerInstanceRef.current = viewer;

              // Add model and style
              viewer.addModel(sdfData, 'sdf');
              viewer.setStyle({}, {
                stick: { radius: 0.15, colorscheme: 'default' },
                sphere: { scale: 0.25, colorscheme: 'default' }
              });

              // Center and render
              viewer.zoomTo();
              viewer.center();
              viewer.render();

              // Ensure sizing is correct and observe resizes
              try { viewer.resize(); viewer.render(); } catch {}
              if (!resizeObserverRef.current && viewerRef.current) {
                try {
                  resizeObserverRef.current = new ResizeObserver(() => {
                    try {
                      viewerInstanceRef.current?.resize();
                      viewerInstanceRef.current?.render();
                    } catch {}
                  });
                  resizeObserverRef.current.observe(viewerRef.current);
                } catch {}
              }

              console.log('3D viewer created successfully');

              // Add rotation animation
              let isAnimating = true;
              /* animation id tracked in animationRef */

              const animate = () => {
                if (isAnimating && viewer && viewerRef.current) {
                  try {
                    viewer.rotate(0.5, 'y');
                    viewer.render();
                    animationRef.current = requestAnimationFrame(animate);
                  } catch (e) {
                    console.error('Animation error:', e);
                    isAnimating = false;
                  }
                }
              };

              // Start animation after a delay
              setTimeout(() => {
                if (viewerRef.current) {
                  animate();
                }
              }, 300);

              // Hover controls
              const handleMouseEnter = () => {
                isAnimating = false;
                if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
              };

              const handleMouseLeave = () => {
                isAnimating = true;
                animate();
              };

              if (viewerRef.current) {
                viewerRef.current.addEventListener('mouseenter', handleMouseEnter);
                viewerRef.current.addEventListener('mouseleave', handleMouseLeave);
              }

              setIsInitialized(true);
              return;
            } else {
              console.warn('Empty SDF data for', data.name);
            }
          } catch (e) {
            console.error('3Dmol render error:', e);
          }
        }
      }

      // Fallback display
      console.log('Showing fallback display');
      viewerRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full bg-white rounded-lg">
          <div class="text-center p-2">
            <div class="text-sm font-medium text-axiom-text-primary mb-1">${data.name}</div>
            <div class="text-xs text-axiom-text-secondary">
              ${data.source.toUpperCase()} • ${data.molecular_formula || 'N/A'}
            </div>
          </div>
        </div>
      `;

    } catch (err) {
      console.error('Error initializing viewer:', err);
      setError('Failed to load 3D structure');
    }
  };

  // Attempt re-initialize once data is available and container is ready
  useEffect(() => {
    if (moleculeData && viewerRef.current && window.$3Dmol && !isInitialized) {
      initializeViewer(moleculeData);
    }
  }, [moleculeData, isInitialized]);

  // Since this component is dynamically imported with ssr: false, we don't need isClient checks

  if (loading) {
    return (

      <div className={`bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light ${className}`} style={{ height: `${height}px` }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-axiom-primary mx-auto mb-2"></div>
            <div className="text-sm text-axiom-text-secondary">Loading real structure...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-axiom-bg-graph-white rounded-lg border border-axiom-border-light ${className}`} style={{ height: `${height}px` }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-4">
            <div className="text-sm font-medium text-red-600 mb-2">Structure Unavailable</div>
            <div className="text-xs text-axiom-text-secondary">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-axiom-border-light overflow-hidden ${className}`} style={{ height: `${height}px` }}>
      <div
        ref={viewerRef}
        className="w-full relative"
        style={{
          height: `${height}px`,
          minHeight: `${height}px`,
          background: '#ffffff'
        }}
      />

      {/* Only show info panel for larger views (modal) */}
      {moleculeData && height > 300 && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-75 text-white">
          <div className="flex justify-between items-center text-xs">
            <div>
              <strong>Source:</strong> {moleculeData.source.toUpperCase()}
              {moleculeData.cid && <span className="ml-2">CID: {moleculeData.cid}</span>}
            </div>
            <div>
              {moleculeData.molecular_formula && (
                <span className="mr-3">
                  <strong>Formula:</strong> {moleculeData.molecular_formula}
                </span>
              )}
              {moleculeData.molecular_weight && (
                <span>
                  <strong>MW:</strong> {moleculeData.molecular_weight.toFixed(2)} g/mol
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Extend window type for 3Dmol
declare global {
  interface Window {
    $3Dmol: any;
  }
}
