import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFinance } from '@/context/FinanceContext'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function UpcomingTransactions() {
  const { transactions, toggleTransactionStatus, checkPermission } =
    useFinance()

  const canEdit = checkPermission('edit')

  // Filter pending transactions and sort by due date
  const upcoming = transactions
    .filter((t) => t.status === 'pending')
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, 5)

  if (upcoming.length === 0) {
    return (
      <Card className="shadow-subtle h-full">
        <CardHeader>
          <CardTitle>Próximos Vencimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-4 text-emerald-500/50" />
            <p>Tudo em dia! Nenhuma conta pendente.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-subtle">
      <CardHeader>
        <CardTitle>Próximos Vencimentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              {canEdit && <TableHead className="text-right">Ação</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcoming.map((transaction) => (
              <TableRow key={transaction.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    {transaction.name}
                  </div>
                </TableCell>
                <TableCell>
                  {format(parseISO(transaction.dueDate), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  {transaction.amount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                {canEdit && (
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      onClick={() => toggleTransactionStatus(transaction.id)}
                    >
                      Pagar
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
