import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { CheckCircle, WarningCircle } from '@phosphor-icons/react'

interface Toast {
  id: number
  message: string
  tone: 'success' | 'error'
}

const ToastContext = createContext<(message: string, tone?: 'success' | 'error') => void>(() => {})

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    setToasts((list) => [...list, { id: Date.now() + Math.random(), message, tone }])
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-20 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0 md:items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={() => setToasts((list) => list.filter((t) => t.id !== toast.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3200)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      role="status"
      className="pointer-events-auto flex animate-toast-in items-center gap-2.5 rounded-md bg-shell px-4 py-2.5 text-[13px] font-medium text-white shadow-pop"
    >
      {toast.tone === 'success' ? (
        <CheckCircle size={16} weight="fill" className="text-brand-300" />
      ) : (
        <WarningCircle size={16} weight="fill" className="text-critical-200" />
      )}
      {toast.message}
    </div>
  )
}
