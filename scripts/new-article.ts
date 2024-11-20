import inquirer from "inquirer";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from "fs";
import sharp from "sharp";
import { slugify } from "@/app/lib/utils";
import { join } from "path";

const res = await inquirer.prompt([
  {
    type: "input",
    message: "Article Title",
    name: "title",
    validate(value) {
      const articlesDir = join(process.cwd(), "articles");
      const articlesChildren = readdirSync(articlesDir);

      if (articlesChildren.includes(slugify(value))) {
        return "Article with this title already exists";
      }

      return true;
    },
  },
  {
    type: "input",
    message: "Path to cover image",
    name: "cover",
    validate: async (value) => {
      try {
        if (
          !value.endsWith(".jpg") &&
          !value.endsWith(".png") &&
          !value.endsWith(".jpeg") &&
          !value.endsWith(".webp")
        ) {
          return "Unsupported extension. Expected one of: .jpg, .png, .jpeg, .webp";
        }

        const fileExists = existsSync(value);

        if (!fileExists) {
          return "File does not exist";
        }

        const image = sharp(value);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
          return "Image dimensions are not available";
        }

        if (metadata.width < 878 || metadata.height < 497) {
          return "Image dimensions must be at least 878x497";
        }

        if (metadata.height > metadata.width) {
          return "Image height must be less than or equal to image width";
        }

        return true;
      } catch (error) {
        return (error as Error).message;
      }
    },
  },
  {
    type: "list",
    message: "Choose a social platform",
    name: "platform",
    choices: ["Github", "𝕏 / Twitter", "Post anonymously"],
    default: "Github",
  },
]);

let author: string | null = null;
let displayName: string | null = null;

if (res.platform !== "Post anonymously") {
  author = (
    await inquirer.prompt([
      {
        type: "input",
        message: res.platform + " Handle",
        name: "author",
        validate(value) {
          if (!value.match(/^@?[a-zA-Z0-9_]{2,}$/)) {
            return `Invalid ${res.platform} handle`;
          }

          return true;
        },
      },
    ])
  ).author;

  displayName = (
    await inquirer.prompt([
      {
        type: "input",
        message: "Display Name (optional)",
        name: "displayName",
        default: author ?? "",
      },
    ])
  ).displayName;
}

const slug = slugify(res.title);

mkdirSync(join(process.cwd(), "articles", slug));

const articleDir = join(process.cwd(), "articles", slug);

const cover = await sharp(res.cover)
  .resize(878, null)
  .jpeg({ mozjpeg: true })
  .toBuffer();

writeFileSync(join(articleDir, "cover.png"), cover);

let handle: string | null = null;

if (author) {
  const strippedHandle = author.replace(/^@/, "");

  if (res.platform === "Github") {
    handle = "https://github.com/" + strippedHandle;
  } else {
    handle = "https://x.com/" + strippedHandle;
  }
}

writeFileSync(
  join(articleDir, "index.md"),
  `---
title: ${res.title}
slug: ${slug}
${handle ? `author: ${handle}` : ""}
${displayName ? `displayName: ${displayName}` : ""}
---

Lorem Ipsum dolor sit amet
`
);

console.log("Article created at", `articles/${slug}`);
