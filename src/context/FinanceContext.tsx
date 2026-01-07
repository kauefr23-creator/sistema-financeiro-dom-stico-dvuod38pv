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
  Integration,
  DashboardWidgetConfig,
} from '@/lib/types'
import { isSameMonth, parseISO, subMonths } from 'date-fns'
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
  integrations: Integration[]
  dashboardConfig: DashboardWidgetConfig[]
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
  connectIntegration: (provider: Integration['provider'], name: string) => void
  disconnectIntegration: (id: string) => void
  syncIntegration: (id: string) => void
  updateDashboardConfig: (config: DashboardWidgetConfig[]) => void
  exportActivityLogs: () => void
  getFilteredTransactions: () => Transaction[]
  getFilteredIncomes: () => Income[]
  login: (data: LoginFormValues) => Promise<User | null>
  register: (data: RegisterFormValues) => Promise<boolean>
  logout: () => void
  checkPermission: (
    action: 'view' | 'edit' | 'admin',
    resource?: string,
  ) => boolean
  resetUserPassword: (userId: string) => string | null
  sendPasswordResetLink: (email: string) => void
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
  // Past Month Mock Data for Trends
  {
    id: '10',
    name: 'Compras Passadas',
    amount: 1200,
    date: subMonths(new Date(), 1).toISOString(),
    dueDate: subMonths(new Date(), 1).toISOString(),
    categoryId: '1',
    accountId: '1',
    status: 'paid',
    paymentDate: subMonths(new Date(), 1).toISOString(),
    companyId: '1',
  },
  {
    id: '11',
    name: 'Aluguel Passado',
    amount: 1800,
    date: subMonths(new Date(), 1).toISOString(),
    dueDate: subMonths(new Date(), 1).toISOString(),
    categoryId: '2',
    accountId: '2',
    status: 'paid',
    paymentDate: subMonths(new Date(), 1).toISOString(),
    companyId: '1',
  },
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
  // Past Month Mock Data
  {
    id: '10',
    source: 'Salário Passado',
    amount: 5000,
    date: subMonths(new Date(), 1).toISOString(),
    description: 'Salário Mês Anterior',
    companyId: '1',
  },
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

