'use client';

import * as React from 'react';
import { format, subDays, parseISO, isWithinInterval } from 'date-fns';
import { DUMMY_DATA, getFilterOptions } from '@/lib/dummyData';
import { DashboardFiltersComponent, ProductionChart, DailyBreakdownModal } from '@/components/dashboard';
import {
  ProductionData,
  ChartData,
  DashboardFilters,
  DailyBreakdown,
  SubPartSummary
} from '@/types';
import { SelectOption } from '@/types';

export default function DashboardPageClient() {
  const [filters, setFilters] = React.useState<DashboardFilters>({
    partCategory: '',
    part: '',
    dateRange: '30days',
  });

  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Page load animation
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get filter options from data
  const filterOptions = React.useMemo(() => getFilterOptions(DUMMY_DATA), []);

  const partCategoryOptions: SelectOption[] = React.useMemo(() =>
    filterOptions.partCategories.map(cat => ({ label: cat, value: cat })),
    [filterOptions.partCategories]
  );

  const partOptions: SelectOption[] = React.useMemo(() =>
    filterOptions.parts.map(part => ({ label: part, value: part })),
    [filterOptions.parts]
  );

  // Filter data based on current filters
  const filteredData = React.useMemo(() => {
    let data = DUMMY_DATA;

    // Filter by part category
    if (filters.partCategory) {
      data = data.filter(item => item.partCategory === filters.partCategory);
    }

    // Filter by part
    if (filters.part) {
      data = data.filter(item => item.part === filters.part);
    }

    // Filter by date range
    const today = new Date();
    let startDate: Date;

    switch (filters.dateRange) {
      case '7days':
        startDate = subDays(today, 7);
        break;
      case '30days':
      default:
        startDate = subDays(today, 30);
        break;
    }

    data = data.filter(item => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, { start: startDate, end: today });
    });

    return data;
  }, [filters]);

  // Transform data for chart
  const chartData = React.useMemo((): ChartData[] => {
    // Get all unique sub-parts from filtered data
    const allSubParts = new Set<string>();
    filteredData.forEach(item => allSubParts.add(item.subPart));
    const subPartsArray = Array.from(allSubParts);

    // Group data by date
    const dateGroups = new Map<string, ProductionData[]>();
    filteredData.forEach(item => {
      if (!dateGroups.has(item.date)) {
        dateGroups.set(item.date, []);
      }
      dateGroups.get(item.date)!.push(item);
    });

    // Determine date range
    const today = new Date();
    let startDate: Date;

    switch (filters.dateRange) {
      case '7days':
        startDate = subDays(today, 7);
        break;
      case '30days':
      default:
        startDate = subDays(today, 30);
        break;
    }

    // Generate all dates in the range
    const allDates: string[] = [];
    let currentDate = startDate;
    while (currentDate <= today) {
      allDates.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add one day
    }

    // Transform to chart format - include all dates
    return allDates.map(date => {
      const chartItem: ChartData = {
        date,
        formattedDate: format(parseISO(date), 'MMM dd'),
      };

      // Get data for this date, or empty array if no data
      const items = dateGroups.get(date) || [];

      // Group by sub-part and aggregate for this date
      const subPartGroups = new Map<string, { target: number; actual: number }>();

      items.forEach(item => {
        const key = item.subPart;
        if (!subPartGroups.has(key)) {
          subPartGroups.set(key, { target: 0, actual: 0 });
        }
        const group = subPartGroups.get(key)!;
        group.target += item.target;
        group.actual += item.actual;
      });

      // Add to chart item - include all sub-parts with 0 values for missing data
      subPartsArray.forEach(subPart => {
        const values = subPartGroups.get(subPart) || { target: 0, actual: 0 };
        chartItem[`${subPart}_target`] = values.target;
        chartItem[`${subPart}_actual`] = values.actual;
      });

      return chartItem;
    });
  }, [filteredData, filters.dateRange]);

  // Generate breakdown data for selected date
  const selectedDateBreakdown = React.useMemo((): DailyBreakdown | null => {
    if (!selectedDate) return null;

    const dayData = filteredData.filter(item => item.date === selectedDate);

    // If no data for this day, return a breakdown with no production
    if (dayData.length === 0) {
      return {
        date: selectedDate,
        formattedDate: format(parseISO(selectedDate), 'MMMM dd, yyyy'),
        subParts: [],
        totalTarget: 0,
        totalActual: 0,
        totalDelta: 0,
      };
    }

    const subParts: SubPartSummary[] = dayData.map(item => {
      const delta = item.actual - item.target;
      let performance: SubPartSummary['performance'] = 'good';

      if (delta < 0) {
        const variancePercent = Math.abs(delta) / item.target;
        performance = variancePercent > 0.1 ? 'poor' : 'warning';
      }

      return {
        subPart: item.subPart,
        part: item.part,
        partCategory: item.partCategory,
        target: item.target,
        actual: item.actual,
        delta,
        performance,
      };
    });

    const totalTarget = subParts.reduce((sum, item) => sum + item.target, 0);
    const totalActual = subParts.reduce((sum, item) => sum + item.actual, 0);
    const totalDelta = totalActual - totalTarget;

    return {
      date: selectedDate,
      formattedDate: format(parseISO(selectedDate), 'MMMM dd, yyyy'),
      subParts,
      totalTarget,
      totalActual,
      totalDelta,
    };
  }, [selectedDate, filteredData]);

  const handleBarClick = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-accent/30 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <main className="py-12 px-6">
        {/* Premium Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-3xl"></div>
          <div className="relative glass rounded-3xl px-8 pb-4 border border-white/20 shadow-premium">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      PT. Asahi Sukses Industri
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">Manufacturing Excellence Platform</p>
                  </div>
                </div>
                {/* <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Real-time monitoring of production targets and actuals across all manufacturing parts and sub-parts.
                  Precision analytics for operational excellence.
                </p> */}
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div className="text-sm font-medium text-foreground">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Live Data</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Premium Filters */}
        <div className={`mb-4 transition-all duration-700 ${isLoaded ? 'animate-in slide-in-from-left-4 fade-in duration-700' : ''}`} style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <DashboardFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            partCategoryOptions={partCategoryOptions}
            partOptions={partOptions}
            className="mb-6"
          />
        </div>

        {/* Chart */}
        <div className={`transition-all duration-700 ${isLoaded ? 'animate-in slide-in-from-right-4 fade-in duration-700' : ''}`} style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <ProductionChart
            data={chartData}
            onBarClick={handleBarClick}
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <div className={`bg-gradient-to-br from-blue-50/80 to-indigo-50/40 rounded-xl p-6 border border-blue-100/50 shadow-sm ${isLoaded ? 'animate-in slide-in-from-bottom-4 fade-in duration-700' : ''}`} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100/60 border border-blue-200/50">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h2a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h8a2 2 0 002-2V11M9 11h6" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Period</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {filters.dateRange === '7days' ? 8 : 31}
            </div>
            <div className="text-sm text-slate-600 font-medium">Total Days</div>
          </div>

          <div className={`bg-gradient-to-br from-emerald-50/80 to-teal-50/40 rounded-xl p-6 border border-emerald-100/50 shadow-sm ${isLoaded ? 'animate-in slide-in-from-bottom-4 fade-in duration-700' : ''}`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-emerald-100/60 border border-emerald-200/50">
                <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Active</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {new Set(filteredData.map(d => d.subPart)).size}
            </div>
            <div className="text-sm text-slate-600 font-medium">Sub-Parts</div>
          </div>

          <div className={`bg-gradient-to-br from-violet-50/80 to-purple-50/40 rounded-xl p-6 border border-violet-100/50 shadow-sm ${isLoaded ? 'animate-in slide-in-from-bottom-4 fade-in duration-700' : ''}`} style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-violet-100/60 border border-violet-200/50">
                <svg className="w-6 h-6 text-violet-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs text-violet-600 font-semibold uppercase tracking-wider">Target</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {filteredData.reduce((sum, d) => sum + d.target, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 font-medium">Production Target</div>
          </div>

          <div className={`bg-gradient-to-br from-rose-50/80 to-pink-50/40 rounded-xl p-6 border border-rose-100/50 shadow-sm ${isLoaded ? 'animate-in slide-in-from-bottom-4 fade-in duration-700' : ''}`} style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-rose-100/60 border border-rose-200/50">
                <svg className="w-6 h-6 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs text-rose-600 font-semibold uppercase tracking-wider">Actual</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {filteredData.reduce((sum, d) => sum + d.actual, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 font-medium">Production Actual</div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <DailyBreakdownModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={selectedDateBreakdown}
      />
    </div>
  );
}
