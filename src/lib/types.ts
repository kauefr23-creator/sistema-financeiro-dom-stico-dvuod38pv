import { z } from 'zod'

export type TransactionStatus = 'paid' | 'pending'

export interface Category {
  id: string
  name: string
  budget: number
  color: string
}

export interface Account {
  id: string
  name: string
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
}

export type IncomeSource = 'Salário' | 'Bônus' | 'Extras' | 'Mês Anterior'

export interface Income {
  id: string
  source: IncomeSource
  description?: string
  amount: number
  date: string // ISO string
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
