import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Settings2,
  Wallet,
  LogOut,
  ShieldAlert,
  Users,
  History,
  Link as LinkIcon,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useFinance } from '@/context/FinanceContext'
import { Button } from '@/components/ui/button'

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    roles: ['admin', 'editor', 'viewer', 'master'],
  },
  {
    title: 'Transações',
    url: '/transactions',
    icon: Receipt,
    roles: ['admin', 'editor', 'viewer', 'master'],
  },
  {
    title: 'Receitas',
    url: '/incomes',
    icon: PiggyBank,
    roles: ['admin', 'editor', 'viewer', 'master'],
  },
  {
    title: 'Categorias & Contas',
    url: '/categories-accounts',
    icon: Settings2,
    roles: ['admin', 'editor', 'viewer', 'master'],
  },
  {
    title: 'Integrações',
    url: '/integrations',
    icon: LinkIcon,
    roles: ['admin', 'editor', 'master'],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { currentUser, logout, checkPermission } = useFinance()

  const canManageUsers = checkPermission('admin')

  const filteredItems = items.filter(
    (item) => currentUser?.role && item.roles.includes(currentUser.role),
  )

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex h-12 items-center px-4 font-bold text-xl text-primary">
          <Wallet className="mr-2 h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden">
            Sistema Financeiro
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {currentUser?.role === 'master' && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/master'}
                    tooltip="Master Dashboard"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                  >
                    <Link to="/master">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Master Overview</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {canManageUsers && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/users'}
                    tooltip="Usuários"
                  >
                    <Link to="/users">
                      <Users className="h-4 w-4" />
                      <span>Usuários</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/logs'}
                  tooltip="Logs de Atividade"
                >
                  <Link to="/logs">
                    <History className="h-4 w-4" />
                    <span>Logs de Atividade</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 group-data-[collapsible=icon]:hidden flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold text-foreground truncate">
              {currentUser?.name}
            </p>
            <p className="truncate">{currentUser?.email}</p>
            <p className="text-[10px] uppercase font-bold mt-1 text-primary/70">
              {currentUser?.role}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs h-8"
            onClick={logout}
          >
            <LogOut className="mr-2 h-3 w-3" />
            Sair
          </Button>
        </div>
        <div className="p-2 group-data-[collapsible=icon]:flex hidden justify-center">
          <Button variant="ghost" size="icon" onClick={logout} title="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
