import { z } from 'zod'

export type TransactionStatus = 'paid' | 'pending'
export type Role = 'master' | 'admin' | 'editor' | 'viewer'

export interface Company {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  companyId?: string
}

export interface Category {
  id: string
  name: string
  budget: number
  color: string
  companyId: string
}

export interface Account {
  id: string
  name: string
  companyId: string
}

export interface Transaction {
  id: string
  name: string
  amount: number
  date: string // ISO string
  dueDate: string // ISO string
  categoryId: string
  accountId: string
  status: TransactionStatus
  paymentDate?: string
  companyId: string
}

export type IncomeSource = 'Salário' | 'Bônus' | 'Extras' | 'Mês Anterior'

export interface Income {
  id: string
  source: IncomeSource
  description?: string
  amount: number
  date: string // ISO string
  companyId: string
}

export interface Invitation {
  id: string
  email: string
  role: Role
  companyId: string
  status: 'pending' | 'accepted'
  date: string
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action:
    | 'create'
    | 'update'
    | 'delete'
    | 'login'
    | 'invite'
    | 'sync'
    | 'export'
    | 'password_reset'
  entity:
    | 'Transaction'
    | 'Income'
    | 'Category'
    | 'Account'
    | 'User'
    | 'Invitation'
    | 'Integration'
    | 'Report'
  details: string
  timestamp: string
  companyId: string
}

export interface Integration {
  id: string
  name: string
  provider: 'bank' | 'stripe' | 'paypal'
  status: 'connected' | 'disconnected'
  lastSync?: string
  companyId: string
}

export type WidgetId = 'summary' | 'expenses' | 'upcoming' | 'trend'

export interface DashboardWidgetConfig {
  id: WidgetId
  visible: boolean
  order: number
}

export const transactionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  accountId: z.string().min(1, 'Conta é obrigatória'),
  dueDate: z.date({ required_error: 'Data de vencimento é obrigatória' }),
  status: z.enum(['paid', 'pending']),
  paymentDate: z.date().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>

export const incomeSchema = z.object({
  source: z.enum(['Salário', 'Bônus', 'Extras', 'Mês Anterior']),
  description: z.string().optional(),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  date: z.date({ required_error: 'Data é obrigatória' }),
})

export type IncomeFormValues = z.infer<typeof incomeSchema>

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  budget: z.coerce.number().min(0, 'Orçamento deve ser positivo'),
  color: z.string().min(1, 'Cor é obrigatória'),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  companyName: z
    .string()
    .min(2, 'Nome da empresa deve ter no mínimo 2 caracteres'),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export const inviteSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'editor', 'viewer'] as const),
})

export type InviteFormValues = z.infer<typeof inviteSchema>
