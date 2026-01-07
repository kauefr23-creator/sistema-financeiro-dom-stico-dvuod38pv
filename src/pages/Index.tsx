import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { ExpensesPieChart } from '@/components/dashboard/ExpensesPieChart'
import { UpcomingTransactions } from '@/components/dashboard/UpcomingTransactions'
import { MonthlyTrendChart } from '@/components/dashboard/MonthlyTrendChart'
import { DashboardCustomizer } from '@/components/dashboard/DashboardCustomizer'
import { useFinance } from '@/context/FinanceContext'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { WidgetId } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function Index() {
  const {
    getFilteredTransactions,
    getFilteredIncomes,
    checkPermission,
    dashboardConfig,
  } = useFinance()
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)

  const hasData =
    getFilteredTransactions().length > 0 || getFilteredIncomes().length > 0
  const canEdit = checkPermission('edit')

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-full">
          <Plus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Comece a controlar suas finanças
        </h2>
        <p className="text-muted-foreground max-w-md">
          Não há transações ou receitas registradas para este mês.
          {canEdit &&
            ' Adicione sua primeira transação para ver o dashboard ganhar vida.'}
        </p>
        {canEdit && (
          <Button onClick={() => setIsNewTransactionOpen(true)}>
            Adicionar Primeira Transação
          </Button>
        )}

        <Dialog
          open={isNewTransactionOpen}
          onOpenChange={setIsNewTransactionOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <TransactionForm onSuccess={() => setIsNewTransactionOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Helper to render widget by ID
  const renderWidget = (id: WidgetId) => {
    switch (id) {
      case 'summary':
        return <SummaryCards />
      case 'expenses':
        return <ExpensesPieChart />
      case 'upcoming':
        return <UpcomingTransactions />
      case 'trend':
        return <MonthlyTrendChart />
      default:
        return null
    }
  }

  const sortedWidgets = [...dashboardConfig]
    .filter((w) => w.visible)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight hidden sm:block">
          Dashboard
        </h2>
        <div className="ml-auto">
          <DashboardCustomizer />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {sortedWidgets.map((widget) => {
          let colSpanClass = 'col-span-1'

          // Define span based on widget type and screen size
          if (widget.id === 'summary') {
            colSpanClass = 'md:col-span-2 lg:col-span-7'
          } else if (widget.id === 'trend') {
            colSpanClass = 'md:col-span-2 lg:col-span-4'
          } else if (widget.id === 'expenses') {
            colSpanClass = 'md:col-span-1 lg:col-span-3'
          } else if (widget.id === 'upcoming') {
            colSpanClass = 'md:col-span-1 lg:col-span-3'
          }

          return (
            <div key={widget.id} className={cn(colSpanClass, 'min-h-[300px]')}>
              {renderWidget(widget.id)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
