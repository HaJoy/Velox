import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { useRegister } from "@/hooks/useRegister";

interface RegisterFormProps {
  onClose: () => void;
}

export const RegisterForm = ({ onClose }: RegisterFormProps) => {
  const { register, isLoading, error } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleRegister = async (data: RegisterFormValues) => {
    const result = await register(data.email, data.password);
    if (result?.success) {
      console.log(result.data);
      onClose();
    }
  };

  return (
    <>
      <form id="register-form" onSubmit={form.handleSubmit(handleRegister)}>
        <FieldSet className="w-full flex flex-col items-center">
          <FieldGroup>
            {/* Input email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
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
                    La contraseña debe tener al menos 6 caracteres.
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
              form="register-form"
              type="submit"
              disabled={isLoading}
              className="cursor-pointer disabled:cursor-default"
            >
              Registrarse
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
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};
