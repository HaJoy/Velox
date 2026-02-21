import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
        </CardHeader>

        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(handleLogin)}>
            <FieldSet className="w-full max-w-xs">
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
                        Por favor introduce tu correo electronico.
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
                  className="cursor-pointer disabled:cursor-default"
                >
                  Iniciar sesión
                </Button>
                <ButtonGroupSeparator />
                <Button
                  size="icon"
                  type="button"
                  onClick={() => form.reset()}
                  className="cursor-pointer disabled:cursor-default"
                >
                  <RotateCcwIcon />
                </Button>
              </ButtonGroup>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
