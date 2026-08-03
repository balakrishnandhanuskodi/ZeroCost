import { supabase } from './supabase'
import type { Transaction, Budget, Loan, Goal, Savings } from '../types/database'

export const db = {
  transactions: {
    async list(userId: string) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
      if (error) throw error
      return data as Transaction[]
    },
    async create(userId: string, transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: userId }])
        .select()
      if (error) throw error
      return data[0] as Transaction
    },
    async update(id: string, updates: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0] as Transaction
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
  },

  budgets: {
    async list(userId: string) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
      if (error) throw error
      return data as Budget[]
    },
    async create(userId: string, budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{ ...budget, user_id: userId }])
        .select()
      if (error) throw error
      return data[0] as Budget
    },
    async update(id: string, updates: Partial<Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0] as Budget
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
  },

  loans: {
    async list(userId: string) {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', userId)
      if (error) throw error
      return data as Loan[]
    },
    async create(userId: string, loan: Omit<Loan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('loans')
        .insert([{ ...loan, user_id: userId }])
        .select()
      if (error) throw error
      return data[0] as Loan
    },
    async update(id: string, updates: Partial<Omit<Loan, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
      const { data, error } = await supabase
        .from('loans')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0] as Loan
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('loans')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
  },

  goals: {
    async list(userId: string) {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
      if (error) throw error
      return data as Goal[]
    },
    async create(userId: string, goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('goals')
        .insert([{ ...goal, user_id: userId }])
        .select()
      if (error) throw error
      return data[0] as Goal
    },
    async update(id: string, updates: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0] as Goal
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
  },

  savings: {
    async list(userId: string) {
      const { data, error } = await supabase
        .from('savings')
        .select('*')
        .eq('user_id', userId)
      if (error) throw error
      return data as Savings[]
    },
    async create(userId: string, savings: Omit<Savings, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('savings')
        .insert([{ ...savings, user_id: userId }])
        .select()
      if (error) throw error
      return data[0] as Savings
    },
    async update(id: string, updates: Partial<Omit<Savings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
      const { data, error } = await supabase
        .from('savings')
        .update(updates)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0] as Savings
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('savings')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
  },
}
