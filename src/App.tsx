import { useEffect, useMemo, useState } from 'react'
import { CharacterGrid } from './components/CharacterGrid'
import { CharacterModal } from './components/CharacterModal'
import { Pagination } from './components/Pagination'
import { SearchFilters } from './components/SearchFilters'
import type { CharacterFilters } from './components/SearchFilters'
import { useCharacters } from './hooks/useCharacters'
import type { Character } from './types/swapi'

const PAGE_SIZE = 12

const DEFAULT_FILTERS: CharacterFilters = {
  species: 'all',
  homeworld: 'all',
  film: 'all',
}

const applyFilters = (character: Character, filters: CharacterFilters) => {
  if (filters.species !== 'all' && !character.speciesNames.includes(filters.species)) {
    return false
  }

  if (filters.homeworld !== 'all' && character.homeworldDetails?.name !== filters.homeworld) {
    return false
  }

  if (
    filters.film !== 'all' &&
    !character.filmDetails.some((film) => film.title === filters.film)
  ) {
    return false
  }

  return true
}

const App = () => {
  const [page, setPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filters, setFilters] = useState<CharacterFilters>(DEFAULT_FILTERS)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const { characters, isLoading, error, options } = useCharacters(searchTerm)

  const filteredCharacters = useMemo(
    () => characters.filter((character) => applyFilters(character, filters)),
    [characters, filters],
  )

  const totalPages = Math.max(1, Math.ceil(filteredCharacters.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [searchTerm, filters.species, filters.homeworld, filters.film])

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  useEffect(() => {
    if (selectedCharacter && !filteredCharacters.some((character) => character.id === selectedCharacter.id)) {
      setSelectedCharacter(null)
    }
  }, [filteredCharacters, selectedCharacter])

  const paginatedCharacters = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredCharacters.slice(start, start + PAGE_SIZE)
  }, [filteredCharacters, page])

  const handleFilterChange = <Key extends keyof CharacterFilters>(key: Key, value: CharacterFilters[Key]) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleReset = () => setFilters(DEFAULT_FILTERS)

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-10 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200">
            Star Wars Explorer
          </span>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Discover the Galaxy&apos;s Heroes</h1>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            Browse iconic characters from the Star Wars saga, powered by the SWAPI. Search, filter, and dive into
            detailed profiles with rich data visualisation.
          </p>
        </header>

        <SearchFilters
          search={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          options={options}
          onReset={handleReset}
        />

        {error && (
          <div className="rounded-3xl border border-red-500/40 bg-red-500/10 px-6 py-4 text-sm text-red-200">
            <p className="font-semibold text-red-100">Unable to load characters</p>
            <p className="mt-1 text-red-200/80">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-slate-900/40 px-8 py-16">
            <div className="flex flex-col items-center gap-3 text-slate-300">
              <span className="relative flex h-12 w-12">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-500/40 opacity-75" />
                <span className="relative inline-flex h-12 w-12 rounded-full border-4 border-sky-500/40 border-t-transparent" />
              </span>
              <span className="text-sm">Fetching characters from a galaxy far, far away…</span>
            </div>
          </div>
        ) : !error ? (
          <CharacterGrid characters={paginatedCharacters} onSelect={setSelectedCharacter} />
        ) : null}

        {!error && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isDisabled={isLoading}
          />
        )}
      </div>

      {selectedCharacter && (
        <CharacterModal character={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
      )}
    </div>
  )
}

export default App

