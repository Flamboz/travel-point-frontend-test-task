import type { ReactNode } from 'react'
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary'
import styles from './ErrorBoundary.module.css'

type ErrorBoundaryProps = {
  children: ReactNode
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

type ErrorFallbackProps = Pick<
  ErrorBoundaryProps,
  'title' | 'message' | 'actionLabel' | 'onAction'
> &
  FallbackProps

function ErrorFallback({
  title,
  message,
  actionLabel,
  onAction,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  const handleAction = () => {
    resetErrorBoundary()
    onAction?.()
  }

  return (
    <section className={styles.fallback}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Something broke</p>
        <h2 className={styles.title}>
          {title ?? 'The app ran into an unexpected error.'}
        </h2>
        <p className={styles.message}>
          {message ?? 'Try again or reload the page to restore the movie search UI.'}
        </p>
        <button type="button" className={styles.action} onClick={handleAction}>
          {actionLabel ?? 'Try again'}
        </button>
      </div>
    </section>
  )
}

function ErrorBoundary({
  children,
  title,
  message,
  actionLabel,
  onAction,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Unhandled UI error', error, errorInfo)
      }}
      fallbackRender={(fallbackProps) => (
        <ErrorFallback
          {...fallbackProps}
          title={title}
          message={message}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      )}
    >
      {children}
    </ReactErrorBoundary>
  )
}

export default ErrorBoundary
