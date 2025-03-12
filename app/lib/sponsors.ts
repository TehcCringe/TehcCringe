import { join } from "path"
import { readFileSync, readdirSync } from "fs"
import { z } from "zod"

export const sponsorSchema = z.object({
  title: z.string(),
  author: z.string(),
  displayName: z.string(),
  image: z.string(),
  alt: z.string(),
})

export type Sponsor = z.infer<typeof sponsorSchema>

export function getAllSponsors(): Array<Sponsor> {
  const sponsorDirs = join(process.cwd(), "sponsors")
  const sponsorNames = readdirSync(sponsorDirs, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name)

  const sponsors: Sponsor[] = []

  for (const sponsorName of sponsorNames) {
    const sponsorDataPath = join(sponsorDirs, sponsorName, "sponsor.json")
    const sponsorData = JSON.parse(readFileSync(sponsorDataPath, "utf-8"))
    sponsors.push(sponsorSchema.parse(sponsorData))
  }

  return sponsors
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
export function getSponsorsForPage(
  pageKey: string,
  count: number = 1,
): Array<Sponsor> {
  const sponsors = getAllSponsors()

  if (sponsors.length === 0) {
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
