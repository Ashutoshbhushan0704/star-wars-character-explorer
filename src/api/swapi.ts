import type {
  Character,
  SwapiFilm,
  SwapiListResponse,
  SwapiPerson,
  SwapiPlanet,
  SwapiSpecies,
} from '../types/swapi'

const API_BASE = 'https://swapi.dev/api'

const resourceCache = new Map<string, Promise<unknown>>()

const DEFAULT_SPECIES_NAME = 'Human'

const PAGE_SIZE = 10

const fetchJson = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

const fetchWithCache = async <T>(url: string): Promise<T> => {
  if (resourceCache.has(url)) {
    return resourceCache.get(url) as Promise<T>
  }

  const promise = fetchJson<T>(url).catch((error) => {
    resourceCache.delete(url)
    throw error
  })

  resourceCache.set(url, promise)
  return promise
}

const extractId = (url: string): string => {
  const match = url.match(/\/(\d+)\/?$/)

  if (match) {
    return match[1]
  }

  const hash = Array.from(url).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `${hash}`
}

const buildImageUrl = (seed: string): string =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/480/360`

const collectAllPeople = async (searchTerm: string | null, signal?: AbortSignal): Promise<SwapiPerson[]> => {
  const people: SwapiPerson[] = []

  let nextUrl: URL | null = new URL(`${API_BASE}/people/`)

  if (searchTerm) {
    nextUrl.searchParams.set('search', searchTerm)
  }

  while (nextUrl !== null) {
    const response: SwapiListResponse<SwapiPerson> = await fetchJson(nextUrl.toString(), signal)
    people.push(...response.results)

    if (!response.next) {
      nextUrl = null
    } else {
      nextUrl = new URL(response.next)
    }
  }

  return people
}

const resolveSpecies = async (urls: string[]): Promise<SwapiSpecies[]> => {
  if (!urls.length) {
    return []
  }

  return Promise.all(
    urls.map(async (url) => {
      try {
        return await fetchWithCache<SwapiSpecies>(url)
      } catch {
        return null
      }
    }),
  ).then((results) => results.filter((value): value is SwapiSpecies => Boolean(value)))
}

const resolveHomeworld = async (url: string | undefined | null): Promise<SwapiPlanet | null> => {
  if (!url) {
    return null
  }

  try {
    return await fetchWithCache<SwapiPlanet>(url)
  } catch {
    return null
  }
}

const resolveFilms = async (urls: string[]): Promise<SwapiFilm[]> => {
  if (!urls.length) {
    return []
  }

  return Promise.all(
    urls.map(async (url) => {
      try {
        return await fetchWithCache<SwapiFilm>(url)
      } catch {
        return null
      }
    }),
  ).then((results) => results.filter((value): value is SwapiFilm => Boolean(value)))
}

const enrichPerson = async (person: SwapiPerson): Promise<Character> => {
  const [speciesDetails, homeworldDetails, filmDetails] = await Promise.all([
    resolveSpecies(person.species),
    resolveHomeworld(person.homeworld),
    resolveFilms(person.films),
  ])

  const speciesNames =
    speciesDetails.length > 0
      ? Array.from(new Set(speciesDetails.map((species) => species.name)))
      : [DEFAULT_SPECIES_NAME]

  const id = extractId(person.url)

  return {
    ...person,
    id,
    imageUrl: buildImageUrl(id || person.name),
    speciesDetails,
    speciesNames,
    homeworldDetails,
    filmDetails,
  }
}

export const getCharacters = async (searchTerm: string, signal?: AbortSignal): Promise<Character[]> => {
  const people = await collectAllPeople(searchTerm.trim() !== '' ? searchTerm.trim() : null, signal)

  const enriched = await Promise.all(people.map((person) => enrichPerson(person)))

  return enriched.sort((a, b) => a.name.localeCompare(b.name))
}

export const estimateTotalPages = (listLength: number, pageSize = PAGE_SIZE): number =>
  Math.max(1, Math.ceil(listLength / pageSize))

export const resetSwapiCache = () => resourceCache.clear()

