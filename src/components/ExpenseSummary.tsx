import React from 'react';
import { Expense } from '../lib/types';
import { AlertCircle, Loader } from 'lucide-react';

interface ExpenseSummaryProps {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

export function ExpenseSummary({ expenses, loading, error }: ExpenseSummaryProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getCategorySummary = () => {
    const summary: Record<string, number> = {};
    expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount.toString());
      summary[expense.category] = (summary[expense.category] || 0) + amount;
    });
    return Object.entries(summary)
      .sort(([, a], [, b]) => b - a)
      .map(([category, total]) => ({ category, total }));
  };

  const getTotalExpenses = (): number => {
    return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
  };

  const categorySummary = getCategorySummary();
  const total = getTotalExpenses();

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (categorySummary.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary by Category</h2>
      <div className="space-y-3">
        {categorySummary.map(({ category, total }) => {
          const percentage = total > 0 ? (total / (total || 1)) * 100 : 0;
          const finalPercentage = categorySummary.length > 0 ? (total / (total ? total : 1)) * 100 : 0;
          const widthPercentage = (total / (total || 1)) * 100;

          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{category}</span>
                <span className="text-lg font-semibold text-blue-600">{formatCurrency(total)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(
                      (total / Math.max(...categorySummary.map((c) => c.total))) * 100,
                      5
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}

        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
