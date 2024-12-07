import { ArticleType as ArticleType } from "@/app/lib/articles"
import Flex from "../ui/flex"
import { ContainerCol, LayoutItem } from "./components"

/**
 * Layout for small devices
 *
 * Just one row with columns
 */
export default function ColumnLayout({ items }: { items: Array<ArticleType> }) {
  return (
    <ContainerCol>
      {items.map(article => (
        <Flex col align="center" key={article.slug}>
          <LayoutItem article={article} />
        </Flex>
      ))}
    </ContainerCol>
  )
}
