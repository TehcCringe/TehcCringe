import inquirer from "inquirer"
import { mkdirSync, readdirSync, writeFileSync } from "fs"
import { slugify } from "@/app/lib/utils"
import { join } from "path"
import chalk from "chalk"
import { generateImageBuffer, validateLocalImagePath } from "./utils"

const res = await inquirer.prompt([
  {
    type: "input",
    message: "Article Title",
    name: "title",
    validate(value) {
      if (!value.trim()) {
        return "Title is required"
      }

      const articlesDir = join(process.cwd(), "articles")
      const articlesChildren = readdirSync(articlesDir)

      if (articlesChildren.includes(slugify(value))) {
        return "Article with this title already exists"
      }

      return true
    },
  },
  {
    type: "input",
    message: "Path to cover image",
    name: "cover",
    validate: validateLocalImagePath,
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
        default: author ?? "",
      },
    ])
  ).displayName
}

const slug = slugify(res.title)

mkdirSync(join(process.cwd(), "articles", slug))

const articleDir = join(process.cwd(), "articles", slug)
const cover = await generateImageBuffer(res.cover)

writeFileSync(join(articleDir, "cover.png"), cover)

let handle: string | null = null

if (author) {
  const strippedHandle = author.replace(/^@/, "")

  if (res.platform === "Github") {
    handle = "https://github.com/" + strippedHandle
  } else {
    handle = "https://x.com/" + strippedHandle
  }
}

const articleData: Record<string, string> = {
  title: res.title,
  date: new Date().toISOString().split("T")[0],
  tags: `\n  - news\n  - tech`,
}

if (handle) {
  articleData.author = handle
}

if (displayName) {
  articleData.displayName = displayName
}

writeFileSync(
  join(articleDir, "index.md"),
  `---
${Object.entries(articleData)
  .map(
    ([key, value]) =>
      `${key}: ${key === "tags" || key === "date" ? value : `"${value}"`}`,
  )
  .join("\n")}
---

Bacon ipsum dolor amet pancetta short ribs doner, meatball pork loin pastrami bacon t-bone ham spare ribs
`,
)

console.log(chalk.green("Article created at"), chalk.cyan(`articles/${slug}`))
