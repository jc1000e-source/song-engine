"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext<{
  open: boolean
  setOpen: (v: boolean) => void
} | null>(null)

export const AlertDialog: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
}

export const AlertDialogTrigger: React.FC<React.PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild }) => {
  const ctx = React.useContext(DialogContext)
  if (!ctx) return <>{children}</>

  const child = React.Children.only(children) as React.ReactElement & { props?: any }
  const originalOnClick = child.props?.onClick
  const props = {
    onClick: (e: any) => {
      if (typeof originalOnClick === 'function') originalOnClick(e)
      ctx.setOpen(true)
    },
  }

  if (asChild) return React.cloneElement(child, props)
  return <button onClick={() => ctx.setOpen(true)}>{children}</button>
}

export const AlertDialogContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const ctx = React.useContext(DialogContext)
  if (!ctx || !ctx.open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => ctx.setOpen(false)} />
      <div className={cn("z-10 w-[95vw] max-w-md rounded-md bg-background p-4 shadow-lg")}>
        {children}
      </div>
    </div>
  )
}

export const AlertDialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5", className)} {...props}>
    {children}
  </div>
)

export const AlertDialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn("flex items-center justify-end space-x-2", className)} {...props}>
    {children}
  </div>
)

export const AlertDialogTitle: React.FC<React.ComponentPropsWithoutRef<'h3'>> = ({ children, className, ...props }) => (
  <h3 className={cn("text-lg font-semibold", className)} {...props}>
    {children}
  </h3>
)

export const AlertDialogDescription: React.FC<React.ComponentPropsWithoutRef<'p'>> = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
)

export const AlertDialogCancel: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  const ctx = React.useContext(DialogContext)
  return (
    <button
      {...props}
      onClick={(e) => {
        props.onClick?.(e)
        ctx?.setOpen(false)
      }}
    >
      {children}
    </button>
  )
}

export const AlertDialogAction: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, onClick, ...props }) => {
  const ctx = React.useContext(DialogContext)
  return (
    <button
      {...props}
      onClick={async (e) => {
        await onClick?.(e as any)
        ctx?.setOpen(false)
      }}
    >
      {children}
    </button>
  )
}

