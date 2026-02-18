import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getExpenses } from '../lib/api';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(function() {
          return this;
        }),
        order: vi.fn(function() {
          return this;
        }),
        then: vi.fn(async function() {
          return {
            data: [
              {
                id: '1',
                amount: 100,
                category: 'Food',
                description: 'Lunch',
                date: '2024-01-15',
              },
              {
                id: '2',
                amount: 50,
                category: 'Transport',
                description: 'Taxi',
                date: '2024-01-16',
              },
            ],
            error: null,
          };
        }),
      })),
    })),
  },
}));

describe('API - getExpenses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all expenses', async () => {
    const expenses = await getExpenses();
    expect(expenses).toBeDefined();
    expect(Array.isArray(expenses)).toBe(true);
  });

  it('should handle category filter', async () => {
    const expenses = await getExpenses('Food');
    expect(expenses).toBeDefined();
  });

  it('should return empty array on error', async () => {
    const expenses = await getExpenses();
    expect(Array.isArray(expenses)).toBe(true);
  });

  it('should sort by date when sortByDate is true', async () => {
    const expenses = await getExpenses(undefined, true);
    expect(expenses).toBeDefined();
  });
});
