import { readdirSync } from "fs"
import { join } from "path"
import { z } from "zod"
import matter from "gray-matter"
import { formatError } from "./errors"

export const articleDataSchema = z.object({
  title: z.string(),
  date: z.date(),
  author: z.string().nullish(),
  displayName: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  category: z.string().nullish(),
})

export const articleSchema = z.object({
  content: z.string(),
  slug: z.string(),
  data: articleDataSchema,
})

export type ArticleType = z.infer<typeof articleSchema>

export type ArticleDataType = z.infer<typeof articleDataSchema>

export const articlesDir = join(process.cwd(), "articles")

export function getAllArticles(): Array<ArticleType> {
  return readdirSync(articlesDir).map(slug => {
    try {
      return getArticle(slug)
    } catch (e) {
      const errorContent = `[Article] (${slug}) - ${formatError(e, false)}`

      throw new Error(errorContent)
    }
  })
}

export function getArticle(slug: string): ArticleType {
  const articleDirPath = join(articlesDir, slug)
  const parsedArticle = matter.read(join(articleDirPath, "index.md"))
  const articleData = articleDataSchema.parse(parsedArticle.data)

  return articleSchema.parse({
    content: parsedArticle.content.trim(),
    slug,
    data: articleData,
  })
}
