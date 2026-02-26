import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"

interface AuthDialogProps {
  mode: 'login' | 'register' | null;
  onClose: () => void;
}

export const AuthDialog = ({ mode, onClose }: AuthDialogProps) => {
  const isOpen = mode !== null;

  const title = mode === 'login' ? 'Iniciar Sesión' : 'Registrarse';
  const description = mode === 'login'
    ? 'Ingresa tus credenciales para acceder a tu cuenta.'
    : 'Crea una nueva cuenta para empezar.';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {mode === 'login' && <LoginForm />}
          {mode === 'register' && <RegisterForm />}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
