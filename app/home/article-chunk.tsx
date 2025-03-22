import { LayoutGrouping, layoutComponents } from "../components/layouts"
import { LayoutItem } from "../components/layouts/components"
import Flex from "../components/ui/flex"

export function ArticleGroupChunk({ chunk }: { chunk: LayoutGrouping[] }) {
  return (
    <>
      {chunk.map((item, i) => {
        const Component = layoutComponents[item.layout.Layout]

        return (
          <Flex key={`layout-${i}`} col width="full">
            <Component items={item.items} />
          </Flex>
        )
      })}
    </>
  )
}

export function ArticleFlatChunk({ chunk }: { chunk: LayoutGrouping[] }) {
  return (
    <>
      {chunk
        .map(item => item.items)
        .flat()
        .map((item, i) => (
          <Flex col align="center" key={`flat-layout-${i}`}>
            <LayoutItem article={item} />
          </Flex>
        ))}
    </>
  )
}
