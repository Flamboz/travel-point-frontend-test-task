import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from './ErrorBoundary'

function BrokenComponent(): ReactNode {
  throw new Error('Error')
}

describe('ErrorBoundary', () => {
  it('renders the fallback UI and runs the action callback', async () => {
    const user = userEvent.setup()
    const handleAction = vi.fn()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary
        title="Movie details crashed."
        message="Close the dialog and open the movie again."
        actionLabel="Close dialog"
        onAction={handleAction}
      >
        <BrokenComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something broke')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Movie details crashed.' })).toBeInTheDocument()
    expect(
      screen.getByText('Close the dialog and open the movie again.'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close dialog' }))

    expect(handleAction).toHaveBeenCalledTimes(1)

    consoleErrorSpy.mockRestore()
  })
})
