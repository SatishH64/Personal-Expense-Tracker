/*
  # Create expenses table with idempotency support

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key) - Unique identifier for each expense
      - `amount` (numeric) - Expense amount with 2 decimal precision
      - `category` (varchar) - Expense category (Food, Transport, etc.)
      - `description` (text) - Detailed description of the expense
      - `date` (date) - Date when the expense occurred
      - `created_at` (timestamp) - When the expense record was created
      - `idempotency_key` (uuid, unique) - For handling duplicate submissions from retries

  2. Indexes
    - Index on category for efficient filtering
    - Index on date for efficient sorting
    - Unique constraint on idempotency_key for duplicate prevention

  3. Constraints
    - amount must be greater than 0
    - All fields are required (NOT NULL)
    - Dates cannot be in the future

  4. Important Notes
    - The idempotency_key ensures that duplicate POST requests (from retries or page refreshes) don't create multiple expense records
    - NUMERIC(10, 2) provides precise monetary arithmetic without floating-point errors
    - Row Level Security is enabled for future multi-user support
*/

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  category varchar(50) NOT NULL,
  description text NOT NULL,
  date date NOT NULL CHECK (date <= CURRENT_DATE),
  created_at timestamptz NOT NULL DEFAULT now(),
  idempotency_key uuid NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON expenses
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON expenses
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
