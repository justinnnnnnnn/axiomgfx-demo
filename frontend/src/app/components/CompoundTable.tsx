"use client";

import React, { useState } from "react";

export type Compound = {
  id: string;
  name: string;
  tc20: number;
  tc50: number;
  ec20: number;
  ec50: number;
  riskScore: number; // 0-10
  riskCategory: 'Low' | 'Medium' | 'High';
  molecularWeight?: number;
  logp?: number;
  smiles?: string;
  therapeuticIndex?: number;
  safetyWindow?: [number, number];
};

export type CompoundTableProps = {
  compounds: Compound[];
  onSelect?: (compound: Compound) => void;
  selectedId?: string;
  className?: string;
};

type SortField = 'name' | 'tc20' | 'tc50' | 'ec20' | 'ec50' | 'riskScore' | 'molecularWeight' | 'logp';
type SortDirection = 'asc' | 'desc';

const MoleculeIcon = ({ compound }: { compound: Compound }) => (
  <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border border-blue-300">
    <div className="text-xs font-mono text-blue-800">
      {compound.name.substring(0, 3).toUpperCase()}
    </div>
  </div>
);

// RiskBadge component integrated inline for better layout control

const SortableHeaderDiv = ({
  field,
  children,
  sortField,
  sortDirection,
  onSort,
  align = 'left'
}: {
  field: SortField;
  children: React.ReactNode;
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
}) => (
  <div
    className={`cursor-pointer hover:bg-gray-100 transition-colors rounded px-2 py-1 ${
      align === 'right' ? 'text-right' : 'text-left'
    }`}
    onClick={() => onSort(field)}
  >
    <div className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'} space-x-1`}>
      <span>{children}</span>
      {sortField === field && (
        <span className="text-axiom-graph-blue">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </div>
  </div>
);

export default function CompoundTable({ compounds, onSelect, selectedId, className = "" }: CompoundTableProps) {
  const [sortField, setSortField] = useState<SortField | null>('riskScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCompounds = [...compounds].sort((a, b) => {
    if (!sortField) return 0;

    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    // Handle undefined/null values
    if (aVal == null) aVal = 0;
    if (bVal == null) bVal = 0;

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className={`rounded-2xl border border-axiom-border-light shadow-lg overflow-hidden ${className}`} style={{ backgroundColor: '#fdfdfd' }}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-axiom-border-light" style={{ backgroundColor: '#f5f3f2' }}>
        <div className="grid gap-4 items-center text-sm font-semibold text-axiom-text-primary" style={{ gridTemplateColumns: '80px 1fr 80px 80px 80px 80px 80px 80px 120px' }}>
          <div className="text-center">Structure</div>
          <SortableHeaderDiv field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
            Compound Name
          </SortableHeaderDiv>
          <SortableHeaderDiv field="tc20" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right">
            TC20 (μM)
          </SortableHeaderDiv>
          <SortableHeaderDiv field="tc50" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right">
            TC50 (μM)
          </SortableHeaderDiv>
          <SortableHeaderDiv field="ec20" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right">
            EC20 (μM)
          </SortableHeaderDiv>
          <SortableHeaderDiv field="ec50" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right">
            EC50 (μM)
          </SortableHeaderDiv>
          <SortableHeaderDiv field="molecularWeight" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right">
            MW (Da)
          </SortableHeaderDiv>
          <SortableHeaderDiv field="logp" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right">
            LogP
          </SortableHeaderDiv>
          <SortableHeaderDiv field="riskScore" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} align="right">
            DILI Risk
          </SortableHeaderDiv>
        </div>
      </div>

      {/* Rows */}
      <div className="px-4 py-2 space-y-2">
        {sortedCompounds.map((compound, index) => (
          <div
            key={compound.id}
            className={`
              rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] overflow-hidden
              ${selectedId === compound.id ? 'border-2 border-yellow-400' : ''}
            `}
            style={{
              backgroundColor: selectedId === compound.id ? '#ffe562' : (index % 2 === 0 ? '#fdfdfd' : 'white')
            }}
            onMouseEnter={(e) => {
              if (selectedId !== compound.id) {
                e.currentTarget.style.transition = 'background-color 0.15s ease';
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedId !== compound.id) {
                e.currentTarget.style.transition = 'none';
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fdfdfd' : 'white';
              }
            }}
            onClick={() => onSelect && onSelect(compound)}
          >
            <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '80px 1fr 80px 80px 80px 80px 80px 80px 120px' }}>
              {/* Structure */}
              <div className="flex justify-center">
                <MoleculeIcon compound={compound} />
              </div>

              {/* Compound Name */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-axiom-text-primary truncate">{compound.name}</span>
                <span className="text-xs text-axiom-text-light truncate">{compound.id}</span>
              </div>

              {/* TC20 */}
              <div className="text-sm text-right text-axiom-text-secondary font-mono">
                {compound.tc20.toFixed(2)}
              </div>

              {/* TC50 */}
              <div className="text-sm text-right text-axiom-text-secondary font-mono">
                {compound.tc50.toFixed(2)}
              </div>

              {/* EC20 */}
              <div className="text-sm text-right text-axiom-text-secondary font-mono">
                {compound.ec20.toFixed(2)}
              </div>

              {/* EC50 */}
              <div className="text-sm text-right text-axiom-text-secondary font-mono">
                {compound.ec50.toFixed(2)}
              </div>

              {/* MW */}
              <div className="text-sm text-right text-axiom-text-secondary font-mono">
                {compound.molecularWeight?.toFixed(1) || 'N/A'}
              </div>

              {/* LogP */}
              <div className="text-sm text-right text-axiom-text-secondary font-mono">
                {compound.logp?.toFixed(2) || 'N/A'}
              </div>

              {/* Risk Badge - Wider column to prevent overlap */}
              <div className="text-right">
                <div className="flex flex-col items-end space-y-1">
                  <span className="font-semibold text-axiom-text-primary">{compound.riskScore.toFixed(2)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                    compound.riskCategory === 'Low' ? 'bg-green-100 text-green-800 border-green-200' :
                    compound.riskCategory === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {compound.riskCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-axiom-border-light" style={{ backgroundColor: '#f5f3f2' }}>
        <div className="flex justify-between items-center text-sm text-axiom-text-secondary">
          <span>Showing {sortedCompounds.length} compounds</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-200 rounded-full"></div>
              <span>Low Risk</span>
            </span>
            <span className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
              <span>Medium Risk</span>
            </span>
            <span className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-200 rounded-full"></div>
              <span>High Risk</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