const INITIAL_WIDGET_CONFIG: DashboardWidgetConfig[] = [
  { id: 'summary', visible: true, order: 0 },
  { id: 'trend', visible: true, order: 1 },
  { id: 'expenses', visible: true, order: 2 },
  { id: 'upcoming', visible: true, order: 3 },
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

  // New Features States
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [dashboardConfig, setDashboardConfig] = useState<
    DashboardWidgetConfig[]
  >(INITIAL_WIDGET_CONFIG)

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
      companyId: currentUser.companyId || 'master',
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
      role: 'admin' as const,
      companyId: newCompanyId,
    }

    setCompanies((prev) => [...prev, newCompany])
    setUsers((prev) => [...prev, newUser])

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
    if (currentUser.role === 'master' && !currentUser.companyId) return []

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

  // Budget Notification Logic
  const checkBudgetExceeded = (
    categoryId: string,
    newAmount: number,
    companyId: string,
  ) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    const currentMonthExpenses = transactions
      .filter(
        (t) =>
          t.companyId === companyId &&
          t.categoryId === categoryId &&
          isSameMonth(parseISO(t.dueDate), new Date()),
      )
      .reduce((acc, t) => acc + t.amount, 0)

    const totalExpected = currentMonthExpenses + newAmount

    if (totalExpected > category.budget) {
      toast.warning(
        `Alerta de Orçamento: ${category.name} excedeu o limite de R$ ${category.budget}`,
        {
          description: `Gasto atual estimado: R$ ${totalExpected.toFixed(2)}`,
          duration: 5000,
        },
      )
    }
  }

  // Actions
  const addTransaction = (data: TransactionFormValues) => {
    if (!currentUser?.companyId || !checkPermission('edit')) return

    checkBudgetExceeded(data.categoryId, data.amount, currentUser.companyId)

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

    // Advanced Notification: Notify if Editor created it (Mock)
    if (currentUser.role === 'editor') {
      setTimeout(() => {
        toast.info(`Admin notificado sobre nova transação de ${data.name}`)
      }, 1000)
    }
  }

  const updateTransaction = (id: string, data: TransactionFormValues) => {
    if (!checkPermission('edit')) return

    // Check budget diff if category changed or amount increased
    const existing = transactions.find((t) => t.id === id)
    if (existing && currentUser?.companyId) {
      const diff = data.amount - existing.amount
      if (diff > 0 || existing.categoryId !== data.categoryId) {
        checkBudgetExceeded(data.categoryId, data.amount, currentUser.companyId)
      }
    }

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

  // Integrations
  const connectIntegration = (
    provider: Integration['provider'],
    name: string,
  ) => {
    if (!currentUser?.companyId || !checkPermission('admin')) return
    const newIntegration: Integration = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      provider,
      status: 'connected',
      companyId: currentUser.companyId,
      lastSync: new Date().toISOString(),
    }
    setIntegrations((prev) => [...prev, newIntegration])
    logAction('create', 'Integration', `Connected to ${name}`)
    toast.success(`Conectado ao ${name} com sucesso!`)
  }

  const disconnectIntegration = (id: string) => {
    if (!checkPermission('admin')) return
    const integration = integrations.find((i) => i.id === id)
    setIntegrations((prev) => prev.filter((i) => i.id !== id))
    logAction('delete', 'Integration', `Disconnected from ${integration?.name}`)
    toast.success('Integração removida')
  }

  const syncIntegration = (id: string) => {
    if (!checkPermission('edit')) return

    // Simulate Sync process
    setTimeout(() => {
      const integration = integrations.find((i) => i.id === id)
      if (
        integration &&
        currentUser?.companyId &&
        categories.length > 0 &&
        accounts.length > 0
      ) {
        // Add a mock transaction
        const mockTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          name: `Compra Importada (${integration.name})`,
          amount: Math.floor(Math.random() * 200) + 50,
          date: new Date().toISOString(),
          dueDate: new Date().toISOString(),
          categoryId: categories[0].id, // First category
          accountId: accounts[0].id, // First account
          status: 'paid',
          companyId: currentUser.companyId,
          paymentDate: new Date().toISOString(),
        }
        setTransactions((prev) => [...prev, mockTx])
        setIntegrations((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, lastSync: new Date().toISOString() } : i,
          ),
        )
        logAction('sync', 'Integration', `Synced data from ${integration.name}`)
        toast.success('Sincronização concluída! Novas transações importadas.')
      }
    }, 1500)
  }

  // Dashboard Config
  const updateDashboardConfig = (config: DashboardWidgetConfig[]) => {
    setDashboardConfig(config)
    toast.success('Layout do dashboard salvo')
  }

  // Activity Log Export
  const exportActivityLogs = () => {
    if (!currentUser) return
    const headers = [
      'Timestamp',
      'User',
      'Action',
      'Entity',
      'Details',
      'CompanyID',
    ]

    const logsToExport =
      currentUser.role === 'master'
        ? activityLogs
        : activityLogs.filter((l) => l.companyId === currentUser.companyId)

    const csvContent = [
      headers.join(','),
      ...logsToExport.map((log) =>
        [
          `"${log.timestamp}"`,
          `"${log.userName}"`,
          `"${log.action}"`,
          `"${log.entity}"`,
          `"${log.details}"`,
          `"${log.companyId}"`,
        ].join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `activity_logs_${new Date().toISOString()}.csv`,
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    logAction('export', 'Report', 'Exported activity logs')
    toast.success('Download do log iniciado')
  }

  const resetUserPassword = (userId: string): string | null => {
    if (!checkPermission('admin')) return null
    const user = users.find((u) => u.id === userId)
    if (!user) return null

    // Simulate password generation
    const tempPassword = Math.random().toString(36).slice(-8).toUpperCase()
    logAction(
      'password_reset',
      'User',
      `Manual password reset for ${user.email}`,
    )
    return tempPassword
  }

  const sendPasswordResetLink = (email: string) => {
    if (!checkPermission('admin')) return
    logAction('password_reset', 'User', `Sent password reset link to ${email}`)
    // Simulate email dispatch
    setTimeout(() => {
      toast.success(`Link de recuperação enviado para ${email}`)
    }, 500)
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
        integrations: integrations.filter(
          (i) => i.companyId === currentUser?.companyId,
        ),
        dashboardConfig,
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
        connectIntegration,
        disconnectIntegration,
        syncIntegration,
        updateDashboardConfig,
        exportActivityLogs,
        getFilteredTransactions,
        getFilteredIncomes,
        login,
        register,
        logout,
        checkPermission,
        resetUserPassword,
        sendPasswordResetLink,
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
