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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useFinance } from '@/context/FinanceContext'
import { useMemo } from 'react'
import {
  format,
  subMonths,
  isSameMonth,
  parseISO,
  startOfMonth,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function MonthlyTrendChart() {
  const { transactions, incomes, currentUser } = useFinance()

  const chartData = useMemo(() => {
    // Generate last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i)
      return {
        date,
        name: format(date, 'MMM', { locale: ptBR }),
        fullDate: format(date, 'MMMM yyyy', { locale: ptBR }),
      }
    })

    return months.map((month) => {
      const monthTransactions = transactions.filter(
        (t) =>
          t.companyId === currentUser?.companyId &&
          isSameMonth(parseISO(t.date), month.date),
      )
      const monthIncomes = incomes.filter(
        (i) =>
          i.companyId === currentUser?.companyId &&
          isSameMonth(parseISO(i.date), month.date),
      )

      const expenseTotal = monthTransactions.reduce(
        (acc, t) => acc + t.amount,
        0,
      )
      const incomeTotal = monthIncomes.reduce((acc, i) => acc + i.amount, 0)

      return {
        name: month.name,
        Receitas: incomeTotal,
        Despesas: expenseTotal,
      }
    })
  }, [transactions, incomes, currentUser])

  const chartConfig = {
    Receitas: {
      label: 'Receitas',
      color: 'hsl(var(--chart-2))',
    },
    Despesas: {
      label: 'Despesas',
      color: 'hsl(var(--chart-1))',
    },
  }

  return (
    <Card className="flex flex-col shadow-subtle h-full">
      <CardHeader>
        <CardTitle>Tendência Mensal</CardTitle>
        <CardDescription>
          Receitas vs Despesas (Últimos 6 meses)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'transparent' }}
            />
            <Legend />
            <Bar
              dataKey="Receitas"
              fill="var(--color-Receitas)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Despesas"
              fill="var(--color-Despesas)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
