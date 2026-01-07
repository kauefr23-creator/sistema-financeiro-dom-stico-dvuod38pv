import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useFinance } from '@/context/FinanceContext'
import { Settings2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { WidgetId } from '@/lib/types'
import { cn } from '@/lib/utils'

export function DashboardCustomizer() {
  const { dashboardConfig, updateDashboardConfig } = useFinance()

  const getWidgetName = (id: WidgetId) => {
    switch (id) {
      case 'summary':
        return 'Resumo de Saldo'
      case 'expenses':
        return 'Gráfico de Despesas'
      case 'upcoming':
        return 'Próximos Vencimentos'
      case 'trend':
        return 'Tendência Mensal'
      default:
        return id
    }
  }

  const handleToggleVisibility = (id: WidgetId, checked: boolean) => {
    const newConfig = dashboardConfig.map((w) =>
      w.id === id ? { ...w, visible: checked } : w,
    )
    updateDashboardConfig(newConfig)
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === dashboardConfig.length - 1) return

    const newConfig = [...dashboardConfig]
    const swapIndex = direction === 'up' ? index - 1 : index + 1

    // Swap order
    const temp = newConfig[index]
    newConfig[index] = newConfig[swapIndex]
    newConfig[swapIndex] = temp

    // Update order property
    newConfig.forEach((w, i) => {
      w.order = i
    })

    updateDashboardConfig(newConfig)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Personalizar
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Personalizar Dashboard</SheetTitle>
          <SheetDescription>
            Organize e escolha quais widgets exibir no seu painel.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {dashboardConfig.map((widget, index) => (
            <div
              key={widget.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-card"
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() =>
                    handleToggleVisibility(widget.id, !widget.visible)
                  }
                >
                  {widget.visible ? (
                    <Eye className="h-4 w-4 text-primary" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <span
                  className={cn(
                    'text-sm font-medium',
                    !widget.visible && 'text-muted-foreground line-through',
                  )}
                >
                  {getWidgetName(widget.id)}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={index === dashboardConfig.length - 1}
                  onClick={() => handleMove(index, 'down')}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
