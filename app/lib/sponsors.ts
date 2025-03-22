import { join } from "path"
import { readdirSync } from "fs"
import { z } from "zod"
import { formatError } from "./errors"
import matter from "gray-matter"

export const sponsorJsonSchema = z.object({
  title: z.string(),
  author: z.string(),
  displayName: z.string(),
})

export const sponsorSchema = z.object({
  data: sponsorJsonSchema,
  content: z.string(),
  slug: z.string(),
})

export type SponsorJsonType = z.infer<typeof sponsorJsonSchema>

export type SponsorType = z.infer<typeof sponsorSchema>

export const sponsorsDir = join(process.cwd(), "sponsors")

export function getAllSponsors(): Array<SponsorType> {
  return readdirSync(sponsorsDir).map(slug => {
    try {
      return getSponsor(slug)
    } catch (e) {
      const errorContent = `[Sponsor] (${slug}) - ${formatError(e, false)}`

      throw new Error(errorContent)
    }
  })
}

export function getSponsor(slug: string): SponsorType {
  const sponsorDirPath = join(sponsorsDir, slug)
  const parsedSponsor = matter.read(join(sponsorDirPath, "index.md"))
  const sponsorData = sponsorJsonSchema.parse(parsedSponsor.data)

  return sponsorSchema.parse({
    content: parsedSponsor.content.trim(),
    slug,
    data: sponsorData,
  })
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
): Array<SponsorType> {
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
