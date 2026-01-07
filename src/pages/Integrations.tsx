import { useState } from 'react'
import { useFinance } from '@/context/FinanceContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Landmark, RefreshCw, Plus, Check, Loader2, Unplug } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function Integrations() {
  const {
    integrations,
    connectIntegration,
    disconnectIntegration,
    syncIntegration,
    checkPermission,
  } = useFinance()
  const [isConnectOpen, setIsConnectOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<
    'bank' | 'stripe' | 'paypal'
  >('bank')
  const [loadingSync, setLoadingSync] = useState<string | null>(null)

  const canEdit = checkPermission('admin')
  const canSync = checkPermission('edit')

  const handleConnect = () => {
    const names = { bank: 'Conta Bancária', stripe: 'Stripe', paypal: 'PayPal' }
    connectIntegration(selectedProvider, names[selectedProvider])
    setIsConnectOpen(false)
  }

  const handleSync = (id: string) => {
    setLoadingSync(id)
    syncIntegration(id)
    // Mock loading delay to match context delay
    setTimeout(() => setLoadingSync(null), 1600)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Integrações Financeiras
          </h2>
          <p className="text-muted-foreground">
            Conecte suas contas externas para importar transações
            automaticamente.
          </p>
        </div>
        {canEdit && (
          <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Conexão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Conectar Instituição</DialogTitle>
                <DialogDescription>
                  Selecione o provedor financeiro que deseja conectar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="provider">Provedor</Label>
                  <Select
                    value={selectedProvider}
                    onValueChange={(v: any) => setSelectedProvider(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Banco Tradicional</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleConnect}>Conectar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.length === 0 ? (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Landmark className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium">Nenhuma integração ativa</h3>
              <p>Conecte seu banco ou carteira digital para começar.</p>
            </CardContent>
          </Card>
        ) : (
          integrations.map((integration) => (
            <Card key={integration.id} className="shadow-subtle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {integration.name}
                </CardTitle>
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-600 border-emerald-200"
                  >
                    <Check className="w-3 h-3 mr-1" /> Conectado
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Última sincronização: <br />
                  <span className="font-medium text-foreground">
                    {integration.lastSync
                      ? format(
                          parseISO(integration.lastSync),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR },
                        )
                      : 'Nunca'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                {canSync && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(integration.id)}
                    disabled={loadingSync === integration.id}
                  >
                    {loadingSync === integration.id ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-3 w-3" />
                    )}
                    Sincronizar
                  </Button>
                )}
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => disconnectIntegration(integration.id)}
                  >
                    <Unplug className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
