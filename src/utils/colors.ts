type SpeciesStyle = {
  card: string
  badge: string
}

const SPECIES_PRESETS: Record<string, SpeciesStyle> = {
  human: {
    card: 'border-sky-500/40 bg-sky-500/5 hover:border-sky-400/70',
    badge: 'border border-sky-400/40 bg-sky-500/10 text-sky-200',
  },
  droid: {
    card: 'border-amber-400/40 bg-amber-400/10 hover:border-amber-400/70',
    badge: 'border border-amber-300/40 bg-amber-400/15 text-amber-100',
  },
  wookiee: {
    card: 'border-emerald-500/30 bg-emerald-500/8 hover:border-emerald-400/70',
    badge: 'border border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
  },
  rodian: {
    card: 'border-lime-400/40 bg-lime-400/10 hover:border-lime-300/70',
    badge: 'border border-lime-300/40 bg-lime-400/10 text-lime-100',
  },
  trandoshan: {
    card: 'border-teal-400/40 bg-teal-500/10 hover:border-teal-300/70',
    badge: 'border border-teal-300/40 bg-teal-500/10 text-teal-100',
  },
  ewok: {
    card: 'border-orange-400/40 bg-orange-500/10 hover:border-orange-300/70',
    badge: 'border border-orange-300/40 bg-orange-500/10 text-orange-100',
  },
  zabrak: {
    card: 'border-red-500/40 bg-red-500/10 hover:border-red-400/70',
    badge: 'border border-red-400/40 bg-red-500/10 text-red-100',
  },
  twi: {
    card: 'border-violet-500/40 bg-violet-500/10 hover:border-violet-400/70',
    badge: 'border border-violet-400/40 bg-violet-500/10 text-violet-100',
  },
  mirialan: {
    card: 'border-green-400/40 bg-green-500/10 hover:border-green-300/70',
    badge: 'border border-green-300/40 bg-green-500/10 text-green-100',
  },
  kel: {
    card: 'border-cyan-400/40 bg-cyan-500/10 hover:border-cyan-300/70',
    badge: 'border border-cyan-300/40 bg-cyan-500/10 text-cyan-100',
  },
  togruta: {
    card: 'border-fuchsia-400/40 bg-fuchsia-500/10 hover:border-fuchsia-300/70',
    badge: 'border border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-100',
  },
  hut: {
    card: 'border-yellow-400/40 bg-yellow-400/10 hover:border-yellow-300/60',
    badge: 'border border-yellow-300/40 bg-yellow-400/10 text-yellow-900',
  },
}

const FALLBACK_STYLES: SpeciesStyle[] = [
  {
    card: 'border-indigo-400/40 bg-indigo-500/10 hover:border-indigo-300/70',
    badge: 'border border-indigo-300/40 bg-indigo-500/10 text-indigo-100',
  },
  {
    card: 'border-rose-400/40 bg-rose-500/10 hover:border-rose-300/70',
    badge: 'border border-rose-300/40 bg-rose-500/10 text-rose-100',
  },
  {
    card: 'border-blue-400/40 bg-blue-500/10 hover:border-blue-300/70',
    badge: 'border border-blue-300/40 bg-blue-500/10 text-blue-100',
  },
  {
    card: 'border-lime-400/40 bg-lime-500/10 hover:border-lime-300/70',
    badge: 'border border-lime-300/40 bg-lime-500/10 text-lime-100',
  },
  {
    card: 'border-pink-400/40 bg-pink-500/10 hover:border-pink-300/70',
    badge: 'border border-pink-300/40 bg-pink-500/10 text-pink-100',
  },
  {
    card: 'border-sky-400/40 bg-sky-500/10 hover:border-sky-300/70',
    badge: 'border border-sky-300/40 bg-sky-500/10 text-sky-100',
  },
]

const hashStringToIndex = (value: string, max: number): number => {
  const hash = Array.from(value).reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7)
  return Math.abs(hash) % max
}

export const getSpeciesAccent = (speciesNames: string[]): SpeciesStyle => {
  const primary = (speciesNames[0] ?? 'Unknown').toLowerCase()

  const presetKey = Object.keys(SPECIES_PRESETS).find((key) => primary.startsWith(key))
  if (presetKey) {
    return SPECIES_PRESETS[presetKey]
  }

  return FALLBACK_STYLES[hashStringToIndex(primary, FALLBACK_STYLES.length)]
}

