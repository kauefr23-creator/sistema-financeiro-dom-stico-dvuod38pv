import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { ExpensesPieChart } from '@/components/dashboard/ExpensesPieChart'
import { UpcomingTransactions } from '@/components/dashboard/UpcomingTransactions'
import { useFinance } from '@/context/FinanceContext'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TransactionForm } from '@/components/transactions/TransactionForm'

const Index = () => {
  const { getFilteredTransactions, getFilteredIncomes } = useFinance()
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false)

  const hasData =
    getFilteredTransactions().length > 0 || getFilteredIncomes().length > 0

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
          Não há transações ou receitas registradas para este mês. Adicione sua
          primeira transação para ver o dashboard ganhar vida.
        </p>
        <Button onClick={() => setIsNewTransactionOpen(true)}>
          Adicionar Primeira Transação
        </Button>

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

  return (
    <div className="space-y-6 animate-fade-in">
      <SummaryCards />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-4">
          <ExpensesPieChart />
        </div>
        <div className="col-span-3 lg:col-span-3">
          <UpcomingTransactions />
        </div>
      </div>
    </div>
  )
}

export default Index
