"use client";

// FilterBar component for compound filtering

export type FilterState = {
  riskCategories: Array<'Low' | 'Medium' | 'High'>;
  searchText: string;
};

export type FilterBarProps = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  className?: string;
  compoundCount?: number;
  totalCount?: number;
};

export default function FilterBar({
  filters,
  onChange,
  className = "",
  compoundCount = 0,
  totalCount = 0
}: FilterBarProps) {
  const toggleRisk = (cat: 'Low' | 'Medium' | 'High') => {
    const exists = filters.riskCategories.includes(cat);
    const riskCategories = exists
      ? filters.riskCategories.filter((c) => c !== cat)
      : [...filters.riskCategories, cat];
    onChange({ ...filters, riskCategories });
  };

  const clearAllCategories = () => {
    onChange({ ...filters, riskCategories: [] });
  };

  const showAllCategories = () => {
    onChange({ ...filters, riskCategories: ['Low', 'Medium', 'High'] });
  };

  const hasActiveFilters = filters.searchText || filters.riskCategories.length < 3;

  return (
    <div className={`rounded-2xl border border-axiom-border-light shadow-lg ${className}`} style={{ backgroundColor: '#fdfdfd' }}>
      {/* Main Filter Bar */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-axiom-text-primary mb-2">
              Search Compounds
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchText}
                onChange={(e) => onChange({ ...filters, searchText: e.target.value })}
                placeholder="Search by compound name, ID, or properties..."
                className="w-full px-4 py-3 pl-10 border border-axiom-border-light rounded-lg focus:ring-2 focus:ring-axiom-yellow-button focus:border-transparent transition-colors bg-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-axiom-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Risk Categories */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-axiom-text-primary mb-2">
              Risk Categories
            </label>
            <div className="flex gap-2">
              {(['Low', 'Medium', 'High'] as const).map(risk => {
                const isSelected = filters.riskCategories.includes(risk);
                return (
                  <button
                    key={risk}
                    onClick={() => toggleRisk(risk)}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? risk === 'Low'
                          ? 'bg-green-100 text-green-800 border-2 border-green-300 shadow-md'
                          : risk === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300 shadow-md'
                          : 'bg-red-100 text-red-800 border-2 border-red-300 shadow-md'
                        : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {risk} Risk
                  </button>
                );
              })}
            </div>
          </div>

          {/* Always Visible Category Controls */}
          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={showAllCategories}
              className="px-3 py-2 text-xs font-medium text-green-600 hover:text-green-700 border border-green-200 rounded-md hover:bg-green-50 transition-colors cursor-pointer"
            >
              Show All
            </button>
            <button
              onClick={clearAllCategories}
              className="px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="px-6 py-4 bg-white border-t border-axiom-border-light rounded-b-2xl">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-axiom-text-secondary">
              Showing <strong className="text-axiom-text-primary">{compoundCount}</strong> of <strong className="text-axiom-text-primary">{totalCount}</strong> compounds
            </span>
            {hasActiveFilters && (
              <span className="text-axiom-text-light">
                ({totalCount - compoundCount} filtered out)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-axiom-text-secondary">
              <span>View:</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                <span className="text-xs">Low</span>
                <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
                <span className="text-xs">Med</span>
                <div className="w-3 h-3 bg-red-200 rounded-full"></div>
                <span className="text-xs">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



