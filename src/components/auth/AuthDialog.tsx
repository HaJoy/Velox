import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"
import { Toaster } from "sonner";

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
          {mode === 'login' && <LoginForm onClose={onClose} />}
          {mode === 'register' && <RegisterForm onClose={onClose} />}
        </div>
        <Toaster id="toaster-auth" />
      </DialogContent>
    </Dialog>
  )
}
