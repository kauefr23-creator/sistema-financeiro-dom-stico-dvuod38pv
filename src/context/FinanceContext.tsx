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
  Invitation,
  ActivityLog,
  InviteFormValues,
} from '@/lib/types'
import { isSameMonth, parseISO } from 'date-fns'
import { toast } from 'sonner'

interface FinanceContextType {
  transactions: Transaction[]
  incomes: Income[]
  categories: Category[]
  accounts: Account[]
  companies: Company[]
  users: User[]
  invitations: Invitation[]
  activityLogs: ActivityLog[]
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
  sendInvitation: (data: InviteFormValues) => void
  deleteInvitation: (id: string) => void
  getFilteredTransactions: () => Transaction[]
  getFilteredIncomes: () => Income[]
  login: (data: LoginFormValues) => Promise<User | null>
  register: (data: RegisterFormValues) => Promise<boolean>
  logout: () => void
  checkPermission: (
    action: 'view' | 'edit' | 'admin',
    resource?: string,
  ) => boolean
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
    name: 'Usuário Admin',
    email: 'admin@demo.com',
    password: 'password',
    role: 'admin',
    companyId: '1',
  },
  {
    id: '2',
    name: 'Master User',
    email: 'master@demo.com',
    password: 'password',
    role: 'master',
  },
  {
    id: '3',
    name: 'Editor User',
    email: 'editor@demo.com',
    password: 'password',
    role: 'editor',
    companyId: '1',
  },
  {
    id: '4',
    name: 'Viewer User',
    email: 'viewer@demo.com',
    password: 'password',
    role: 'viewer',
    companyId: '1',
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

const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: '1',
    email: 'newuser@demo.com',
    role: 'viewer',
    companyId: '1',
    status: 'pending',
    date: new Date().toISOString(),
  },
]

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Usuário Admin',
    action: 'create',
    entity: 'Transaction',
    details: 'Created Supermercado Mensal',
    timestamp: new Date().toISOString(),
    companyId: '1',
  },
]

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [invitations, setInvitations] =
    useState<Invitation[]>(INITIAL_INVITATIONS)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS)

  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [incomes, setIncomes] = useState<Income[]>(INITIAL_INCOMES)
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // Helpers
  const logAction = (
    action: ActivityLog['action'],
    entity: ActivityLog['entity'],
    details: string,
  ) => {
    if (!currentUser) return
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      entity,
      details,
      timestamp: new Date().toISOString(),
      companyId: currentUser.companyId || 'master', // Fallback for master
    }
    setActivityLogs((prev) => [newLog, ...prev])
  }

  const checkPermission = (
    action: 'view' | 'edit' | 'admin',
    resource?: string,
  ): boolean => {
    if (!currentUser) return false
    if (currentUser.role === 'master') return true
    if (currentUser.role === 'admin') return true
    if (action === 'view') return true
    if (action === 'edit' && currentUser.role === 'editor') return true
    // Viewer can only view
    return false
  }

  // Authentication
  const login = async (data: LoginFormValues): Promise<User | null> => {
    const user = users.find(
      (u) => u.email === data.email && u.password === data.password,
    )
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user
      setCurrentUser(safeUser)
      // We don't log login here because logAction needs currentUser state which is not updated immediately in this scope
      // In a real app we'd use useEffect or a callback
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
      role: 'admin' as const, // Creator is admin
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

  // Filters
  const getFilteredTransactions = () => {
    if (!currentUser) return []
    // Master views logic handles in Dashboard, here standard view is restricted
    if (currentUser.role === 'master' && !currentUser.companyId) {
      // If master is not "simulating" a company, return empty or filtered by selected company in dashboard
      // For general views (Transactions/Incomes pages), better to return nothing or all if desired
      // Let's assume Master uses MasterDashboard for global view
      return []
    }

    return transactions.filter(
      (t) =>
        t.companyId === currentUser.companyId &&
        isSameMonth(parseISO(t.dueDate), currentDate),
    )
  }

  const getFilteredIncomes = () => {
    if (!currentUser) return []
    if (currentUser.role === 'master' && !currentUser.companyId) return []
    return incomes.filter(
      (i) =>
        i.companyId === currentUser.companyId &&
        isSameMonth(parseISO(i.date), currentDate),
    )
  }

  const filteredCategories = categories.filter(
    (c) => c.companyId === currentUser?.companyId,
  )
  const filteredAccounts = accounts.filter(
    (a) => a.companyId === currentUser?.companyId,
  )

  // Actions
  const addTransaction = (data: TransactionFormValues) => {
    if (!currentUser?.companyId || !checkPermission('edit')) return
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
    logAction('create', 'Transaction', `Created transaction "${data.name}"`)
    toast.success('Transação criada')
  }

  const updateTransaction = (id: string, data: TransactionFormValues) => {
    if (!checkPermission('edit')) return
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
    logAction('update', 'Transaction', `Updated transaction "${data.name}"`)
    toast.success('Transação atualizada')
  }

  const deleteTransaction = (id: string) => {
    if (!checkPermission('edit')) return
    const tx = transactions.find((t) => t.id === id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    logAction('delete', 'Transaction', `Deleted transaction "${tx?.name}"`)
    toast.success('Transação removida')
  }

  const toggleTransactionStatus = (id: string) => {
    if (!checkPermission('edit')) return
    const tx = transactions.find((t) => t.id === id)
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
    logAction('update', 'Transaction', `Toggled status for "${tx?.name}"`)
  }

  const addIncome = (data: IncomeFormValues) => {
    if (!currentUser?.companyId || !checkPermission('edit')) return
    const newIncome: Income = {
      id: Math.random().toString(36).substr(2, 9),
      source: data.source,
      description: data.description,
      amount: data.amount,
      date: data.date.toISOString(),
      companyId: currentUser.companyId,
    }
    setIncomes((prev) => [...prev, newIncome])
    logAction('create', 'Income', `Created income "${data.source}"`)
    toast.success('Receita adicionada')
  }

  const updateIncome = (id: string, data: IncomeFormValues) => {
    if (!checkPermission('edit')) return
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
    logAction('update', 'Income', `Updated income "${data.source}"`)
    toast.success('Receita atualizada')
  }

  const deleteIncome = (id: string) => {
    if (!checkPermission('edit')) return
    const inc = incomes.find((i) => i.id === id)
    setIncomes((prev) => prev.filter((i) => i.id !== id))
    logAction('delete', 'Income', `Deleted income "${inc?.source}"`)
    toast.success('Receita removida')
  }

  const addCategory = (category: CategoryFormValues) => {
    if (!currentUser?.companyId || !checkPermission('edit')) return
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
      companyId: currentUser.companyId,
    }
    setCategories((prev) => [...prev, newCategory])
    logAction('create', 'Category', `Created category "${category.name}"`)
    toast.success('Categoria criada')
  }

  const updateCategory = (id: string, category: CategoryFormValues) => {
    if (!checkPermission('edit')) return
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...category } : c)),
    )
    logAction('update', 'Category', `Updated category "${category.name}"`)
    toast.success('Categoria atualizada')
  }

  const deleteCategory = (id: string) => {
    if (!checkPermission('edit')) return
    const cat = categories.find((c) => c.id === id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
    logAction('delete', 'Category', `Deleted category "${cat?.name}"`)
    toast.success('Categoria removida')
  }

  const addAccount = (name: string) => {
    if (!currentUser?.companyId || !checkPermission('edit')) return
    const newAccount = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      companyId: currentUser.companyId,
    }
    setAccounts((prev) => [...prev, newAccount])
    logAction('create', 'Account', `Created account "${name}"`)
    toast.success('Conta criada')
  }

  const updateAccount = (id: string, name: string) => {
    if (!checkPermission('edit')) return
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, name } : a)))
    logAction('update', 'Account', `Updated account "${name}"`)
    toast.success('Conta atualizada')
  }

  const deleteAccount = (id: string) => {
    if (!checkPermission('edit')) return
    const acc = accounts.find((a) => a.id === id)
    setAccounts((prev) => prev.filter((a) => a.id !== id))
    logAction('delete', 'Account', `Deleted account "${acc?.name}"`)
    toast.success('Conta removida')
  }

  const sendInvitation = (data: InviteFormValues) => {
    if (!currentUser?.companyId || !checkPermission('admin')) return
    const newInvite: Invitation = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      role: data.role,
      companyId: currentUser.companyId,
      status: 'pending',
      date: new Date().toISOString(),
    }
    setInvitations((prev) => [...prev, newInvite])
    logAction('invite', 'Invitation', `Invited ${data.email} as ${data.role}`)
    toast.success('Convite enviado com sucesso')
  }

  const deleteInvitation = (id: string) => {
    if (!checkPermission('admin')) return
    const inv = invitations.find((i) => i.id === id)
    setInvitations((prev) => prev.filter((i) => i.id !== id))
    logAction('delete', 'Invitation', `Revoked invitation for ${inv?.email}`)
    toast.success('Convite removido')
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
        users,
        invitations,
        activityLogs,
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
        sendInvitation,
        deleteInvitation,
        getFilteredTransactions,
        getFilteredIncomes,
        login,
        register,
        logout,
        checkPermission,
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
