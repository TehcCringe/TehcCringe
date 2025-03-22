import inquirer from "inquirer"
import { mkdirSync, readdirSync, writeFileSync } from "fs"
import { join } from "path"
import chalk from "chalk"
import type { SponsorJsonType } from "../app/lib/sponsors"
import { slugify } from "markdown-to-jsx"
import { generateImageBuffer, validateLocalImagePath } from "./utils"

const res = await inquirer.prompt([
  {
    type: "input",
    message: "Sponsor Title",
    name: "title",
    validate(value) {
      if (!value.trim()) {
        return "Title is required"
      }

      const sponsorsDir = join(process.cwd(), "sponsors")
      const sponsorsChildren = readdirSync(sponsorsDir)

      if (sponsorsChildren.includes(slugify(value))) {
        return "Sponsor with this title already exists"
      }

      return true
    },
  },
  {
    type: "input",
    message: "Path to sponsor image",
    name: "imagePath",
    validate: validateLocalImagePath,
  },
  {
    type: "input",
    message: "Sponsor Message",
    name: "description",
    validate(value) {
      if (!value.trim()) return "Message is required"

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

const slug = slugify(res.title)
const sponsorDir = join(process.cwd(), "sponsors", slug)
const image = await generateImageBuffer(res.imagePath)

mkdirSync(join(process.cwd(), "sponsors", slug))
writeFileSync(join(sponsorDir, "cover.png"), image)

let handle: string | null = null

if (author) {
  const strippedHandle = author.replace(/^@/, "")

  if (res.platform === "Github") {
    handle = "https://github.com/" + strippedHandle
  } else {
    handle = "https://x.com/" + strippedHandle
  }
}

const sponsorData: Partial<SponsorJsonType> = {
  title: res.title,
}

if (handle) sponsorData.author = handle
if (displayName) sponsorData.displayName = displayName

writeFileSync(
  join(sponsorDir, "index.md"),
  `---
${Object.entries(sponsorData)
  .map(([key, value]) => `${key}: "${value}"`)
  .join("\n")}
---

${res.description}`,
)

console.log(chalk.green("Sponsor created at:"), chalk.cyan(`sponsors/${slug}`))
