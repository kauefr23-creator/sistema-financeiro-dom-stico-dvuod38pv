import { Pie, PieChart, LabelList, Cell } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { useFinance } from '@/context/FinanceContext'
import { useMemo } from 'react'

export function ExpensesPieChart() {
  const { getFilteredTransactions, categories } = useFinance()
  const transactions = getFilteredTransactions()

  const chartData = useMemo(() => {
    const data: Record<string, number> = {}

    transactions.forEach((t) => {
      const category = categories.find((c) => c.id === t.categoryId)
      const categoryName = category ? category.name : 'Outros'
      data[categoryName] = (data[categoryName] || 0) + t.amount
    })

    return Object.entries(data).map(([name, value], index) => {
      const category = categories.find((c) => c.name === name)
      // Cycle through chart colors if category doesn't have one or use default
      const fill = category?.color || `hsl(var(--chart-${(index % 5) + 1}))`
      return {
        category: name,
        amount: value,
        fill,
      }
    })
  }, [transactions, categories])

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      amount: {
        label: 'Valor',
      },
    }
    categories.forEach((c) => {
      config[c.name] = {
        label: c.name,
        color: c.color,
      }
    })
    return config
  }, [categories])

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col shadow-subtle h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Gastos por Categoria</CardTitle>
          <CardDescription>Sem dados para o período</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center pb-0">
          <div className="text-muted-foreground text-sm">
            Nenhuma despesa registrada.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col shadow-subtle">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gastos por Categoria</CardTitle>
        <CardDescription>Distribuição de despesas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="category" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
