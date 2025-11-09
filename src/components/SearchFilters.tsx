import { useMemo } from 'react'
import type { FilterOptions } from '../hooks/useCharacters'

export interface CharacterFilters {
  species: string
  homeworld: string
  film: string
}

interface SearchFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  filters: CharacterFilters
  onFilterChange: <Key extends keyof CharacterFilters>(key: Key, value: CharacterFilters[Key]) => void
  options: FilterOptions
  onReset: () => void
}

const Select = ({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: string[]
  disabled?: boolean
}) => (
  <label className="flex flex-col gap-2 text-sm text-slate-300">
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white shadow-inner shadow-black/40 transition placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:cursor-not-allowed disabled:text-slate-500"
    >
      <option value="all">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
)

export const SearchFilters = ({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  options,
  onReset,
}: SearchFiltersProps) => {
  const activeFilters = useMemo(
    () => ['species', 'homeworld', 'film'].filter((key) => filters[key as keyof CharacterFilters] !== 'all').length,
    [filters],
  )

  return (
    <section className="flex w-full flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-6 shadow-inner shadow-black/20 backdrop-blur-md md:flex-row md:items-end md:justify-between">
      <div className="flex w-full flex-col gap-4 md:max-w-lg">
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Search</span>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 5.1 5.1a7.5 7.5 0 0 0 11.55 11.55Z"
                />
              </svg>
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/40 py-2.5 pl-11 pr-4 text-sm text-white shadow-inner shadow-black/40 transition placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              aria-label="Search characters by name"
            />
          </div>
        </label>
        <p className="text-xs text-slate-400">
          Search the Star Wars universe by character name, then refine with filters. SWAPI data powers this experience.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:max-w-3xl md:grid-cols-3">
        <Select
          label="Species"
          value={filters.species}
          onChange={(value) => onFilterChange('species', value)}
          placeholder="All species"
          options={options.species}
        />

        <Select
          label="Homeworld"
          value={filters.homeworld}
          onChange={(value) => onFilterChange('homeworld', value)}
          placeholder="All homeworlds"
          options={options.homeworlds}
        />

        <Select
          label="Film"
          value={filters.film}
          onChange={(value) => onFilterChange('film', value)}
          placeholder="All films"
          options={options.films}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-red-400/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
        >
          Clear filters
        </button>
        <span className="hidden text-xs text-slate-400 md:inline-flex">
          {activeFilters} active filter{activeFilters === 1 ? '' : 's'}
        </span>
      </div>
    </section>
  )
}

