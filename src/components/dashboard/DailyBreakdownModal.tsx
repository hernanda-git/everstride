'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Modal } from '@/components/ui';
import { DailyBreakdown, SubPartSummary } from '@/types';
import { cn } from '@/lib/utils';

interface DailyBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DailyBreakdown | null;
}

const PerformanceIcon = ({ performance }: { performance: SubPartSummary['performance'] }) => {
  switch (performance) {
    case 'good':
      return <TrendingUp className="h-5 w-5 text-emerald-600" />;
    case 'warning':
      return <Minus className="h-5 w-5 text-amber-600" />;
    case 'poor':
      return <TrendingDown className="h-5 w-5 text-rose-600" />;
    default:
      return null;
  }
};

const PerformanceBadge = ({ performance }: { performance: SubPartSummary['performance'] }) => {
  const styles = {
    good: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 shadow-sm',
    warning: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 shadow-sm',
    poor: 'bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border-rose-200 shadow-sm',
  };

  const labels = {
    good: 'On Target',
    warning: 'Below Target',
    poor: 'Significantly Below',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border backdrop-blur-sm',
      styles[performance]
    )}>
      <PerformanceIcon performance={performance} />
      {labels[performance]}
    </span>
  );
};

export function DailyBreakdownModal({ isOpen, onClose, data }: DailyBreakdownModalProps) {
  const overallPerformance = React.useMemo(() => {
    if (!data) return 'good';
    const belowTargetCount = data.subParts.filter(s => s.actual < s.target).length;
    if (belowTargetCount === 0) return 'good';
    if (belowTargetCount <= data.subParts.length * 0.3) return 'warning';
    return 'poor';
  }, [data]);

  if (!data) return null;

  const { formattedDate, subParts, totalTarget, totalActual, totalDelta } = data;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Production Breakdown - ${formattedDate}`}
      className="max-w-6xl"
    >
      {subParts.length === 0 ? (
        // No production data
        <div className="text-center py-16">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg"></div>
          </div>
          <h3 className="text-xl font-bold text-primary mb-3">No Production Data</h3>
          <p className="text-muted-foreground text-lg">
            There was no manufacturing production recorded for {formattedDate}.
          </p>
        </div>
      ) : (
        <>
          {/* Premium Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group relative overflow-hidden glass rounded-2xl p-6 border border-white/20 shadow-premium hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Target</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{totalTarget.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-medium">Production Target</div>
              </div>
            </div>

            <div className="group relative overflow-hidden glass rounded-2xl p-6 border border-white/20 shadow-premium hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Actual</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{totalActual.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-medium">Production Actual</div>
              </div>
            </div>

            <div className="group relative overflow-hidden glass rounded-2xl p-6 border border-white/20 shadow-premium hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <PerformanceIcon performance={overallPerformance} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Variance</div>
                  </div>
                </div>
                <div className={cn(
                  "text-3xl font-bold mb-1 flex items-center gap-2",
                  totalDelta >= 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {totalDelta > 0 ? '+' : ''}{totalDelta.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Net Difference</div>
              </div>
            </div>
          </div>

          {/* Premium Detailed Table */}
          <div className="relative overflow-hidden glass rounded-2xl border border-white/20 shadow-premium">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-2xl"></div>
            <div className="relative overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary uppercase tracking-wide">
                      Sub-Part
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary uppercase tracking-wide">
                      Part
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary uppercase tracking-wide">
                      Category
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-primary uppercase tracking-wide">
                      Target
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-primary uppercase tracking-wide">
                      Actual
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-primary uppercase tracking-wide">
                      Variance
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-primary uppercase tracking-wide">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subParts.map((item, index) => (
                    <tr key={index} className="group hover:bg-primary/5 transition-colors duration-200 border-b border-border/30 last:border-b-0">
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        {item.subPart}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                        {item.part}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {item.partCategory}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-primary tabular-nums">
                        {item.target.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-primary tabular-nums">
                        {item.actual.toLocaleString()}
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-right text-sm font-bold tabular-nums",
                        item.delta >= 0 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {item.delta > 0 ? '+' : ''}{item.delta.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <PerformanceBadge performance={item.performance} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Premium Footer */}
      {subParts.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-primary">
                  {subParts.length} Total Sub-Parts
                </div>
                <div className="text-xs text-muted-foreground">
                  Manufacturing components tracked
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-primary">
                  {subParts.filter(s => s.actual < s.target).length} Underperforming
                </div>
                <div className="text-xs text-muted-foreground">
                  Below target metrics
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
