import { useState } from 'react'
import { useFinance } from '@/context/FinanceContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ActivityLog } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function ActivityLogs() {
  const { activityLogs, currentUser, companies, exportActivityLogs } =
    useFinance()
  const [filterAction, setFilterAction] = useState<string>('all')
  const [filterEntity, setFilterEntity] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter logs based on role
  let visibleLogs = activityLogs
  if (currentUser?.role !== 'master') {
    visibleLogs = activityLogs.filter(
      (log) => log.companyId === currentUser?.companyId,
    )
  }

  const filteredLogs = visibleLogs.filter((log) => {
    const matchesAction = filterAction === 'all' || log.action === filterAction
    const matchesEntity = filterEntity === 'all' || log.entity === filterEntity
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesAction && matchesEntity && matchesSearch
  })

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 'update':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'delete':
        return 'bg-red-500 hover:bg-red-600'
      case 'invite':
        return 'bg-purple-500 hover:bg-purple-600'
      case 'sync':
        return 'bg-cyan-500 hover:bg-cyan-600'
      case 'export':
        return 'bg-gray-600 hover:bg-gray-700'
      default:
        return 'bg-gray-500'
    }
  }

  const getCompanyName = (id: string) => {
    if (id === 'master') return 'Sistema Global'
    return companies.find((c) => c.id === id)?.name || 'Empresa Desconhecida'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Registro de Atividades
          </h2>
          <p className="text-muted-foreground">
            Histórico completo de ações realizadas no sistema.
          </p>
        </div>
        <Button onClick={exportActivityLogs} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por usuário ou detalhes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:w-[300px]"
        />
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Ações</SelectItem>
            <SelectItem value="create">Criação</SelectItem>
            <SelectItem value="update">Edição</SelectItem>
            <SelectItem value="delete">Exclusão</SelectItem>
            <SelectItem value="invite">Convite</SelectItem>
            <SelectItem value="sync">Sincronização</SelectItem>
            <SelectItem value="export">Exportação</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterEntity} onValueChange={setFilterEntity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Recurso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Recursos</SelectItem>
            <SelectItem value="Transaction">Transação</SelectItem>
            <SelectItem value="Income">Receita</SelectItem>
            <SelectItem value="Category">Categoria</SelectItem>
            <SelectItem value="Account">Conta</SelectItem>
            <SelectItem value="User">Usuário</SelectItem>
            <SelectItem value="Invitation">Convite</SelectItem>
            <SelectItem value="Integration">Integração</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Detalhes</TableHead>
                {currentUser?.role === 'master' && (
                  <TableHead>Empresa</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={currentUser?.role === 'master' ? 6 : 5}
                    className="text-center h-24"
                  >
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {format(parseISO(log.timestamp), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.userName}
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(log.action)}>
                        {log.action.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.entity}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.details}
                    </TableCell>
                    {currentUser?.role === 'master' && (
                      <TableCell className="text-xs">
                        {getCompanyName(log.companyId)}
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
