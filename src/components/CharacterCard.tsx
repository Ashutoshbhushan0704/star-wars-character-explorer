import type { Character } from '../types/swapi'
import { getSpeciesAccent } from '../utils/colors'

interface CharacterCardProps {
  character: Character
  onSelect: (character: Character) => void
}

export const CharacterCard = ({ character, onSelect }: CharacterCardProps) => {
  const accent = getSpeciesAccent(character.speciesNames)
  const primarySpecies = character.speciesNames[0] ?? 'Unknown'
  const homeworld = character.homeworldDetails?.name ?? 'Unknown'

  return (
    <button
      type="button"
      onClick={() => onSelect(character)}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 ${accent.card}`}
      aria-label={`View details about ${character.name}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={character.imageUrl}
          alt={character.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/90 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pb-6 pt-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">{character.name}</h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${accent.badge}`}
          >
            {primarySpecies}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          <span className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1">
            <span className="size-2 rounded-full bg-emerald-400" />
            {homeworld}
          </span>
          <span className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1">
            <span className="size-2 rounded-full bg-amber-400" />
            {character.birth_year}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
          <span>{character.filmDetails.length} films</span>
          <span>Tap to learn more →</span>
        </div>
      </div>
    </button>
  )
}

