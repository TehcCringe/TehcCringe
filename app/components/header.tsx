import { styled } from "react-tailwind-variants"
import LogoIcon from "@/public/logo/svg/icon.svg"
import Flex from "./ui/flex"
import Link from "next/link"
import { Search } from "lucide-react"

export default function Header() {
  return (
    <HeaderBase>
      <HeaderContent align="center" justify="between" p={4}>
        <Flex col gap={1} className="max-md:items-center">
          <Flex gap={2} align="center" asChild>
            <Link href="/">
              <LogoIcon className="w-[36px] fill-mauve" />
              <LogoHeader>TehcCringe</LogoHeader>
            </Link>
          </Flex>
          <p className="text-subtext0 text-xs">
            Open source satirical tech news outlet
          </p>
        </Flex>

        <Flex align="center" gap={4} asChild>
          <nav>
            <NavLink asChild>
              <Link href="/about">About</Link>
            </NavLink>
            <NavLink href="https://github.com/TehcCringe/TehcCringe">
              Github
            </NavLink>
            <NavLink href="https://x.com/TehcCringe">Twitter</NavLink>
            <NavLink href="/discord">Discord</NavLink>
            <SubmitArticleLink href="https://github.com/TehcCringe/TehcCringe/blob/master/docs/contributing.md">
              Submit an Article
            </SubmitArticleLink>
            <Link href="/search">
              <SearchIcon />
            </Link>
          </nav>
        </Flex>
      </HeaderContent>
    </HeaderBase>
  )
}

const HeaderBase = styled("header", {
  base: "flex justify-center",
})

const HeaderContent = styled(Flex, {
  base: "max-w-[960px] w-full max-md:flex-col max-md:items-center max-md:gap-4",
})

const NavLink = styled("a", {
  base: "text-subtext0 underline hover:text-yellow",
})

const SubmitArticleLink = styled("a", {
  base: "bg-mauve/10 px-3 py-2 text-mauve hover:bg-yellow/10 hover:underline hover:text-yellow max-md:hidden",
})

const SearchIcon = styled(Search, {
  base: "w-6 h-6 text-subtext0 hover:text-yellow",
})

export const LogoHeader = styled("span", {
  base: "font-black text-text text-4xl leading-none tracking-tighter",
})
