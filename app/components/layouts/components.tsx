import { ArticleType } from "@/app/lib/articles"
import { styled, variants } from "react-tailwind-variants"
import Image from "next/image"
import Flex from "../ui/flex"
import { InlineMarkdownRenderer } from "../markdown"
import Link from "next/link"

const layoutItemVariants = variants({
  base: "flex flex-col basis-0 group max-w-[720px]",
  variants: {
    grow: {
      true: "grow",
      false: "grow-0",
      two: "grow-[2]",
      three: "grow-[3]",
    },
  },
  defaultVariants: {
    grow: true,
  },
})

export async function LayoutItem({
  article,
  size = "sm",
  preview = false,
  ...props
}: {
  article: ArticleType
  size?: "sm" | "md" | "lg"
  preview?: boolean
} & Parameters<typeof layoutItemVariants>[0]) {
  if (!article) return "404"

  const image = await import(`@/articles/${article.slug}/cover.png`)

  return (
    <Link href={`/news/${article.slug}`} className={layoutItemVariants(props)}>
      <Flex col gap={4} p={4}>
        <Image
          src={image.default}
          alt={article.data.title}
          className="border border-surface0"
        />

        <Flex col gap={1}>
          <p>
            <span className="text-green">
              {(
                article.data.category ??
                article.data.tags?.[0] ??
                "NEWS"
              ).toUpperCase()}
            </span>{" "}
            <span className="text-subtext0">{"•"}</span>{" "}
            <span className="text-subtext1">
              {article.data.date.toLocaleDateString()}
            </span>
          </p>
          <LayoutItemHeader size={size}>{article.data.title}</LayoutItemHeader>
        </Flex>
        {preview && (
          <p className="text-subtext0 line-clamp-3">
            <InlineMarkdownRenderer>{article.content}</InlineMarkdownRenderer>
          </p>
        )}
      </Flex>
    </Link>
  )
}

const LayoutItemHeader = styled("h2", {
  base: "group-hover:underline group-hover:text-sapphire",
  variants: {
    size: {
      sm: "text-lg font-semibold",
      md: "text-xl font-bold",
      lg: "text-3xl font-black",
    },
  },
})

export const Growable = styled("div", {
  base: "flex basis-0",
  variants: {
    grow: {
      true: "grow",
      false: "grow-0",
      two: "grow-[2]",
      three: "grow-[3]",
    },
  },
  defaultVariants: {
    grow: true,
  },
})

export const LayoutRow = styled(Growable, {
  base: "flex divide-x-2 divide-crust",
})

export const LayoutCol = styled(Growable, {
  base: "flex flex-col divide-y-2 divide-crust",
})

export const ContainerRow = styled(LayoutRow, {
  base: "border-x-2 border-crust w-full",
})

export const ContainerCol = styled(LayoutCol, {
  base: "border-x-2 border-crust w-full max-md:border-x-0",
})
