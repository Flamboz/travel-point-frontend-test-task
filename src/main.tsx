import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      title="The movie search app crashed."
      message="Reload the page to restore the main experience."
      actionLabel="Reload page"
      onAction={() => window.location.reload()}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
