import z from "zod";

export const loginSchema = z.object({
    email: z.email("Correo inválido."),
    password: z.string().min(1, "La contraseña es requerida."),
});

export const registerSchema = z.object({
    email: z.email("Correo inválido."),
    password: z.string().min(6, "La contraseña debe tener como mínimo 6 carácteres."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
