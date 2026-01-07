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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Mail } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { InviteFormValues } from '@/lib/types'
import { toast } from 'sonner'
import { Navigate } from 'react-router-dom'

export default function UsersInvites() {
  const {
    currentUser,
    users,
    invitations,
    sendInvitation,
    deleteInvitation,
    checkPermission,
  } = useFinance()
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteData, setInviteData] = useState<Partial<InviteFormValues>>({
    role: 'viewer',
  })

  if (!checkPermission('admin')) {
    return <Navigate to="/" replace />
  }

  const companyUsers = users.filter(
    (u) => u.companyId === currentUser?.companyId,
  )
  const companyInvitations = invitations.filter(
    (i) => i.companyId === currentUser?.companyId,
  )

  const handleSendInvite = () => {
    if (!inviteData.email || !inviteData.role) {
      toast.error('Preencha todos os campos')
      return
    }
    sendInvitation(inviteData as InviteFormValues)
    setInviteData({ role: 'viewer', email: '' })
    setIsInviteOpen(false)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-600">Admin</Badge>
      case 'editor':
        return <Badge className="bg-blue-600">Editor</Badge>
      case 'viewer':
        return <Badge className="bg-slate-500">Viewer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Usuários e Permissões
          </h2>
          <p className="text-muted-foreground">
            Gerencie os membros da sua equipe e seus níveis de acesso.
          </p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Convidar Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar novo membro</DialogTitle>
              <DialogDescription>
                Envie um convite por e-mail para adicionar um usuário à sua
                empresa.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="usuario@empresa.com"
                  value={inviteData.email || ''}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Nível de Acesso</Label>
                <Select
                  value={inviteData.role}
                  onValueChange={(v: any) =>
                    setInviteData({ ...inviteData, role: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Admin:</strong> Controle total.{' '}
                  <strong>Editor:</strong> Cria/Edita dados.{' '}
                  <strong>Viewer:</strong> Apenas leitura.
                </p>
              </div>
              <Button onClick={handleSendInvite} className="w-full">
                Enviar Convite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Membros Ativos</CardTitle>
            <CardDescription>
              Usuários que já aceitaram o convite.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Convites Pendentes</CardTitle>
            <CardDescription>Aguardando aceitação.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyInvitations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground h-24"
                    >
                      Nenhum convite pendente.
                    </TableCell>
                  </TableRow>
                ) : (
                  companyInvitations.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {invite.email}
                      </TableCell>
                      <TableCell>{getRoleBadge(invite.role)}</TableCell>
                      <TableCell>
                        {format(parseISO(invite.date), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteInvitation(invite.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
