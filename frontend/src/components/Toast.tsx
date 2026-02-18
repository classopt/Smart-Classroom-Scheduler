import { useState, createContext, useContext, type ReactNode } from 'react'

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    }

    setToasts(prev => [...prev, newToast])

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const variantClasses = {
    default: 'bg-background border-border text-foreground',
    destructive: 'bg-destructive text-destructive-foreground border-destructive',
    success: 'bg-green-500 text-white border-green-600',
    warning: 'bg-yellow-500 text-black border-yellow-600',
  }

  return (
    <div
      className={`
        relative max-w-sm rounded-lg border p-4 shadow-lg
        transform transition-all duration-300 ease-in-out
        animate-in slide-in-from-right-full
        ${variantClasses[toast.variant || 'default']}
      `}
    >
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {toast.title && (
        <div className="font-semibold mb-1">{toast.title}</div>
      )}
      
      {toast.description && (
        <div className="text-sm opacity-90">{toast.description}</div>
      )}
    </div>
  )
}

// Convenience functions
export const toast = {
  success: (title: string, description?: string) => {
    const { addToast } = useToast()
    addToast({ title, description, variant: 'success' })
  },
  error: (title: string, description?: string) => {
    const { addToast } = useToast()
    addToast({ title, description, variant: 'destructive' })
  },
  warning: (title: string, description?: string) => {
    const { addToast } = useToast()
    addToast({ title, description, variant: 'warning' })
  },
  info: (title: string, description?: string) => {
    const { addToast } = useToast()
    addToast({ title, description, variant: 'default' })
  }
}
