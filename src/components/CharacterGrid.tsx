import type { Character } from '../types/swapi'
import { CharacterCard } from './CharacterCard'

interface CharacterGridProps {
  characters: Character[]
  onSelect: (character: Character) => void
}

export const CharacterGrid = ({ characters, onSelect }: CharacterGridProps) => {
  if (!characters.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/40 px-8 py-16 text-center">
        <h3 className="text-lg font-semibold text-white">No characters found</h3>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Try adjusting your search or filters. The Force is strong — the right character is out there.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} onSelect={onSelect} />
      ))}
    </div>
  )
}

