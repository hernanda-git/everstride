'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LegendProps,
} from 'recharts';
import { ChartData } from '@/types';

interface ProductionChartProps {
  data: ChartData[];
  onBarClick: (date: string) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    dataKey: string;
    value: number;
    color: string;
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark rounded-xl p-4 border border-white/20 shadow-premium backdrop-blur-xl">
        <p className="font-semibold text-primary mb-3 text-center">{label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-md shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground capitalize">
                  {entry.dataKey.replace(/_/g, ' ').replace('target', 'Target').replace('actual', 'Actual')}
                </span>
              </div>
              <span className="font-bold text-primary tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: LegendProps & { subParts: string[], getColor: (subPart: string, type: 'target' | 'actual') => string }) => {
  const { subParts, getColor } = props;

  return (
    <div className="flex flex-wrap gap-6 justify-center mt-6">
      {subParts.map((subPart, index) => (
        <div key={subPart} className="flex flex-col items-start gap-1">
          <div className="text-sm font-medium text-primary capitalize text-left">
            {subPart.replace(/_/g, ' ')}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <div
                className="w-4 h-4 rounded-md shadow-sm"
                style={{ backgroundColor: getColor(subPart, 'actual') }}
              />
              <span className="text-muted-foreground font-medium">Actual</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className="w-4 h-4 rounded-md shadow-sm"
                style={{ backgroundColor: getColor(subPart, 'target') }}
              />
              <span className="text-muted-foreground font-medium">Target</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export function ProductionChart({ data, onBarClick }: ProductionChartProps) {
  // Get all unique sub-parts from the data to create dynamic bars
  const subParts = React.useMemo(() => {
    const parts = new Set<string>();
    data.forEach(day => {
      Object.keys(day).forEach(key => {
        if (key.includes('_target') || key.includes('_actual')) {
          const partName = key.replace('_target', '').replace('_actual', '');
          parts.add(partName);
        }
      });
    });
    return Array.from(parts);
  }, [data]);

  // Generate clear, contrasting colors for each sub-part
  const getColor = (subPart: string, type: 'target' | 'actual') => {
    // High contrast color schemes with clear distinction between target and actual
    const colorSchemes = [
      // Blue scheme: Target = muted blue, Actual = bright blue
      { target: '#94a3b8', actual: '#3b82f6' },
      // Green scheme: Target = muted green, Actual = bright green
      { target: '#86efac', actual: '#22c55e' },
      // Purple scheme: Target = muted purple, Actual = bright purple
      { target: '#c4b5fd', actual: '#a855f7' },
      // Orange scheme: Target = muted orange, Actual = bright orange
      { target: '#fed7aa', actual: '#f97316' },
      // Teal scheme: Target = muted teal, Actual = bright teal
      { target: '#a7f3d0', actual: '#14b8a6' },
      // Pink scheme: Target = muted pink, Actual = bright pink
      { target: '#f9a8d4', actual: '#ec4899' },
      // Indigo scheme: Target = muted indigo, Actual = bright indigo
      { target: '#a5b4fc', actual: '#6366f1' },
      // Red scheme: Target = muted red, Actual = bright red
      { target: '#fca5a5', actual: '#ef4444' },
    ];

    const index = subParts.indexOf(subPart) % colorSchemes.length;
    return colorSchemes[index][type];
  };

  const handleClick = (data: { activeLabel?: string }) => {
    if (data && data.activeLabel) {
      const clickedDate = data.activeLabel;
      onBarClick(clickedDate);
    }
  };

  return (
    <div className="relative overflow-hidden glass rounded-3xl p-8 border border-white/20 shadow-premium">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>

      <div className="relative">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Production Analytics</h3>
              <p className="text-muted-foreground font-medium">Real-time target vs actual performance metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Click on any bar for detailed daily breakdown</span>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
              onClick={handleClick}
              className="cursor-pointer"
            >
              <defs>
                {subParts.map((subPart, index) => {
                  const targetColor = getColor(subPart, 'target');
                  const actualColor = getColor(subPart, 'actual');
                  return (
                    <React.Fragment key={`gradients-${subPart}`}>
                      <linearGradient id={`targetGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={targetColor} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={targetColor} stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id={`actualGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={actualColor} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={actualColor} stopOpacity={0.6} />
                      </linearGradient>
                    </React.Fragment>
                  );
                })}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.1)"
                opacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              />
              <Legend
                content={<CustomLegend subParts={subParts} getColor={getColor} />}
              />

              {subParts.map((subPart, index) => (
                <React.Fragment key={subPart}>
                  <Bar
                    dataKey={`${subPart}_target`}
                    fill={`url(#targetGradient-${index})`}
                    name={`${subPart} Target`}
                    radius={[4, 4, 0, 0]}
                    stroke={getColor(subPart, 'target')}
                    strokeWidth={1}
                  />
                  <Bar
                    dataKey={`${subPart}_actual`}
                    fill={`url(#actualGradient-${index})`}
                    name={`${subPart} Actual`}
                    radius={[4, 4, 0, 0]}
                    stroke={getColor(subPart, 'actual')}
                    strokeWidth={1}
                  />
                </React.Fragment>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
