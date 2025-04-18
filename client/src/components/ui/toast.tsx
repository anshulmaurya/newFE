import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 right-4 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 md:max-w-[400px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-3 overflow-hidden rounded-lg border-0 p-4 pr-7 shadow-lg transition-all backdrop-blur-md border-l-[3px] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-slide-in-from-right data-[state=closed]:animate-slide-out-to-right",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/90 border-blue-500 text-white",
        success: "bg-zinc-900/90 border-green-500 text-white",
        warning: "bg-zinc-900/90 border-amber-500 text-white",
        info: "bg-zinc-900/90 border-blue-500 text-white",
        destructive: "bg-zinc-900/90 border-red-500 text-white",
        running: "bg-zinc-900/90 border-blue-500 text-white",
        submitting: "bg-zinc-900/90 border-blue-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  // For loading or running state
  if (variant === "running" || variant === "submitting") {
    return (
      <ToastPrimitives.Root
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          </div>
          <div className="flex-1">
            {props.children}
          </div>
        </div>
      </ToastPrimitives.Root>
    );
  }
  
  // For other states
  let StatusIcon = Info;
  let iconColor = "text-blue-500";
  
  if (variant === "success") {
    StatusIcon = CheckCircle;
    iconColor = "text-green-500";
  } else if (variant === "warning") {
    StatusIcon = AlertTriangle;
    iconColor = "text-amber-500";
  } else if (variant === "destructive") {
    StatusIcon = AlertCircle;
    iconColor = "text-red-500";
  } else if (variant === "info") {
    StatusIcon = Info;
    iconColor = "text-blue-500";
  }
  
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 flex items-center justify-center">
          <StatusIcon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="flex-1">
          {props.children}
        </div>
      </div>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-7 shrink-0 items-center justify-center rounded-md bg-transparent/10 px-2.5 text-xs font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1.5 top-1.5 rounded-md p-1 text-white/80 opacity-70 transition-opacity hover:text-white hover:bg-white/10 hover:opacity-100 focus:opacity-100 focus:outline-none group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold tracking-tight text-white", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-xs opacity-90 leading-relaxed text-white", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
