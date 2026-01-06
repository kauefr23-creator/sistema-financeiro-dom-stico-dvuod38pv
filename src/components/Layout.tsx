import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Plus } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useFinance } from '@/context/FinanceContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { IncomeForm } from '@/components/incomes/IncomeForm'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ShareAccess } from '@/components/ShareAccess'

export default function Layout() {
  const { currentDate, setCurrentDate } = useFinance()
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [isIncomeOpen, setIsIncomeOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
        <AppSidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold md:text-xl hidden md:block">
                Gestão Financeira
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <ShareAccess />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[180px] md:w-[200px] justify-start text-left font-normal hidden sm:flex',
                      !currentDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentDate ? (
                      format(currentDate, 'MMMM yyyy', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={(date) => date && setCurrentDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" className="rounded-full">
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">Adicionar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsTransactionOpen(true)}>
                    Nova Transação
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsIncomeOpen(true)}>
                    Nova Receita
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <TransactionForm onSuccess={() => setIsTransactionOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isIncomeOpen} onOpenChange={setIsIncomeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <IncomeForm onSuccess={() => setIsIncomeOpen(false)} />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
