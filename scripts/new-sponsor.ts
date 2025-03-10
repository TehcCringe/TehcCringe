import inquirer from "inquirer"
import { existsSync, readFileSync, writeFileSync } from "fs"
import sharp from "sharp"
import { join } from "path"
import chalk from "chalk"
import type { SponsorsData, Sponsor } from "../sponsors/sponsors"
import { slugify } from "markdown-to-jsx"

const sponsorJSON = join(process.cwd(), "sponsors", "sponsors.json")
const sponsorsImagesDir = join(process.cwd(), "public", "sponsors", "images")
const existingData = JSON.parse(
  readFileSync(sponsorJSON, "utf8"),
) as SponsorsData
const existingTitles = existingData.sponsors.map((s: Sponsor) =>
  s.title.toLowerCase(),
)

const res = await inquirer.prompt([
  {
    type: "input",
    message: "Sponsor Title",
    name: "title",
    validate(value) {
      if (!value.trim()) {
        return "Title is required"
      }

      if (existingTitles.includes(value.toLowerCase())) {
        return "Sponsor with this title already exists"
      }

      return true
    },
  },
  {
    type: "input",
    message: "Path to sponsor image",
    name: "imagePath",
    validate: async value => {
      try {
        if (
          !value.endsWith(".jpg") &&
          !value.endsWith(".png") &&
          !value.endsWith(".jpeg") &&
          !value.endsWith(".webp")
        ) {
          return "Unsupported extension. Expected one of: .jpg, .png, .jpeg, .webp"
        }

        const fileExists = existsSync(value)

        if (!fileExists) {
          return "File does not exist"
        }

        const image = sharp(value)
        const metadata = await image.metadata()

        if (!metadata.width || !metadata.height) {
          return "Image dimensions are not available"
        }

        if (metadata.width < 878 || metadata.height < 497) {
          return "Image dimensions must be at least 878x497"
        }

        if (metadata.height > metadata.width) {
          return "Image height must be less than or equal to image width"
        }

        return true
      } catch (error) {
        return (error as Error).message
      }
    },
  },
  {
    type: "input",
    message: "Alt text for image",
    name: "alt",
    validate(value) {
      if (!value.trim()) {
        return "Alt text is required for accessibility"
      }
      return true
    },
  },
  {
    type: "list",
    message: "Choose a social platform",
    name: "platform",
    choices: ["Github", "𝕏 / Twitter", "Post anonymously"],
    default: "Github",
  },
])

let author: string | null = null
let displayName: string | null = null

if (res.platform !== "Post anonymously") {
  author = (
    await inquirer.prompt([
      {
        type: "input",
        message: res.platform + " Handle",
        name: "author",
        validate(value) {
          if (!value.match(/^@?[a-zA-Z0-9_]{2,}$/)) {
            return `Invalid ${res.platform} handle`
          }

          return true
        },
      },
    ])
  ).author

  displayName = (
    await inquirer.prompt([
      {
        type: "input",
        message: "Display Name (optional)",
        name: "displayName",
        default: author ?? "Anonymity",
      },
    ])
  ).displayName
}

// const imageFileName = `${res.title.toLowerCase().replace(/\s+/g, "")}.jpg`
const slug = slugify(res.title) + ".jpg"
const image = await sharp(res.imagePath)
  .resize(800, null)
  .jpeg({ mozjpeg: true })
  .toBuffer()

writeFileSync(join(sponsorsImagesDir, slug), image)

let handle: string | null = null

if (author) {
  const strippedHandle = author.replace(/^@/, "")

  if (res.platform === "Github") {
    handle = "https://github.com/" + strippedHandle
  } else {
    handle = "https://x.com/" + strippedHandle
  }
}

const sponsorData: Sponsor = {
  title: res.title,
  author: "",
  displayName: "",
  image: `/sponsors/images/${slug}`,
  alt: res.alt,
}

if (handle) {
  sponsorData.author = handle
}

if (displayName) {
  sponsorData.displayName = displayName
}

const sponsorsData = existingData
sponsorsData.sponsors.push(sponsorData)

writeFileSync(sponsorJSON, JSON.stringify(sponsorsData, null, 2), "utf8")

console.log(
  chalk.green("New sponsor added successfully:"),
  chalk.cyan(res.title),
)
console.log(
  chalk.green("Sponsor image saved to:"),
  chalk.cyan(`public/sponsors/images/${slug}`),
)
