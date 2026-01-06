import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFinance } from '@/context/FinanceContext'
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SummaryCards() {
  const { getFilteredTransactions, getFilteredIncomes } = useFinance()

  const transactions = getFilteredTransactions()
  const incomes = getFilteredIncomes()

  const totalExpenses = transactions.reduce((acc, t) => acc + t.amount, 0)
  const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0)
  const netBalance = totalIncome - totalExpenses

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="shadow-subtle">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'text-2xl font-bold',
              netBalance >= 0 ? 'text-emerald-600' : 'text-red-600',
            )}
          >
            {netBalance.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
          <p className="text-xs text-muted-foreground">Mês selecionado</p>
        </CardContent>
      </Card>
      <Card className="shadow-subtle">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas Totais</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {totalIncome.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {incomes.length} registros
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-subtle">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {totalExpenses.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {transactions.length} registros
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
