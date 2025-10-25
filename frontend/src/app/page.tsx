"use client";

import { useState, useEffect } from 'react';
// Button component replaced with inline styled buttons
import CompoundTable, { Compound } from './components/CompoundTable';
import CompoundDetailSidebar from './components/CompoundDetailSidebar';
import RiskDashboard from './components/RiskDashboard';
import FilterBar, { FilterState } from './components/FilterBar';
import { fetchCompounds } from './lib/mockData';

export default function Home() {
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [selectedCompound, setSelectedCompound] = useState<Compound | null>(null);
  const [filters, setFilters] = useState<FilterState>({ riskCategories: ['Low','Medium','High'], searchText: '' });
  const [currentView, setCurrentView] = useState<'table' | 'dashboard'>('table');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load compounds on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchCompounds();
        if (cancelled) return;
        setCompounds(data);
      } catch (error) {
        console.error('Failed to load compounds:', error);
      } finally {
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Dose response data is handled within the sidebar component

  // Filter compounds based on current filters
  const filteredCompounds = compounds.filter(compound => {
    const cat = compound.riskScore < 3.3 ? 'Low' : compound.riskScore < 6.6 ? 'Medium' : 'High';
    const matchesRisk = filters.riskCategories.includes(cat as any);
    const matchesText = !filters.searchText || compound.name.toLowerCase().includes(filters.searchText.toLowerCase());
    return matchesRisk && matchesText;
  });

  const handleCompoundSelect = (compound: Compound) => {
    setSelectedCompound(compound);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    // Keep the compound selected but close sidebar
  };

  const stats = {
    total: compounds.length,
    highRisk: compounds.filter(c => c.riskScore >= 6.6).length,
    mediumRisk: compounds.filter(c => c.riskScore >= 3.3 && c.riskScore < 6.6).length,
    lowRisk: compounds.filter(c => c.riskScore < 3.3).length,
    avgRisk: compounds.length > 0 ? (compounds.reduce((sum, c) => sum + c.riskScore, 0) / compounds.length) : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-axiom-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-axiom-yellow-button mx-auto mb-4"></div>
          <div className="text-axiom-text-secondary">Loading compound library...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-axiom-bg-primary">
      {/* Navigation */}
      <nav className="border-b border-axiom-border-light" style={{ backgroundColor: '#fdfdfd' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-axiom-text-primary">AxiomGFX</div>
              <div className="hidden md:flex items-center rounded-lg overflow-hidden" style={{ backgroundColor: '#ffe562' }}>
                <button
                  onClick={() => setCurrentView('table')}
                  className="px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer text-axiom-text-primary"
                  style={{
                    backgroundColor: currentView === 'table' ? '#ffd700' : 'transparent',
                    boxShadow: currentView === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Compound Table
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer text-axiom-text-primary"
                  style={{
                    backgroundColor: currentView === 'dashboard' ? '#ffd700' : 'transparent',
                    boxShadow: currentView === 'dashboard' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Risk Dashboard
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm text-axiom-text-secondary">
                <span>Total: <strong className="text-axiom-text-primary">{stats.total}</strong></span>
                <span>High Risk: <strong className="text-red-600">{stats.highRisk}</strong></span>
                <span>Avg Risk: <strong className="text-axiom-text-primary">{stats.avgRisk.toFixed(2)}</strong></span>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-axiom-text-primary transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: '#ffe562' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffe562';
                }}
              >
                New Analysis
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-axiom-text-primary transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: '#ffe562' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffe562';
                }}
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Panel */}
        <div className={`flex-1 overflow-hidden ${sidebarOpen ? 'mr-96' : ''} transition-all duration-300`}>
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-axiom-text-primary mb-2">
                  {currentView === 'table' ? 'Compound Analysis' : 'DILI Risk Dashboard'}
                </h1>
                <p className="text-axiom-text-secondary">
                  {currentView === 'table'
                    ? 'Comprehensive toxicity analysis of pharmaceutical compounds'
                    : 'Visual overview of drug-induced liver injury risk across compound library'
                  }
                </p>
              </div>

              {/* Filters */}
              <FilterBar
                filters={filters}
                onChange={setFilters}
                className="mb-6"
                compoundCount={filteredCompounds.length}
                totalCount={compounds.length}
              />

              {/* Content based on current view */}
              {currentView === 'table' ? (
                <CompoundTable
                  compounds={filteredCompounds}
                  onSelect={handleCompoundSelect}
                  selectedId={selectedCompound?.id}
                  className="shadow-xl"
                />
              ) : (
                <RiskDashboard
                  compounds={filteredCompounds}
                  onCompoundSelect={handleCompoundSelect}
                  selectedCompound={selectedCompound}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="fixed right-0 top-16 w-96 h-[calc(100vh-4rem)] bg-white border-l border-axiom-border-light shadow-2xl z-50">
            <CompoundDetailSidebar
              compound={selectedCompound}
              onClose={handleSidebarClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
