"use client"

import { useArticle } from "../article-provider"
import { join } from "path"

export function Image({
  src: imageSrc,
  alt,
  ...props
}: React.ComponentProps<"img"> & { src: string; alt: string }) {
  const { article } = useArticle()

  return (
    <img
      src={"/" + join("assets", article.slug, imageSrc)}
      alt={alt}
      className="border border-surface0"
      {...props}
    />
  )
}
