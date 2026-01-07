import { useState } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export default function MasterDashboard() {
  const { companies, transactions, incomes } = useFinance()
  const [filterCompany, setFilterCompany] = useState<string>('all')

  // Filter Data
  const filteredTransactions =
    filterCompany === 'all'
      ? transactions
      : transactions.filter((t) => t.companyId === filterCompany)
  const filteredIncomes =
    filterCompany === 'all'
      ? incomes
      : incomes.filter((i) => i.companyId === filterCompany)
  const filteredCompanies =
    filterCompany === 'all'
      ? companies
      : companies.filter((c) => c.id === filterCompany)

  // Calculations
  const totalIncome = filteredIncomes.reduce((acc, i) => acc + i.amount, 0)
  const totalExpenses = filteredTransactions.reduce(
    (acc, t) => acc + t.amount,
    0,
  )
  const netBalance = totalIncome - totalExpenses

  const getCompanyStats = (companyId: string) => {
    const companyIncomes = incomes.filter((i) => i.companyId === companyId)
    const companyTransactions = transactions.filter(
      (t) => t.companyId === companyId,
    )
    const incomeSum = companyIncomes.reduce((acc, i) => acc + i.amount, 0)
    const expenseSum = companyTransactions.reduce((acc, t) => acc + t.amount, 0)
    return {
      name: companies.find((c) => c.id === companyId)?.name || 'Unknown',
      income: incomeSum,
      expense: expenseSum,
      balance: incomeSum - expenseSum,
      transactionCount: companyTransactions.length,
    }
  }

  // Chart Data Preparation
  const chartData = filteredCompanies.map((c) => {
    const stats = getCompanyStats(c.id)
    return {
      name: stats.name,
      Receitas: stats.income,
      Despesas: stats.expense,
    }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Painel Master Consolidado
          </h2>
          <p className="text-muted-foreground">
            Visão geral e comparativa de todas as empresas.
          </p>
        </div>
        <Select value={filterCompany} onValueChange={setFilterCompany}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por Empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Empresas</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            <p className="text-xs text-muted-foreground">
              {filterCompany === 'all'
                ? 'Todas as empresas'
                : 'Empresa selecionada'}
            </p>
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
            <div className="text-2xl font-bold">{filteredCompanies.length}</div>
            <p className="text-xs text-muted-foreground">Exibidas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-subtle col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Comparativo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="Receitas"
                    fill="hsl(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Despesas"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Detalhamento por Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Receitas</TableHead>
                  <TableHead>Despesas</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => {
                  const stats = getCompanyStats(company.id)
                  return (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {company.name}
                      </TableCell>
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
    </div>
  )
}
