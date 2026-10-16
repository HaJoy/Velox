import { toast } from "sonner";

interface ToastProps {
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
}: ToastProps) => {
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


interface ToastNotificationProps {
  loadingMsg: string;
  successMsg: string;
  errorMsg: string;
  toasterId: string;
}

/**
 * Muestra un toast de carga para llamadas asincronas. El toast tiene
 * tres estados: cargando, exito y error.
 * @param asyncFunction Funcion asincrona a utilizar, DEBE lanzar error
 * para que sea detectado por el estado de error del toast.
 * @param {ToastNotificationProps} param1 Objeto con los tres mensajes a
 * mostrar segun el estado (`loadingMsg`, `successMsg` y `errorMsg`) y la
 * ID del toaster que mostrara el mensaje.
 * @property {string} loadingMsg Mensaje a mostrar mientras se espera la
 * respuesta de la funcion asincrona.
 * @property {string} successMsg Mensaje a mostrar si la llamada tiene exito.
 * @property {string} errorMsg Mensaje a mostrar si ocurre un error en la llamada.
 * @property {string} toasterId La ID del toaster que mostrara el mensaje.
 * @returns {unknown} Retorna el resultado de la funcion asincrona para su uso posterior.
 * @example
 * ```TS
 * const response = toastNotification(
 *  myAsyncFunction,
 *    {
 *      loadingMsg: "Cargando...",
 *      successMsg: "Operacion exitosa.",
 *      errorMsg: "Ocurrio un error.",
 *      toasterId: "myToaster",
 *    }
 * );
 * 
 * // response ahora tiene el resultado de myAsyncFunction
 * // por lo que se puede usar para el flujo posterior.
 * ```
 */
export const toastNotification = <T>(
  asyncFunction: Promise<T> | (() => Promise<T>),
  { loadingMsg, successMsg, errorMsg, toasterId }: ToastNotificationProps,
): Promise<T> => {
  const p = typeof asyncFunction === "function" ? asyncFunction() : asyncFunction;
  toast.promise(p, {
    loading: loadingMsg,
    success: successMsg,
    error: errorMsg,
    toasterId,
    position: "bottom-right",
    // Estilos por defecto
    style: {
      backgroundColor: "#0b0b0f",
      color: "white",
    },
    // Estilos por estado (usa clases de Tailwind, el ! es necesario).
    classNames: {
      error: "!border-red-500",
      success: "!border-green-500",
    }
  });

  return p;
};
