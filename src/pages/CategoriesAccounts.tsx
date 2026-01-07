import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFinance } from '@/context/FinanceContext'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isSameMonth, parseISO } from 'date-fns'

export default function CategoriesAccounts() {
  const {
    categories,
    accounts,
    transactions,
    currentDate,
    addCategory,
    deleteCategory,
    addAccount,
    deleteAccount,
    checkPermission,
  } = useFinance()

  const [newCategory, setNewCategory] = useState({
    name: '',
    budget: '',
    color: '#000000',
  })
  const [newAccount, setNewAccount] = useState('')
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)

  const canEdit = checkPermission('edit')

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budget) return
    addCategory({
      name: newCategory.name,
      budget: Number(newCategory.budget),
      color: newCategory.color,
    })
    setNewCategory({ name: '', budget: '', color: '#000000' })
    setIsCategoryDialogOpen(false)
  }

  const handleAddAccount = () => {
    if (!newAccount) return
    addAccount(newAccount)
    setNewAccount('')
    setIsAccountDialogOpen(false)
  }

  const getCategorySpending = (categoryId: string) => {
    return transactions
      .filter(
        (t) =>
          t.categoryId === categoryId &&
          isSameMonth(parseISO(t.dueDate), currentDate),
      )
      .reduce((acc, t) => acc + t.amount, 0)
  }

  const getAccountUsage = (accountId: string) => {
    return transactions.filter((t) => t.accountId === accountId).length
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight">
        Configurações e Gestão
      </h2>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="accounts">Contas</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Orçamento por Categoria</h3>
            {canEdit && (
              <Dialog
                open={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Categoria</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="budget">Orçamento Esperado</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newCategory.budget}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            budget: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="color">Cor</Label>
                      <Input
                        id="color"
                        type="color"
                        value={newCategory.color}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            color: e.target.value,
                          })
                        }
                        className="h-10 p-1 w-full"
                      />
                    </div>
                    <Button onClick={handleAddCategory}>Salvar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid gap-4">
            {categories.map((category) => {
              const spent = getCategorySpending(category.id)
              const percentage = Math.min((spent / category.budget) * 100, 100)

              return (
                <Card key={category.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </CardTitle>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-red-500"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Gasto: R$ {spent.toFixed(2)}
                      </span>
                      <span className="font-medium">
                        Meta: R$ {category.budget.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Contas Bancárias</h3>
            {canEdit && (
              <Dialog
                open={isAccountDialogOpen}
                onOpenChange={setIsAccountDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Nova Conta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Conta</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="accountName">Nome da Conta</Label>
                      <Input
                        id="accountName"
                        value={newAccount}
                        onChange={(e) => setNewAccount(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddAccount}>Salvar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {account.name}
                  </CardTitle>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-red-500"
                      onClick={() => deleteAccount(account.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {getAccountUsage(account.id)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Transações vinculadas
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
