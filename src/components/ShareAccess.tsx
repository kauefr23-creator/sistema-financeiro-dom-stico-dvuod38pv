import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Share2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function ShareAccess() {
  const [isOpen, setIsOpen] = useState(false)
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    // Generates a mock unique link for demonstration
    // In a real application, this would call an API to create a shared session
    const uniqueId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    const url = `${window.location.origin}?share_id=${uniqueId}`
    setLink(url)
    setCopied(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success('Link copiado para a área de transferência')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open && !link) generateLink()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Acesso</DialogTitle>
          <DialogDescription>
            Qualquer pessoa com este link terá acesso completo para visualizar e
            editar suas finanças.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={link} readOnly className="h-9" />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copiar</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
