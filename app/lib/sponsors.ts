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

// Get a number of randomized sponsors
export function getSponsorsForPage(count: number): Array<SponsorType> {
  const sponsors = getAllSponsors()

  return sponsors
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, sponsors.length))
}
