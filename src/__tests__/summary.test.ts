import { describe, it, expect } from 'vitest';

describe('Expense Summary Calculations', () => {
  const mockExpenses = [
    { id: '1', amount: 100, category: 'Food', description: 'Lunch', date: '2024-01-15' },
    { id: '2', amount: 50, category: 'Transport', description: 'Taxi', date: '2024-01-16' },
    { id: '3', amount: 75, category: 'Food', description: 'Dinner', date: '2024-01-17' },
    { id: '4', amount: 30, category: 'Entertainment', description: 'Movie', date: '2024-01-18' },
  ];

  it('should calculate total expenses correctly', () => {
    const total = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    expect(total).toBe(255);
  });

  it('should group expenses by category', () => {
    const grouped: Record<string, number> = {};
    mockExpenses.forEach((expense) => {
      grouped[expense.category] = (grouped[expense.category] || 0) + expense.amount;
    });

    expect(grouped['Food']).toBe(175);
    expect(grouped['Transport']).toBe(50);
    expect(grouped['Entertainment']).toBe(30);
  });

  it('should sort categories by amount descending', () => {
    const grouped: Record<string, number> = {};
    mockExpenses.forEach((expense) => {
      grouped[expense.category] = (grouped[expense.category] || 0) + expense.amount;
    });

    const sorted = Object.entries(grouped)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category);

    expect(sorted[0]).toBe('Food');
    expect(sorted[1]).toBe('Transport');
    expect(sorted[2]).toBe('Entertainment');
  });

  it('should handle empty expenses array', () => {
    const total = [].reduce((sum: number) => sum, 0);
    expect(total).toBe(0);
  });

  it('should calculate percentage distribution correctly', () => {
    const grouped: Record<string, number> = {};
    mockExpenses.forEach((expense) => {
      grouped[expense.category] = (grouped[expense.category] || 0) + expense.amount;
    });

    const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);
    const foodPercentage = (grouped['Food'] / total) * 100;

    expect(foodPercentage).toBeCloseTo(68.63, 1);
  });
});
