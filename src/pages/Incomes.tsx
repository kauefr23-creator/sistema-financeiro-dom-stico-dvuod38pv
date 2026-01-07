import { useState } from 'react'
import { useFinance } from '@/context/FinanceContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { IncomeForm } from '@/components/incomes/IncomeForm'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Income } from '@/lib/types'

export default function Incomes() {
  const { getFilteredIncomes, deleteIncome, checkPermission } = useFinance()
  const incomes = getFilteredIncomes()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)

  const canEdit = checkPermission('edit')

  const handleEdit = (income: Income) => {
    if (!canEdit) return
    setEditingIncome(income)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingIncome(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Receitas</h2>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingIncome(null)}>
                <Plus className="mr-2 h-4 w-4" /> Nova Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <IncomeForm
                onSuccess={handleCloseDialog}
                initialData={editingIncome || undefined}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fonte</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Mês de Referência</TableHead>
                <TableHead>Valor</TableHead>
                {canEdit && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={canEdit ? 5 : 4}
                    className="text-center h-24"
                  >
                    Nenhuma receita encontrada para este período.
                  </TableCell>
                </TableRow>
              ) : (
                incomes.map((income) => (
                  <TableRow
                    key={income.id}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {income.source}
                    </TableCell>
                    <TableCell>{income.description || '-'}</TableCell>
                    <TableCell>
                      {format(parseISO(income.date), 'MMMM yyyy', {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600">
                      {income.amount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(income)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Tem certeza?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteIncome(income.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
