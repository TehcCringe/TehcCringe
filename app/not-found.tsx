import Flex from "./components/ui/flex"
import { A } from "./components/markdown/paragraph"
import Link from "next/link"

export default function NotFound() {
  return (
    <Flex col grow center gap={4}>
      <h1 className="text-6xl font-bold">404 Not Found</h1>
      <h2 className="text-2xl text-subtext1">Well that&apos;s unfortunate</h2>
      <p>
        <A asChild>
          <Link href="/">Return Home</Link>
        </A>
      </p>
    </Flex>
  )
}
