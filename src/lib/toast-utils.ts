import { toast } from "sonner";

interface toastProps {
  title: string;
  description?: string;
  toasterId?: string;
}

/**
 * Muestra un toast de error.
 * @function toastError
 * @param {toastProps} params Objeto con `title`, `description` y `toasterId`.
 * @property {string} title El titulo del toast.
 * @property {string} [description] La descripcion del toast.
 * @property {string} [toasterId] La **id** del Toaster que mostrará el mensaje.
 * @returns {void} No devuelve nada, notifica al Toaster que el mensaje es de error.
 * @example
 * ```TS
 * toastError({
 *  title: "Ocurrió un error.",
 *  description: "Inténtelo de nuevo más tarde",
 *  toasterId: "toaster-example"
 * })
 * ```
 */
export const toastError = ({
  title = "Ocurrió un error.",
  description,
  toasterId,
}: toastProps) => {
  toast.error(title, {
    description,
    toasterId,
    position: "top-center",
    style: {
      backgroundColor: "#dc2626",
      color: "#fff",
      borderColor: "#dc2626",
    },
  });
};
