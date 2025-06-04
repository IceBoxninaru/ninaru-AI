export interface ErrorTemplate {
  code: string;
  message: {
    ja: string;
    en: string;
  };
  severity: ErrorSeverity;
  category: string;
}

export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface ErrorContext {
  component?: string;
  action?: string;
  data?: any;
} 