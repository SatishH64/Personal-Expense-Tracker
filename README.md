# Expense Tracker

A personal finance tool for tracking and analyzing personal expenses with real-time synchronization and resilience to network issues.

## Features

### Core Features
- **Create Expenses**: Record expenses with amount, category, description, and date
- **View Expenses**: See a paginated list of all recorded expenses
- **Filter by Category**: Filter expenses by predefined categories
- **Sort by Date**: View expenses with newest-first sorting
- **Total Calculation**: See the sum of visible expenses

### Reliability Features
- **Idempotency Support**: Duplicate submissions from browser refreshes or network retries are automatically prevented
- **Error Handling**: Graceful handling of network failures with user-friendly error messages
- **Loading States**: Clear visual feedback during form submissions and data fetching
- **Validation**: Client-side and server-side validation for data integrity

## Tech Stack

### Frontend
- **React 18** - UI framework with hooks for state management
- **TypeScript** - Type-safe code for better maintainability
- **Tailwind CSS** - Utility-first styling framework
- **Lucide React** - Icon library for UI components
- **Vite** - Fast development server and build tool

### Backend
- **Supabase** - Managed PostgreSQL database with built-in authentication
- **PostgreSQL** - ACID-compliant relational database

### Database Persistence Choice

**Why PostgreSQL via Supabase?**

1. **ACID Compliance**: Ensures data integrity even with concurrent submissions
2. **Strong Consistency**: Transactions guarantee that duplicate submissions (idempotency key) are rejected atomically
3. **Scalability**: Can handle growing data volumes and concurrent users
4. **Automatic Backups**: Supabase provides automated daily backups
5. **Type Safety**: Row Level Security and constraints prevent invalid data
6. **Real-time Capabilities**: Supabase RealtimeDB for future enhancements
7. **Cost Effective**: Free tier sufficient for personal use with generous limits

## Architecture

### Database Schema

```sql
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  category varchar(50) NOT NULL,
  description text NOT NULL,
  date date NOT NULL CHECK (date <= CURRENT_DATE),
  created_at timestamptz NOT NULL DEFAULT now(),
  idempotency_key uuid NOT NULL UNIQUE
);
```

### Idempotency Implementation

Each expense submission includes a unique `idempotency_key` (UUID) generated on the client side. This prevents duplicate entries when:
- Users accidentally click submit multiple times
- Network requests are retried by the browser
- Users refresh the page after submission

The database enforces uniqueness on this key, automatically rejecting duplicate submissions.

### API Endpoints

#### POST /expenses (via Supabase)
Creates a new expense entry.

**Request:**
```typescript
{
  amount: number,
  category: string,
  description: string,
  date: string (YYYY-MM-DD),
  idempotency_key: string (UUID)
}
```

**Response:**
```typescript
{
  id: string (UUID),
  amount: number,
  category: string,
  description: string,
  date: string,
  created_at: string (ISO timestamp),
  idempotency_key: string
}
```

**Error Handling:**
- 400: Validation error (negative amount, future date, etc.)
- 409: Duplicate submission (idempotency key already exists)
- 500: Server error

#### GET /expenses (via Supabase)
Retrieves a list of expenses with optional filtering and sorting.

**Query Parameters:**
- `category` (optional): Filter by category name
- `sort` (optional): `date_desc` for newest-first sorting (default)

**Response:**
```typescript
{
  data: Expense[],
  total: number,
  count: number
}
```

## Project Structure

```
src/
├── components/
│   ├── ExpenseForm.tsx      # Form for creating new expenses
│   └── ExpenseList.tsx      # List view with filtering and sorting
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   ├── api.ts               # API functions and database operations
│   └── types.ts             # TypeScript interfaces
├── App.tsx                  # Main application component
├── main.tsx                 # React entry point
├── index.css                # Global styles with Tailwind
└── vite-env.d.ts            # Vite type definitions
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Acceptance Criteria - Implementation Status

✓ **1. Create Expense Entry**
- Form accepts amount, category, description, and date
- Full validation with error messages
- Idempotency support prevents duplicates

✓ **2. View Expense List**
- All expenses displayed in a responsive table
- Real-time refresh after each submission
- Loading states for better UX

✓ **3. Filter by Category**
- Category dropdown dynamically populated from data
- "All Categories" option for viewing all expenses
- Instant filtering without page reload

✓ **4. Sort by Date**
- Newest-first default sorting
- Toggle button for sort direction
- Persistent sort state during filtering

✓ **5. Display Total**
- Sum calculation based on visible (filtered) expenses
- Currency formatting with rupee symbol
- Updates automatically with filters/sorting

## Nice-to-Have Features

### Implemented
- ✓ Form validation (amount > 0, date not in future)
- ✓ Error and loading states in UI
- ✓ Idempotency handling for retries and page refreshes
- ✓ Graceful error handling with retry option

## Error Scenarios Handled

1. **Network Failures**: Graceful error display with retry button
2. **Validation Errors**: Clear error messages for invalid inputs
3. **Duplicate Submissions**: Automatically prevented via idempotency key
4. **Browser Refresh**: Form data can be recovered, duplicates prevented
5. **Concurrent Submissions**: Button disabled during submission
6. **Missing Environment Variables**: Application fails fast with clear error

## Performance Considerations

- Database indexes on `category`, `date`, and `created_at` for fast queries
- Pagination ready (can be added to GET /expenses)
- Numeric(10,2) type prevents floating-point precision errors
- Lazy loading of expenses with efficient queries
- Debounced filter/sort UI updates

## Security Considerations

- Row Level Security (RLS) enabled for future multi-user support
- User inputs validated both client and server-side
- Supabase handles SQL injection prevention automatically
- Environment variables kept in `.env` and never exposed
- No sensitive data stored in localStorage

## Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting (Vercel, Netlify, GitHub Pages, etc.)
3. Supabase database is already managed and hosted

## Testing

Run the development server and test the following scenarios:
- Add multiple expenses
- Filter by different categories
- Sort by date
- Submit duplicate expenses (verify duplicate prevention)
- Refresh page during submission
- Disconnect network and retry

## License

MIT
