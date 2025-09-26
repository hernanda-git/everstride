'use client';

import * as React from 'react';
import { CalendarDays, Filter } from 'lucide-react';
import { Select } from '@/components/ui';
import { DashboardFilters, SelectOption } from '@/types';
import { cn } from '@/lib/utils';

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  partCategoryOptions: SelectOption[];
  partOptions: SelectOption[];
  className?: string;
}

const DATE_RANGE_OPTIONS: SelectOption[] = [
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Custom range', value: 'custom' },
];

export function DashboardFiltersComponent({
  filters,
  onFiltersChange,
  partCategoryOptions,
  partOptions,
  className,
}: DashboardFiltersProps) {
  const handlePartCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      partCategory: value,
      part: '', // Reset part when category changes
    });
  };

  const handlePartChange = (value: string) => {
    onFiltersChange({
      ...filters,
      part: value,
    });
  };

  const handleDateRangeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: value as DashboardFilters['dateRange'],
    });
  };

  // Filter parts based on selected category
  const filteredPartOptions = React.useMemo(() => {
    if (!filters.partCategory) return partOptions;
    // In a real app, this would filter parts by category from the data
    return partOptions;
  }, [filters.partCategory, partOptions]);

  return (
    <div className={cn('relative glass rounded-2xl p-6 border border-white/20 shadow-premium', className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-2xl"></div>
      <div className="relative flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-primary shadow-lg">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-lg font-semibold text-primary">Analytics Filters</span>
            <p className="text-xs text-muted-foreground">Refine your production data view</p>
          </div>
        </div>

        <div className="w-px h-12 bg-border hidden sm:block"></div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50">
              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">Category</label>
              <Select
                options={[{ label: 'All Categories', value: '' }, ...partCategoryOptions]}
                value={filters.partCategory}
                onValueChange={handlePartCategoryChange}
                className="w-48 min-w-[200px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
              <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">Part</label>
              <Select
                options={[{ label: 'All Parts', value: '' }, ...filteredPartOptions]}
                value={filters.part}
                onValueChange={handlePartChange}
                className="w-56 min-w-[200px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50">
              <CalendarDays className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-1 block">Time Period</label>
              <Select
                options={DATE_RANGE_OPTIONS}
                value={filters.dateRange}
                onValueChange={handleDateRangeChange}
                className="w-40 min-w-[160px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl"></div>
    </div>
  );
}
