import { toast as sonnerToast, type ExternalToast } from "sonner"

type ToastType = "success" | "error" | "warning" | "info" | "loading"

interface ToastOptions extends ExternalToast {
  duration?: number
}

/**
 * Sistema de notificações toast usando Sonner
 * 
 * @example
 * // Toast de sucesso
 * toast.success("Operação realizada com sucesso!")
 * 
 * @example
 * // Toast de erro
 * toast.error("Erro ao processar requisição")
 * 
 * @example
 * // Toast com duração customizada
 * toast.info("Esta mensagem fica 10 segundos", { duration: 10000 })
 * 
 * @example
 * // Toast com ação
 * toast.success("Arquivo salvo", {
 *   action: {
 *     label: "Desfazer",
 *     onClick: () => console.log("Desfazer")
 *   }
 * })
 * 
 * @example
 * // Toast promise (loading → success/error)
 * toast.promise(
 *   fetchData(),
 *   {
 *     loading: "Carregando...",
 *     success: "Dados carregados!",
 *     error: "Erro ao carregar"
 *   }
 * )
 */

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      duration: 4000,
      ...options,
    })
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      duration: 5000,
      ...options,
    })
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      duration: 4500,
      ...options,
    })
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      duration: 4000,
      ...options,
    })
  },

  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, options)
  },

  promise: <T,>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return sonnerToast.promise(promise, messages)
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId)
  },

  // Atalhos comuns
  apiError: (error?: string) => {
    return toast.error(error || "Erro ao processar requisição. Tente novamente.", {
      duration: 5000,
    })
  },

  networkError: () => {
    return toast.error("Erro de conexão. Verifique sua internet.", {
      duration: 5000,
    })
  },

  unauthorized: () => {
    return toast.error("Sessão expirada. Faça login novamente.", {
      duration: 6000,
    })
  },

  saveSuccess: (item: string = "item") => {
    return toast.success(`${item} salvo com sucesso!`)
  },

  deleteSuccess: (item: string = "item") => {
    return toast.success(`${item} excluído com sucesso!`)
  },

  copySuccess: () => {
    return toast.success("Copiado para área de transferência!")
  },
}

export default toast
