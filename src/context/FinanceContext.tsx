import React, { createContext, useContext, useState } from 'react'
import {
  Transaction,
  Income,
  Category,
  Account,
  TransactionFormValues,
  IncomeFormValues,
  CategoryFormValues,
} from '@/lib/types'
import { isSameMonth, parseISO } from 'date-fns'

interface FinanceContextType {
  transactions: Transaction[]
  incomes: Income[]
  categories: Category[]
  accounts: Account[]
  currentDate: Date
  setCurrentDate: (date: Date) => void
  addTransaction: (data: TransactionFormValues) => void
  updateTransaction: (id: string, data: TransactionFormValues) => void
  deleteTransaction: (id: string) => void
  toggleTransactionStatus: (id: string) => void
  addIncome: (data: IncomeFormValues) => void
  updateIncome: (id: string, data: IncomeFormValues) => void
  deleteIncome: (id: string) => void
  addCategory: (category: CategoryFormValues) => void
  updateCategory: (id: string, category: CategoryFormValues) => void
  deleteCategory: (id: string) => void
  addAccount: (name: string) => void
  updateAccount: (id: string, name: string) => void
  deleteAccount: (id: string) => void
  getFilteredTransactions: () => Transaction[]
  getFilteredIncomes: () => Income[]
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// Mock Data
const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentação', budget: 1500, color: 'hsl(var(--chart-1))' },
  { id: '2', name: 'Moradia', budget: 2500, color: 'hsl(var(--chart-2))' },
  { id: '3', name: 'Transporte', budget: 800, color: 'hsl(var(--chart-3))' },
  { id: '4', name: 'Lazer', budget: 500, color: 'hsl(var(--chart-4))' },
  { id: '5', name: 'Saúde', budget: 300, color: 'hsl(var(--chart-5))' },
]

const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Nubank' },
  { id: '2', name: 'Itaú' },
  { id: '3', name: 'Carteira' },
]

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    name: 'Supermercado Mensal',
    amount: 850.5,
    date: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    categoryId: '1',
    accountId: '1',
    status: 'paid',
    paymentDate: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Aluguel',
    amount: 1800,
    date: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    categoryId: '2',
    accountId: '2',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Uber',
    amount: 45.9,
    date: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    categoryId: '3',
    accountId: '1',
    status: 'paid',
    paymentDate: new Date().toISOString(),
  },
]

const INITIAL_INCOMES: Income[] = [
  {
    id: '1',
    source: 'Salário',
    amount: 5000,
    date: new Date().toISOString(),
    description: 'Salário Mensal',
  },
]

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [incomes, setIncomes] = useState<Income[]>(INITIAL_INCOMES)
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // Helper to filter by current month
  const getFilteredTransactions = () => {
    return transactions.filter((t) =>
      isSameMonth(parseISO(t.dueDate), currentDate),
    )
  }

  const getFilteredIncomes = () => {
    return incomes.filter((i) => isSameMonth(parseISO(i.date), currentDate))
  }

  const addTransaction = (data: TransactionFormValues) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      amount: data.amount,
      categoryId: data.categoryId,
      accountId: data.accountId,
      dueDate: data.dueDate.toISOString(),
      date: new Date().toISOString(),
      status: data.status,
      paymentDate: data.paymentDate?.toISOString(),
    }
    setTransactions((prev) => [...prev, newTransaction])
  }

  const updateTransaction = (id: string, data: TransactionFormValues) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
              dueDate: data.dueDate.toISOString(),
              paymentDate: data.paymentDate?.toISOString(),
            }
          : t,
      ),
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleTransactionStatus = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'paid' ? 'pending' : 'paid'
          return {
            ...t,
            status: newStatus,
            paymentDate:
              newStatus === 'paid' ? new Date().toISOString() : undefined,
          }
        }
        return t
      }),
    )
  }

  const addIncome = (data: IncomeFormValues) => {
    const newIncome: Income = {
      id: Math.random().toString(36).substr(2, 9),
      source: data.source,
      description: data.description,
      amount: data.amount,
      date: data.date.toISOString(),
    }
    setIncomes((prev) => [...prev, newIncome])
  }

  const updateIncome = (id: string, data: IncomeFormValues) => {
    setIncomes((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              ...data,
              date: data.date.toISOString(),
            }
          : i,
      ),
    )
  }

  const deleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id))
  }

  const addCategory = (category: CategoryFormValues) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const updateCategory = (id: string, category: CategoryFormValues) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...category } : c)),
    )
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const addAccount = (name: string) => {
    const newAccount = {
      id: Math.random().toString(36).substr(2, 9),
      name,
    }
    setAccounts((prev) => [...prev, newAccount])
  }

  const updateAccount = (id: string, name: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, name } : a)))
  }

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  return React.createElement(
    FinanceContext.Provider,
    {
      value: {
        transactions,
        incomes,
        categories,
        accounts,
        currentDate,
        setCurrentDate,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        toggleTransactionStatus,
        addIncome,
        updateIncome,
        deleteIncome,
        addCategory,
        updateCategory,
        deleteCategory,
        addAccount,
        updateAccount,
        deleteAccount,
        getFilteredTransactions,
        getFilteredIncomes,
      },
    },
    children,
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
