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
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Trash2,
  Mail,
  MoreVertical,
  KeyRound,
  Send,
  Search,
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { InviteFormValues } from '@/lib/types'
import { toast } from 'sonner'
import { Navigate } from 'react-router-dom'
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

export default function UsersInvites() {
  const {
    currentUser,
    users,
    companies,
    invitations,
    sendInvitation,
    deleteInvitation,
    checkPermission,
    resetUserPassword,
    sendPasswordResetLink,
    updateUserStatus,
  } = useFinance()
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteData, setInviteData] = useState<Partial<InviteFormValues>>({
    role: 'viewer',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [passwordResetResult, setPasswordResetResult] = useState<string | null>(
    null,
  )
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  if (!checkPermission('admin')) {
    return <Navigate to="/" replace />
  }

  const isMaster = currentUser?.role === 'master'

  // Filter Logic
  const visibleUsers = isMaster
    ? users
    : users.filter((u) => u.companyId === currentUser?.companyId)

  const filteredUsers = visibleUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCompany =
      selectedCompany === 'all' || u.companyId === selectedCompany

    return matchesSearch && matchesCompany
  })

  // Invitations Logic (Admin only sees own company invites, Master sees none currently as they are tied to companyId)
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

  const handleManualReset = (userId: string) => {
    const tempPass = resetUserPassword(userId)
    setPasswordResetResult(tempPass)
    setResetDialogOpen(true)
  }

  const handleSendResetLink = (email: string) => {
    sendPasswordResetLink(email)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'master':
        return <Badge className="bg-amber-600">Master</Badge>
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1"
          >
            <ShieldCheck className="h-3 w-3" /> Ativo
          </Badge>
        )
      case 'locked':
        return (
          <Badge variant="destructive" className="gap-1">
            <Lock className="h-3 w-3" /> Bloqueado
          </Badge>
        )
      case 'pending':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 gap-1"
          >
            <AlertTriangle className="h-3 w-3" /> Pendente
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCompanyName = (id?: string) => {
    if (!id) return 'Sistema Global'
    return companies.find((c) => c.id === id)?.name || 'Empresa Desconhecida'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestão de Usuários
          </h2>
          <p className="text-muted-foreground">
            Gerencie acesso, senhas e convites da equipe.
          </p>
        </div>
        {!isMaster && (
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
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Painel de Usuários</CardTitle>
            <CardDescription>
              Lista completa de usuários com status e controles de segurança.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              {isMaster && (
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por Empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Empresas</SelectItem>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  {isMaster && <TableHead>Empresa</TableHead>}
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isMaster ? 6 : 5}
                      className="text-center h-24 text-muted-foreground"
                    >
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      {isMaster && (
                        <TableCell>{getCompanyName(user.companyId)}</TableCell>
                      )}
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(user.email)
                              }
                            >
                              Copiar Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {user.status === 'locked' ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Unlock className="mr-2 h-4 w-4" />{' '}
                                    Desbloquear
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Desbloquear Usuário?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      O usuário <b>{user.name}</b> poderá fazer
                                      login novamente.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        updateUserStatus(user.id, 'active')
                                      }
                                      className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                      Confirmar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Lock className="mr-2 h-4 w-4" /> Bloquear
                                    Acesso
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Bloquear Usuário?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      O usuário <b>{user.name}</b> será impedido
                                      de acessar o sistema até ser desbloqueado.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        updateUserStatus(user.id, 'locked')
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Bloquear
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            <DropdownMenuSeparator />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <KeyRound className="mr-2 h-4 w-4" /> Resetar
                                  Senha
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Resetar Senha Manualmente?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Isso gerará uma senha temporária para{' '}
                                    <b>{user.name}</b>. A senha atual será
                                    invalidada imediatamente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleManualReset(user.id)}
                                  >
                                    Gerar Senha
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Send className="mr-2 h-4 w-4" /> Reenviar
                                  Link
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Enviar Link de Recuperação?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Um email com instruções de recuperação será
                                    enviado para <b>{user.email}</b>.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleSendResetLink(user.email)
                                    }
                                  >
                                    Enviar Email
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {!isMaster && (
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
        )}
      </div>

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Senha Temporária Gerada</DialogTitle>
            <DialogDescription>
              Copie a senha abaixo e envie para o usuário de forma segura.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 pt-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Senha
              </Label>
              <Input
                id="link"
                value={passwordResetResult || ''}
                readOnly
                className="h-10 text-center font-mono text-lg tracking-wider"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(passwordResetResult || '')
                toast.success('Senha copiada!')
              }}
            >
              Copiar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
