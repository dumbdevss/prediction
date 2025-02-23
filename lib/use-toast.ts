"use client"

import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  cancel?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

export function useToast() {
  const toast = ({
    title,
    description,
    action,
    cancel,
    duration = 5000,
    ...props
  }: ToastProps) => {
    return sonnerToast(title || description, {
      description: title ? description : undefined,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
      cancel: cancel
        ? {
            label: cancel.label,
            onClick: cancel.onClick,
          }
        : undefined,
      ...props,
    })
  }

  return {
    toast,
    success: (message: string, options?: Partial<any>) =>
      sonnerToast.success(message, options),
    error: (message: string, options?: Partial<any>) =>
      sonnerToast.error(message, options),
    warning: (message: string, options?: Partial<any>) =>
      sonnerToast.warning(message, options),
    info: (message: string, options?: Partial<any>) =>
      sonnerToast.info(message, options),
    promise: sonnerToast.promise,
    dismiss: sonnerToast.dismiss,
    custom: sonnerToast.custom,
  }
}