import Image from "next/image"
import Flex from "./ui/flex"
import { styled } from "react-tailwind-variants"
import { Sponsor } from "../lib/sponsors"
import { slugify } from "@/app/lib/utils"

interface SponsorBannerProps {
  sponsor: Sponsor
  className?: string
  position?: "homePage" | "articlePage"
}

export default function SponsorBanner({
  sponsor,
  className = "",
  position = "homePage",
}: SponsorBannerProps) {
  if (!sponsor) return null

  return (
    <SponsorWrapper position={position}>
      <BannerContainer position={position} className={className}>
        <Flex col gap={2} width="full">
          <div className="text-xs tracking-wider mb-2">SPONSORED</div>
          <Flex align="center" gap={4}>
            <div className="relative w-full h-72 mb-2">
              <Image
                src={`/assets/sponsors/${slugify(sponsor.title)}/image.png`}
                alt={sponsor.alt}
                fill
                style={{ objectFit: "contain" }}
                priority={false}
              />
            </div>
          </Flex>
          <div className="text-xs text-subtext0">
            This ad is brought to you by{" "}
            <a
              href={sponsor.author}
              className="hover:underline hover:text-sky transition-colors"
            >
              {sponsor.displayName}
            </a>
          </div>
        </Flex>
      </BannerContainer>
    </SponsorWrapper>
  )
}

// Outer wrapper that visually connects with articles
const SponsorWrapper = styled("div", {
  base: "w-full bg-base",
  variants: {
    position: {
      homePage: "mx-auto border-t-2 border-x-2 border-crust",
      articlePage: "mx-auto",
    },
  },
  defaultVariants: {
    position: "homePage",
  },
})

// Inner container for the banner content
const BannerContainer = styled("div", {
  base: "w-full p-4 bg-surface0 my-6 border-x-2 border-y-2 border-surface1 mx-auto overflow-hidden",
  variants: {
    position: {
      homePage: "max-w-4xl",
      articlePage: "max-w-3xl",
    },
  },
  defaultVariants: {
    position: "homePage",
  },
})
