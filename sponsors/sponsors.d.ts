export interface Sponsor {
  title: string
  author: string
  displayName: string
  image: string
  alt: string
}

export interface SponsorsData {
  sponsors: Sponsor[]
}

declare const sponsors: Sponsor[]
export default sponsors

