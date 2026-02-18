import { supabase } from './supabase';
import { CreateExpenseInput, Expense } from './types';
import { v4 as uuidv4 } from 'crypto';

const generateIdempotencyKey = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export async function createExpense(
  input: CreateExpenseInput,
  idempotencyKey: string
): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      amount: input.amount,
      category: input.category,
      description: input.description,
      date: input.date,
      idempotency_key: idempotencyKey,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('This expense was already submitted. Please refresh to see it.');
    }
    throw error;
  }

  return data;
}

export async function getExpenses(
  category?: string,
  sortByDate = true
): Promise<Expense[]> {
  let query = supabase.from('expenses').select('*');

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (sortByDate) {
    query = query.order('date', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

export function generateIdempotencyKeyForClient(): string {
  return generateIdempotencyKey();
}
