import { Suspense } from "react"
import { getAllArticles } from "../lib/articles"
import SearchContent from "./content"

export default async function Search() {
  const articles = getAllArticles()

  return (
    <Suspense>
      <SearchContent articles={articles} />
    </Suspense>
  )
}
