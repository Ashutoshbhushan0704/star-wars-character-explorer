const parseNumber = (value: string): number | null => {
  const cleaned = value.replace(/,/g, '')
  const result = Number.parseFloat(cleaned)
  return Number.isFinite(result) ? result : null
}

export const formatHeight = (height: string): string => {
  if (!height || height.toLowerCase() === 'unknown') {
    return 'Unknown'
  }

  const numeric = parseNumber(height)

  if (numeric === null) {
    return 'Unknown'
  }

  return `${(numeric / 100).toFixed(2)} m`
}

export const formatMass = (mass: string): string => {
  if (!mass || mass.toLowerCase() === 'unknown') {
    return 'Unknown'
  }

  const numeric = parseNumber(mass)

  if (numeric === null) {
    return 'Unknown'
  }

  return `${numeric.toLocaleString()} kg`
}

export const formatDate = (isoString: string): string => {
  if (!isoString) {
    return 'Unknown'
  }

  const date = new Date(isoString)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

export const formatPopulation = (population: string): string => {
  if (!population || population.toLowerCase() === 'unknown') {
    return 'Unknown'
  }

  const numeric = parseNumber(population)

  if (numeric === null) {
    return population
  }

  return numeric.toLocaleString()
}

