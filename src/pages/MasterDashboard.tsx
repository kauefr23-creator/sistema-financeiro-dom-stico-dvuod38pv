import { useFinance } from '@/context/FinanceContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MasterDashboard() {
  const { companies, transactions, incomes } = useFinance()

  // Calculations
  const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0)
  const totalExpenses = transactions.reduce((acc, t) => acc + t.amount, 0)
  const netBalance = totalIncome - totalExpenses

  const getCompanyStats = (companyId: string) => {
    const companyIncomes = incomes.filter((i) => i.companyId === companyId)
    const companyTransactions = transactions.filter(
      (t) => t.companyId === companyId,
    )
    const incomeSum = companyIncomes.reduce((acc, i) => acc + i.amount, 0)
    const expenseSum = companyTransactions.reduce((acc, t) => acc + t.amount, 0)
    return {
      income: incomeSum,
      expense: expenseSum,
      balance: incomeSum - expenseSum,
      transactionCount: companyTransactions.length,
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Painel Master Consolidado
          </h2>
          <p className="text-muted-foreground">
            Visão geral de todas as empresas registradas no sistema.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Global Líquido
            </CardTitle>
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
            <p className="text-xs text-muted-foreground">Todas as empresas</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Global
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {totalIncome.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
            <p className="text-xs text-muted-foreground">Acumulado total</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Despesa Global
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalExpenses.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
            <p className="text-xs text-muted-foreground">Acumulado total</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empresas Ativas
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">Registradas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Transações</TableHead>
                <TableHead>Receitas</TableHead>
                <TableHead>Despesas</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => {
                const stats = getCompanyStats(company.id)
                return (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {company.name}
                    </TableCell>
                    <TableCell>{stats.transactionCount}</TableCell>
                    <TableCell className="text-emerald-600">
                      {stats.income.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {stats.expense.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-bold',
                        stats.balance >= 0
                          ? 'text-emerald-600'
                          : 'text-red-600',
                      )}
                    >
                      {stats.balance.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
