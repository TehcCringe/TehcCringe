import Home from "./[page]/page"

export default function Homepage() {
  return <Home params={new Promise(resolve => resolve({ page: "0" }))} />
}
