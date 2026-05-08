import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MovieResults from './MovieResults'
import { createMovie, defaultFilters } from '../../test/fixtures'

describe('MovieResults', () => {
  it('renders the idle empty state before a search starts', () => {
    render(
      <MovieResults
        movies={[]}
        query=""
        filters={defaultFilters}
        status="idle"
        totalResults={0}
        currentPage={1}
        totalPages={0}
        errorMessage=""
        onMovieOpen={vi.fn()}
        onPageChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Search for a movie')).toBeInTheDocument()
    expect(
      screen.getByText('Type a title above to load matching movies from TMDB.'),
    ).toBeInTheDocument()
  })

  it('renders search results and pagination controls', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()

    render(
      <MovieResults
        movies={[createMovie(), createMovie({ id: 2, title: 'Dune' })]}
        query="arrival"
        filters={defaultFilters}
        status="success"
        totalResults={40}
        currentPage={2}
        totalPages={4}
        errorMessage=""
        onMovieOpen={vi.fn()}
        onPageChange={handlePageChange}
      />,
    )

    expect(screen.getByText('40 movies found')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /open details for/i })).toHaveLength(2)
    expect(screen.getAllByText('Page 2 of 4')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Previous' }))
    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(handlePageChange).toHaveBeenNthCalledWith(1, 1)
    expect(handlePageChange).toHaveBeenNthCalledWith(2, 3)
  })

  it('mentions active filters in the empty results state', () => {
    render(
      <MovieResults
        movies={[]}
        query="arrival"
        filters={{ ...defaultFilters, region: 'US' }}
        status="success"
        totalResults={0}
        currentPage={1}
        totalPages={0}
        errorMessage=""
        onMovieOpen={vi.fn()}
        onPageChange={vi.fn()}
      />,
    )

    expect(screen.getByText('No movies found')).toBeInTheDocument()
    expect(screen.getByText(/with the current filters/i)).toBeInTheDocument()
  })
})
