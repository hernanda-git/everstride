import { subDays, format, startOfDay } from 'date-fns';
import { ProductionData } from '@/types';

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
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random number with variance around target
 */
function generateActual(target: number, variancePercent: number = 20): number {
  const variance = target * (variancePercent / 100);
  const min = Math.max(0, target - variance);
  const max = target + variance;
  return Math.round(randomInt(min, max));
}

/**
 * Generate dummy manufacturing production data
 */
export function generateDummyData(days: number = 30): ProductionData[] {
  const data: ProductionData[] = [];
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
export function getFilterOptions(data: ProductionData[]) {
  const partCategories = [...new Set(data.map(d => d.partCategory))].sort();
  const parts = [...new Set(data.map(d => d.part))].sort();
  const subParts = [...new Set(data.map(d => d.subPart))].sort();

  return {
    partCategories,
    parts,
    subParts,
  };
}

// Export the generated data
export const DUMMY_DATA = generateDummyData(30);
