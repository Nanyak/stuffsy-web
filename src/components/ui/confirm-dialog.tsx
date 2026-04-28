import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from './button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'destructive' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    // Focus cancel button on open for safety (default-safe action)
    cancelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="surface-card relative z-10 w-full max-w-sm rounded-2xl p-6 animate-in"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px var(--c-border-subtle)' }}>
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        {variant === 'destructive' && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{
            background: 'oklch(0.580 0.220 27 / 0.10)',
            border: '1px solid oklch(0.580 0.220 27 / 0.20)',
          }}>
            <AlertTriangle className="h-5 w-5" style={{ color: 'var(--destructive)' }} />
          </div>
        )}

        <h2 id="confirm-dialog-title" className="text-base font-bold text-foreground mb-1.5">
          {title}
        </h2>
        <p id="confirm-dialog-description" className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex gap-3 justify-end">
          <Button
            ref={cancelRef}
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            className="cursor-pointer"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
