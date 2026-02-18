import React, { useState, useEffect } from 'react';
import { getExpenses } from '../lib/api';
import { Expense } from '../lib/types';
import { AlertCircle, Loader, TrendingDown } from 'lucide-react';

interface ExpenseListProps {
  refreshTrigger: number;
  onCategoriesChange: (categories: string[]) => void;
  onExpensesUpdate?: (expenses: Expense[], loading: boolean, error: string | null) => void;
}

export function ExpenseList({ refreshTrigger, onCategoriesChange, onExpensesUpdate }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortByDate, setSortByDate] = useState(true);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getExpenses(selectedCategory, sortByDate);
      setExpenses(data);

      const categories = Array.from(new Set(data.map((e) => e.category))).sort();
      setAllCategories(categories);
      onCategoriesChange(categories);

      if (onExpensesUpdate) {
        onExpensesUpdate(data, false, null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch expenses';
      setError(errorMessage);
      if (onExpensesUpdate) {
        onExpensesUpdate([], false, errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger, selectedCategory, sortByDate]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateTotal = (): number => {
    return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
        <button
          onClick={fetchExpenses}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort
              </label>
              <button
                onClick={() => setSortByDate(!sortByDate)}
                className={`w-full px-3 py-2 rounded-md border transition-colors ${
                  sortByDate
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } hover:bg-blue-700 hover:border-blue-700 hover:text-white`}
              >
                {sortByDate ? 'Date (Newest)' : 'Date (Oldest)'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600 text-sm">Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <TrendingDown className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-700 text-center font-medium mb-1">
              {selectedCategory === 'all' ? 'No expenses yet' : `No ${selectedCategory} expenses`}
            </p>
            <p className="text-gray-600 text-sm text-center">Add one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900">{formatDate(expense.date)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{expense.description}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {formatCurrency(parseFloat(expense.amount.toString()))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && expenses.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Total ({expenses.length} expenses):
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
