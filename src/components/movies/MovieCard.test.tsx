import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MovieCard from './MovieCard'
import { createMovie } from '../../test/fixtures'

describe('MovieCard', () => {
  it('renders movie metadata and poster', () => {
    render(<MovieCard movie={createMovie()} />)

    expect(
      screen.getByRole('button', { name: 'Open details for Avatar' }),
    ).toBeInTheDocument()
    expect(screen.getByText('2009')).toBeInTheDocument()
    expect(screen.getByText('7.6')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByAltText('Avatar')).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/avatar.jpg',
    )
  })

  it('uses fallback copy and opens the movie on click', async () => {
    const user = userEvent.setup()
    const handleOpen = vi.fn()

    render(
      <MovieCard
        movie={createMovie({
          id: 42,
          overview: '',
          releaseDate: '',
          posterPath: null,
          genres: [],
        })}
        onOpen={handleOpen}
      />,
    )

    expect(screen.getByText('TBA')).toBeInTheDocument()
    expect(
      screen.getByText('No overview is available for this movie yet.'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open details for Avatar' }))

    expect(handleOpen).toHaveBeenCalledWith(42)
  })
})
