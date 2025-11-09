import { useEffect, useRef } from 'react'
import type { Character } from '../types/swapi'
import { formatDate, formatHeight, formatMass, formatPopulation } from '../utils/format'
import { getSpeciesAccent } from '../utils/colors'

interface CharacterModalProps {
  character: Character
  onClose: () => void
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
)

export const CharacterModal = ({ character, onClose }: CharacterModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const accent = getSpeciesAccent(character.speciesNames)
  const homeworld = character.homeworldDetails

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    closeButtonRef.current?.focus()

    return () => window.removeEventListener('keydown', handleKeydown)
  }, [onClose])

  const filmsLabel = `${character.filmDetails.length} film${character.filmDetails.length === 1 ? '' : 's'}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`character-modal-${character.id}`}
      aria-describedby={`character-modal-${character.id}-details`}
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full bg-slate-950/80 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-modal">
        <header className="relative">
          <img
            src={character.imageUrl}
            alt={character.name}
            className="h-64 w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-slate-300 transition hover:border-red-400/60 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-6 right-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className={`inline-flex rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider ${accent.badge}`}>
                {character.speciesNames.join(', ')}
              </span>
              <h2 id={`character-modal-${character.id}`} className="mt-3 text-3xl font-bold text-white md:text-4xl">
                {character.name}
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-slate-200">
              {filmsLabel}
            </span>
          </div>
        </header>

        <section id={`character-modal-${character.id}-details`} className="space-y-6 px-6 pb-8 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Profile</h3>
              <InfoRow label="Height" value={formatHeight(character.height)} />
              <InfoRow label="Mass" value={formatMass(character.mass)} />
              <InfoRow label="Birth year" value={character.birth_year || 'Unknown'} />
              <InfoRow label="Date added" value={formatDate(character.created)} />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Homeworld</h3>
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 px-5 py-4">
                <p className="text-lg font-semibold text-white">{homeworld?.name ?? 'Unknown'}</p>
                <div className="mt-3 grid gap-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-wider text-xs text-slate-400">Climate</span>
                    <span>{homeworld?.climate ?? 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-wider text-xs text-slate-400">Terrain</span>
                    <span>{homeworld?.terrain ?? 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-wider text-xs text-slate-400">Population</span>
                    <span>{homeworld ? formatPopulation(homeworld.population) : 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {character.filmDetails.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Films</h3>
              <ul className="grid gap-2 md:grid-cols-2">
                {character.filmDetails.map((film) => (
                  <li
                    key={film.url}
                    className="rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-200"
                  >
                    <span className="font-medium text-white">{film.title}</span>
                    <span className="ml-2 text-xs uppercase tracking-wider text-slate-500">
                      Episode {film.episode_id}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

