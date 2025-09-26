/**
 * Global TypeScript type definitions
 */

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

// Manufacturing Dashboard Types
export interface ProductionData {
  id: string;
  date: string; // ISO date string
  partCategory: string;
  part: string;
  subPart: string;
  target: number;
  actual: number;
}

export interface ChartData {
  date: string;
  formattedDate: string;
  [key: string]: string | number; // Dynamic keys for sub-parts
}

export interface SubPartSummary {
  subPart: string;
  part: string;
  partCategory: string;
  target: number;
  actual: number;
  delta: number;
  performance: 'good' | 'warning' | 'poor';
}

export interface DashboardFilters {
  partCategory: string;
  part: string;
  dateRange: '7days' | '30days' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export interface DailyBreakdown {
  date: string;
  formattedDate: string;
  subParts: SubPartSummary[];
  totalTarget: number;
  totalActual: number;
  totalDelta: number;
}