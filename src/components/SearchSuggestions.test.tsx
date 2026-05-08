import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchSuggestions from './SearchSuggestions'
import { createMovie } from '../test/fixtures'

describe('SearchSuggestions', () => {
  it('renders a loading state', () => {
    render(
      <SearchSuggestions
        suggestions={[]}
        isSuggestionsLoading={true}
        onSuggestionSelect={vi.fn()}
      />,
    )

    expect(screen.getByText('Loading suggestions...')).toBeInTheDocument()
  })

  it('renders suggestions and delegates selection', async () => {
    const user = userEvent.setup()
    const suggestion = createMovie()
    const handleSuggestionSelect = vi.fn()

    render(
      <SearchSuggestions
        suggestions={[suggestion]}
        isSuggestionsLoading={false}
        onSuggestionSelect={handleSuggestionSelect}
      />,
    )

    expect(screen.getByText('2009 • Action, Adventure')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /avatar/i }))

    expect(handleSuggestionSelect).toHaveBeenCalledWith(suggestion)
  })
})
