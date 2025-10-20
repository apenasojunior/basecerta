"use client"

import { Toaster as Sonner } from "sonner"

export function SonnerToaster() {
  return (
    <Sonner
      theme="light"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "group-[.toast]:bg-destructive group-[.toast]:text-destructive-foreground group-[.toast]:border-destructive",
          success: "group-[.toast]:bg-green-500 group-[.toast]:text-white group-[.toast]:border-green-500",
          warning: "group-[.toast]:bg-yellow-500 group-[.toast]:text-white group-[.toast]:border-yellow-500",
          info: "group-[.toast]:bg-blue-500 group-[.toast]:text-white group-[.toast]:border-blue-500",
        },
      }}
      richColors
      closeButton
      expand={false}
      duration={4000}
    />
  )
}
