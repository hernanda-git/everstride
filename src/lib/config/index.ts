/**
 * Application configuration
 */

export const config = {
  // App configuration
  app: {
    name: 'Everstride',
    description: 'A modern Next.js application',
    version: '0.1.0',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    retries: 3,
  },

  // Feature flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    darkMode: true,
    notifications: false,
  },

  // External services
  services: {
    analytics: {
      googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    },
  },
} as const;

export type Config = typeof config;
