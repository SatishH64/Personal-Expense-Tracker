import { useState } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { Wallet } from 'lucide-react';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleExpenseCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleExpensesUpdate = (expenses: any[], isLoading: boolean, err: string | null) => {
    setExpensesData(expenses);
    setLoading(isLoading);
    setError(err);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-gray-600 text-sm">Track your personal expenses effortlessly</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ExpenseForm onExpenseCreated={handleExpenseCreated} />
            <ExpenseList
              refreshTrigger={refreshTrigger}
              onCategoriesChange={() => {}}
              onExpensesUpdate={handleExpensesUpdate}
            />
          </div>
          <div>
            <ExpenseSummary expenses={expensesData} loading={loading} error={error} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Personal Finance Tool · Built with React, TypeScript, and Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
