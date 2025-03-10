export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .trim()
}

// Generate pseudo-random number based on seed
export const seedRandom = (seed: string): (() => number) => {
  let state = Array.from(seed).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  )

  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

// Get sponsors for a specific page using randomization
export const getSponsorsForPage = (pageKey: string, count: number = 1) => {
  const sponsorsData = require("../../sponsors/sponsors.json")
  const sponsors = sponsorsData.sponsors

  if (!sponsors || sponsors.length === 0) {
    return []
  }

  // Use page as seed
  const random = seedRandom(pageKey)
  const shuffled = [...sponsors]

  // Shuffle with seeded random
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // Return requested number of sponsors
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
