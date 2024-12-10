import Link from "next/link"
import LogoIcon from "@/public/logo/svg/icon.svg"
import { styled } from "react-tailwind-variants"
import Flex from "./ui/flex"
import { LogoHeader } from "./header"
import { CopyrightIcon } from "lucide-react"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <FooterBase>
      <FooterContent>
        <FooterHeadContent>
          <HeaderContainer>
            <Flex gap={2} asChild>
              <Link href="/">
                <LogoIcon className="w-[36px] fill-mauve" />
                <LogoHeader>TehcCringe</LogoHeader>
              </Link>
            </Flex>
            <p className="max-sm:text-center text-subtext0">
              Open source satirical tech news outlet
            </p>
          </HeaderContainer>

          <Flex gap={2} wrap className="max-md:justify-center">
            <FooterLink asChild>
              <Link href="/">Home</Link>
            </FooterLink>
            <FooterLink asChild>
              <Link href="/about">About</Link>
            </FooterLink>
            <FooterLink href="https://github.com/TehcCringe/TehcCringe">
              Github
            </FooterLink>
            <FooterLink href="https://x.com/TehcCringe">Twitter</FooterLink>
            <FooterLink href="/discord">Discord</FooterLink>
          </Flex>
        </FooterHeadContent>
        <Flex className="py-4">
          <p className="text-sm text-subtext0">
            <CopyrightIcon className="inline w-4 h-4 align-middle" /> TehcCringe
            2024
            {year !== 2024 && `-${year}`}. All rights reserved.
          </p>
        </Flex>
      </FooterContent>
    </FooterBase>
  )
}

const FooterBase = styled("footer", {
  base: "flex items-center justify-center py-4",
})

const FooterHeadContent = styled("div", {
  base: "flex items-center justify-center gap-4 py-4 max-md:flex-col",
})

const FooterContent = styled("div", {
  base: "flex flex-col w-full max-w-[960px] divide-y divide-surface0 px-4",
})

const FooterLink = styled("a", {
  base: "text-subtext0 hover:text-yellow underline min-w-[160px] max-md:min-w-0 max-md:px-2 text-center",
})

const HeaderContainer = styled("div", {
  base: "flex flex-col gap-2 flex-grow shrink-0 max-md:items-center",
})
