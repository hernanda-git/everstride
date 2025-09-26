const { subDays, format, startOfDay } = require('date-fns');

// Sample data for manufacturing parts
const PART_CATEGORIES = [
  'A033070030',
  'A033080011',
  'A033070003',
  'B044050015',
  'C055060020'
];

const PARTS = [
  'SAFETY WIRE',
  'BRAKE SHOE KEY TYPE A',
  'PEN SWING LINK',
  'HYDRAULIC CYLINDER',
  'VALVE ASSEMBLY',
  'BEARING HOUSING',
  'SHAFT COUPLING'
];

const SUB_PARTS = [
  'LOCKING METAL',
  'THIMBLE',
  'WASHER',
  'SEAL RING',
  'FASTENER',
  'CONNECTOR',
  'BRACKET',
  'MOUNTING PLATE',
  'O-RING',
  'BUSHING'
];

/**
 * Generate random integer within a range
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random number with variance around target
 */
function generateActual(target, variancePercent = 20) {
  const variance = target * (variancePercent / 100);
  const min = Math.max(0, target - variance);
  const max = target + variance;
  return Math.round(randomInt(min, max));
}

/**
 * Generate dummy manufacturing production data
 */
function generateDummyData(days = 30) {
  const data = [];
  const today = startOfDay(new Date());

  for (let dayOffset = days - 1; dayOffset >= 0; dayOffset--) {
    const date = subDays(today, dayOffset);

    // Generate 5-12 entries per day with varying sub-parts
    const entriesPerDay = randomInt(5, 12);

    for (let i = 0; i < entriesPerDay; i++) {
      const partCategory = PART_CATEGORIES[Math.floor(Math.random() * PART_CATEGORIES.length)];
      const part = PARTS[Math.floor(Math.random() * PARTS.length)];
      const subPart = SUB_PARTS[Math.floor(Math.random() * SUB_PARTS.length)];
      const target = randomInt(50, 200);
      const actual = generateActual(target);

      data.push({
        id: `${format(date, 'yyyy-MM-dd')}-${partCategory}-${part}-${subPart}-${i}`,
        date: format(date, 'yyyy-MM-dd'),
        partCategory,
        part,
        subPart,
        target,
        actual,
      });
    }
  }

  return data.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get unique values for filters
 */
function getFilterOptions(data) {
  const partCategories = [...new Set(data.map(d => d.partCategory))].sort();
  const parts = [...new Set(data.map(d => d.part))].sort();
  const subParts = [...new Set(data.map(d => d.subPart))].sort();

  return {
    partCategories,
    parts,
    subParts,
  };
}

// Configuration constants
const config = {
  app: {
    name: 'Everstride',
    description: 'A modern Next.js application',
    version: '0.1.0',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    retries: 3,
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    darkMode: true,
    notifications: false,
  },
  services: {
    analytics: {
      googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    },
  }
};

const APP_CONSTANTS = {
  APP_NAME: 'Everstride',
  APP_DESCRIPTION: 'A modern Next.js application',
  APP_VERSION: '0.1.0',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  API_TIMEOUT: 10000,
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ROUTES: {
    HOME: '/',
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
    SIGNUP: '/signup',
    PROFILE: '/profile',
  },
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme',
  }
};

// Generate the data
const DUMMY_DATA = generateDummyData(30);
const filterOptions = getFilterOptions(DUMMY_DATA);

// Create the complete dashboard data object
const dashboardData = {
  metadata: {
    app: {
      name: APP_CONSTANTS.APP_NAME,
      description: APP_CONSTANTS.APP_DESCRIPTION,
      version: APP_CONSTANTS.APP_VERSION
    },
    api: {
      baseUrl: APP_CONSTANTS.API_BASE_URL,
      timeout: APP_CONSTANTS.API_TIMEOUT
    },
    ui: {
      itemsPerPage: APP_CONSTANTS.ITEMS_PER_PAGE,
      maxFileSize: APP_CONSTANTS.MAX_FILE_SIZE,
      supportedImageTypes: APP_CONSTANTS.SUPPORTED_IMAGE_TYPES
    },
    routes: APP_CONSTANTS.ROUTES,
    storageKeys: APP_CONSTANTS.STORAGE_KEYS,
    config: config
  },
  productionData: DUMMY_DATA,
  filterOptions: filterOptions,
  currentFilters: {
    partCategory: '',
    part: '',
    dateRange: '30days'
  },
  statistics: {
    totalDays: 31,
    activeSubParts: new Set(DUMMY_DATA.map(d => d.subPart)).size,
    totalTarget: DUMMY_DATA.reduce((sum, d) => sum + d.target, 0),
    totalActual: DUMMY_DATA.reduce((sum, d) => sum + d.actual, 0),
    totalDelta: DUMMY_DATA.reduce((sum, d) => sum + d.actual, 0) - DUMMY_DATA.reduce((sum, d) => sum + d.target, 0)
  },
  chartData: [], // This would be computed dynamically in the React component
  dailyBreakdown: null, // This would be computed when a date is selected
  lastUpdated: new Date().toISOString(),
  status: 'live',
  dataSummary: {
    totalRecords: DUMMY_DATA.length,
    dateRange: {
      start: DUMMY_DATA[0]?.date,
      end: DUMMY_DATA[DUMMY_DATA.length - 1]?.date
    },
    uniqueCategories: filterOptions.partCategories.length,
    uniqueParts: filterOptions.parts.length,
    uniqueSubParts: filterOptions.subParts.length
  }
};

console.log(JSON.stringify(dashboardData, null, 2));
