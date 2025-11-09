import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { resetSwapiCache } from './api/swapi'

const createResponse = (data: unknown) =>
  Promise.resolve(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  )

const PEOPLE_URL = 'https://swapi.dev/api/people/'
const PLANET_URL = 'https://swapi.dev/api/planets/1/'
const FILM_URL = 'https://swapi.dev/api/films/1/'

describe('Star Wars Character App', () => {
  beforeEach(() => {
    resetSwapiCache()
    const responses: Record<string, () => Promise<Response>> = {
      [PEOPLE_URL]: () =>
        createResponse({
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              name: 'Luke Skywalker',
              height: '172',
              mass: '77',
              hair_color: 'blond',
              skin_color: 'fair',
              eye_color: 'blue',
              birth_year: '19BBY',
              gender: 'male',
              homeworld: PLANET_URL,
              films: [FILM_URL],
              species: [],
              vehicles: [],
              starships: [],
              created: '2014-12-09T13:50:51.644000Z',
              edited: '2014-12-20T21:17:56.891000Z',
              url: 'https://swapi.dev/api/people/1/',
            },
          ],
        }),
      [PLANET_URL]: () =>
        createResponse({
          name: 'Tatooine',
          rotation_period: '23',
          orbital_period: '304',
          diameter: '10465',
          climate: 'arid',
          gravity: '1 standard',
          terrain: 'desert',
          surface_water: '1',
          population: '200000',
          residents: [],
          films: [FILM_URL],
          created: '2014-12-09T13:50:49.641000Z',
          edited: '2014-12-20T20:58:18.411000Z',
          url: PLANET_URL,
        }),
      [FILM_URL]: () =>
        createResponse({
          title: 'A New Hope',
          episode_id: 4,
          opening_crawl: '',
          director: 'George Lucas',
          producer: '',
          release_date: '1977-05-25',
          characters: ['https://swapi.dev/api/people/1/'],
          planets: [PLANET_URL],
          starships: [],
          vehicles: [],
          species: [],
          created: '2014-12-10T14:23:31.880000Z',
          edited: '2014-12-12T11:24:39.858000Z',
          url: FILM_URL,
        }),
    }

    vi.spyOn(globalThis, 'fetch').mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      const normalizedUrl = url.endsWith('/') ? url : `${url}/`

      const responder = responses[normalizedUrl]
      if (!responder) {
        const fallbackResponder = responses[url]
        if (!fallbackResponder) {
          throw new Error(`Unhandled request for ${url}`)
        }
        return fallbackResponder()
      }

      return responder()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens the character modal with the expected details', async () => {
    const user = userEvent.setup()
    render(<App />)

    const cardButton = await screen.findByRole('button', {
      name: /view details about luke skywalker/i,
    })

    await user.click(cardButton)

    const modal = await screen.findByRole('dialog', { name: /luke skywalker/i })
    expect(modal).toBeInTheDocument()

    const modalUtils = within(modal)
    expect(modalUtils.getByRole('heading', { name: /luke skywalker/i })).toBeInTheDocument()
    expect(modalUtils.getByText('1.72 m')).toBeInTheDocument()
    expect(modalUtils.getByText('77 kg')).toBeInTheDocument()
    expect(modalUtils.getByText('19BBY')).toBeInTheDocument()
    expect(modalUtils.getByText('09-12-2014')).toBeInTheDocument()
    expect(modalUtils.getByText(/tatooine/i)).toBeInTheDocument()
    expect(modalUtils.getByText(/a new hope/i)).toBeInTheDocument()

    const dismissOverlay = modalUtils.getByRole('button', { name: /close modal/i })
    await user.click(dismissOverlay)

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})

