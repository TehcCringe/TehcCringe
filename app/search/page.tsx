import { getAllArticles } from "../lib/articles"
import SearchContent from "./content"

export default async function Search() {
  const articles = getAllArticles()

  return <SearchContent articles={articles} />
}
