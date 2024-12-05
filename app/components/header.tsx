import { styled } from "react-tailwind-variants"
import LogoIcon from "@/public/logo/svg/icon.svg"
import Flex from "./ui/flex"
import Link from "next/link"

export default function Header() {
  return (
    <HeaderBase>
      <HeaderContent align="center" justify="between" p={4}>
        <Flex gap={2} align="center" asChild>
          <Link href="/">
            <LogoIcon className="w-[48px] fill-mauve" />
            <LogoHeader>TehcCringe</LogoHeader>
          </Link>
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

export const LogoHeader = styled("span", {
  base: "font-black text-text text-5xl leading-none tracking-tighter",
})
