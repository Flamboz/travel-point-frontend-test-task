import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecentSearches from './RecentSearches'

describe('RecentSearches', () => {
  it('renders searches and delegates actions', async () => {
    const user = userEvent.setup()
    const handleRecentSearchSelect = vi.fn()
    const handleRecentSearchesClear = vi.fn()

    render(
      <RecentSearches
        recentSearches={['Avatar', 'Titanic']}
        onRecentSearchSelect={handleRecentSearchSelect}
        onRecentSearchesClear={handleRecentSearchesClear}
      />,
    )

    expect(screen.getByText('Recent searches')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Titanic' }))
    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(handleRecentSearchSelect).toHaveBeenCalledWith('Titanic')
    expect(handleRecentSearchesClear).toHaveBeenCalledTimes(1)
  })
})
