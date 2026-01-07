import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Transaction,
  Income,
  Category,
  Account,
  TransactionFormValues,
  IncomeFormValues,
  CategoryFormValues,
  User,
  Company,
  LoginFormValues,
  RegisterFormValues,
} from '@/lib/types'
import { isSameMonth, parseISO } from 'date-fns'
import { toast } from 'sonner'

interface FinanceContextType {
  transactions: Transaction[]
  incomes: Income[]
  categories: Category[]
  accounts: Account[]
  companies: Company[]
  currentDate: Date
  currentUser: User | null
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
  login: (data: LoginFormValues) => Promise<User | null>
  register: (data: RegisterFormValues) => Promise<boolean>
  logout: () => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// Mock Data
const INITIAL_COMPANIES: Company[] = [
  { id: '1', name: 'Minha Casa' },
  { id: '2', name: 'Empresa Demo' },
]

const INITIAL_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Usuário Padrão',
    email: 'user@demo.com',
    password: 'password',
    role: 'user',
    companyId: '1',
  },
  {
    id: '2',
    name: 'Master Admin',
    email: 'admin@demo.com',
    password: 'password',
    role: 'master',
  },
  {
    id: '3',
    name: 'Outro Usuário',
    email: 'other@demo.com',
    password: 'password',
    role: 'user',
    companyId: '2',
  },
]

const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Alimentação',
    budget: 1500,
    color: 'hsl(var(--chart-1))',
    companyId: '1',
  },
  {
    id: '2',
    name: 'Moradia',
    budget: 2500,
    color: 'hsl(var(--chart-2))',
    companyId: '1',
  },
  {
    id: '3',
    name: 'Transporte',
    budget: 800,
    color: 'hsl(var(--chart-3))',
    companyId: '1',
  },
  {
    id: '4',
    name: 'Lazer',
    budget: 500,
    color: 'hsl(var(--chart-4))',
    companyId: '1',
  },
  {
    id: '5',
    name: 'Saúde',
    budget: 300,
    color: 'hsl(var(--chart-5))',
    companyId: '1',
  },
  // Company 2
  {
    id: '6',
    name: 'Operacional',
    budget: 5000,
    color: 'hsl(var(--chart-1))',
    companyId: '2',
  },
]

const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Nubank', companyId: '1' },
  { id: '2', name: 'Itaú', companyId: '1' },
  { id: '3', name: 'Carteira', companyId: '1' },
  // Company 2
  { id: '4', name: 'Bradesco PJ', companyId: '2' },
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
    companyId: '1',
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
    companyId: '1',
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
    companyId: '1',
  },
  // Company 2
  {
    id: '4',
    name: 'Servidor AWS',
    amount: 350.0,
    date: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    categoryId: '6',
    accountId: '4',
    status: 'pending',
    companyId: '2',
  },
]

const INITIAL_INCOMES: Income[] = [
  {
    id: '1',
    source: 'Salário',
    amount: 5000,
    date: new Date().toISOString(),
    description: 'Salário Mensal',
    companyId: '1',
  },
  // Company 2
  {
    id: '2',
    source: 'Bônus',
    amount: 15000,
    date: new Date().toISOString(),
    description: 'Vendas Q1',
    companyId: '2',
  },
]

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [incomes, setIncomes] = useState<Income[]>(INITIAL_INCOMES)
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // Authentication
  const login = async (data: LoginFormValues): Promise<User | null> => {
    const user = users.find(
      (u) => u.email === data.email && u.password === data.password,
    )
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user
      setCurrentUser(safeUser)
      toast.success(`Bem-vindo, ${user.name}!`)
      return safeUser
    }
    toast.error('Email ou senha inválidos')
    return null
  }

  const register = async (data: RegisterFormValues): Promise<boolean> => {
    if (users.find((u) => u.email === data.email)) {
      toast.error('Email já cadastrado')
      return false
    }

    const newCompanyId = Math.random().toString(36).substr(2, 9)
    const newCompany: Company = {
      id: newCompanyId,
      name: data.companyName,
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user' as const,
      companyId: newCompanyId,
    }

    setCompanies((prev) => [...prev, newCompany])
    setUsers((prev) => [...prev, newUser])

    // Login immediately
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = newUser
    setCurrentUser(safeUser)
    toast.success('Conta criada com sucesso!')
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    toast.info('Você saiu do sistema')
  }

  // Helper filters
  const getFilteredTransactions = () => {
    if (!currentUser) return []
    // Master sees all transactions if they are in standard view?
    // User story says: Standard users restricted. Master sees consolidated.
    // For standard pages reuse, if master is logged in without specific company context, return all?
    // Let's restrict standard view to current company. If Master, they might need to use Dashboard.
    // But for demo purposes, if Master has no companyId, they see nothing in standard views.
    return transactions.filter(
      (t) =>
        t.companyId === currentUser.companyId &&
        isSameMonth(parseISO(t.dueDate), currentDate),
    )
  }

  const getFilteredIncomes = () => {
    if (!currentUser) return []
    return incomes.filter(
      (i) =>
        i.companyId === currentUser.companyId &&
        isSameMonth(parseISO(i.date), currentDate),
    )
  }

  // Filtered lists for selection
  const filteredCategories = categories.filter(
    (c) => c.companyId === currentUser?.companyId,
  )
  const filteredAccounts = accounts.filter(
    (a) => a.companyId === currentUser?.companyId,
  )

  const addTransaction = (data: TransactionFormValues) => {
    if (!currentUser?.companyId) return
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
      companyId: currentUser.companyId,
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
    if (!currentUser?.companyId) return
    const newIncome: Income = {
      id: Math.random().toString(36).substr(2, 9),
      source: data.source,
      description: data.description,
      amount: data.amount,
      date: data.date.toISOString(),
      companyId: currentUser.companyId,
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
    if (!currentUser?.companyId) return
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
      companyId: currentUser.companyId,
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
    if (!currentUser?.companyId) return
    const newAccount = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      companyId: currentUser.companyId,
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
        categories: filteredCategories,
        accounts: filteredAccounts,
        companies,
        currentDate,
        currentUser,
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
        login,
        register,
        logout,
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
