import { useEffect, useMemo, useState } from 'react'
import { getCharacters } from '../api/swapi'
import type { Character } from '../types/swapi'

export interface FilterOptions {
  species: string[]
  homeworlds: string[]
  films: string[]
}

interface UseCharactersResult {
  characters: Character[]
  isLoading: boolean
  error: string | null
  options: FilterOptions
}

export const useCharacters = (searchTerm: string): UseCharactersResult => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const loadCharacters = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getCharacters(searchTerm, controller.signal)
        if (!cancelled) {
          setCharacters(result)
        }
      } catch (err) {
        if (cancelled) {
          return
        }

        if ((err as DOMException).name === 'AbortError') {
          return
        }

        const message = err instanceof Error ? err.message : 'Something went wrong'
        setError(message)
        setCharacters([])
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadCharacters()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [searchTerm])

  const options = useMemo<FilterOptions>(() => {
    const species = new Set<string>()
    const homeworlds = new Set<string>()
    const films = new Set<string>()

    characters.forEach((character) => {
      character.speciesNames.forEach((name) => species.add(name))

      if (character.homeworldDetails?.name) {
        homeworlds.add(character.homeworldDetails.name)
      }

      character.filmDetails.forEach((film) => films.add(film.title))
    })

    return {
      species: Array.from(species).sort((a, b) => a.localeCompare(b)),
      homeworlds: Array.from(homeworlds).sort((a, b) => a.localeCompare(b)),
      films: Array.from(films).sort((a, b) => a.localeCompare(b)),
    }
  }, [characters])

  return { characters, isLoading, error, options }
}

