import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { toastError } from "@/lib/toast-utils";

interface LoginFormProps {
  onClose: () => void;
}

export const LoginForm = ({ onClose }: LoginFormProps) => {
  const { login, isLoading, error } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (data: LoginFormValues) => {
    const result = await login(data.email, data.password);

    if (!result?.success) {
      toastError({
        title: (result?.error as string) ??
          "Error al iniciar sesión. Por favor, inténtelo nuevamente.",
        toasterId: "toaster-auth",
      });
      return;
    }

    onClose();
  };

  return (
    <>
      <form
        id="login-form"
        className="flex flex-col justify-center"
        onSubmit={form.handleSubmit(handleLogin)}
      >
        <FieldSet className="w-full flex flex-col items-center">
          <FieldGroup>
            {/* Input email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Por favor introduce tu correo electrónico.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Input password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Por favor introduce tu contraseña.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <ButtonGroup>
            <Button
              form="login-form"
              type="submit"
              disabled={isLoading}
              className="cursor-pointer disabled:cursor-default"
            >
              Iniciar sesión
            </Button>
            <ButtonGroupSeparator />
            <Button
              size="icon"
              type="button"
              onClick={() => form.reset()}
              disabled={isLoading}
              className="cursor-pointer disabled:cursor-default"
            >
              <RotateCcwIcon />
            </Button>
          </ButtonGroup>
        </FieldSet>
      </form>
    </>
  );
};
