import { GitHub } from "@actions/github/lib/utils"
import { Context } from "@actions/github/lib/context"
import * as core from "@actions/core"
import { existsSync, readFileSync } from "fs"
import { dirname, join } from "path"
import { getArticle } from "@/app/lib/articles"
import TwitterApi from "twitter-api-v2"
import { AttachmentBuilder, EmbedBuilder, WebhookClient } from "discord.js"
import { AtpAgent } from "@atproto/api"

interface ScriptParams {
  github: InstanceType<typeof GitHub>
  context: Context
  core: typeof core
}

const bskyAgent = new AtpAgent({
  service: "https://bsky.social",
})

const xClient = new TwitterApi({
  appKey: process.env.X_API_KEY as string,
  appSecret: process.env.X_API_KEY_SECRET as string,
  accessToken: process.env.X_ACCESS_TOKEN as string,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET as string,
})

const webhook = new WebhookClient({
  url: process.env.DISCORD_WEBHOOK_URL as string,
})

/**
 * Runs after a Pull Request is merged.
 *
 * 1. Derives a list of changed files
 * 2. Checks to see if the files are in the `articles/` directory
 * 3. If the files exist, sends a tweet with the new article
 */
async function run({ github, context, core }: ScriptParams) {
  const { owner, repo } = context.repo
  const pullRequest = context.payload.pull_request

  if (!pullRequest) {
    core.setFailed("This action only works on pull_request events")
    return
  }

  const currentUser = await xClient.v2.me()

  if (!currentUser) {
    core.setFailed("Failed to authenticate with Twitter API")
    return
  }

  console.log("Authenticated as", JSON.stringify(currentUser, null, 2))

  const response = await github.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: pullRequest.number,
  })

  // Get all the article index.md files that match added files
  const articleSlugs = response.data
    .filter(file => file.status === "added")
    .filter(
      file =>
        file.filename.startsWith("articles/") &&
        file.filename.endsWith("index.md"),
    )
    .filter(file => existsSync(file.filename))
    .map(file => dirname(file.filename).split("/").at(1))
    .filter(slug => typeof slug === "string")

  console.log("Added Articles:", articleSlugs)

  // Time out the CI job after 15 minutes
  const timeoutFallback = setTimeout(
    () => {
      core.setFailed("Process Timed out")
      return
    },
    15 * 60 * 1000,
  )

  const broadcastArticle = async (slug: string) => {
    const article = getArticle(slug)

    const articleUrl = `https://tehccringe.com/news/${slug}`
    const coverImagePath = join(process.cwd(), "articles", slug, "cover.png")

    const shortenedUrl = await fetch(
      `https://tinyurl.com/api-create.php?url=${articleUrl}`,
    ).then(res => res.text())
    const shortenedUrlWithoutHttp = shortenedUrl.replace(/^https?:\/\//, "")

    const cover = readFileSync(coverImagePath)
    const titleWithLink = cover + " " + shortenedUrlWithoutHttp

    // Twitter
    const mediaId = await xClient.v1.uploadMedia(coverImagePath)
    await xClient.v2.tweet(titleWithLink, {
      media: {
        media_ids: [mediaId],
      },
    })

    // Discord
    const attachment = new AttachmentBuilder(cover, { name: "cover.png" })
    const embed = new EmbedBuilder()
      .setTitle(article.data.title)
      .setURL(articleUrl)
      .setImage("attachment://cover.png")

    await webhook.send({ embeds: [embed], files: [attachment] })

    // Bluesky
    const { data } = await bskyAgent.uploadBlob(Buffer.from(cover), {
      encoding: "image/png",
    })
    await bskyAgent.post({
      text: titleWithLink,
      embed: {
        images: [{ alt: titleWithLink, image: data.blob }],
      },
      createdAt: new Date().toISOString(),
    })

    console.log("Successfully Broadcasted:", article.data.title)
  }

  const deploymentInterval = setInterval(async () => {
    console.log("Checking if added articles have been deployed...")

    for (const article of articleSlugs) {
      const content = await fetch(`https://tehccringe.com/news/${article}`)

      if (content.status === 404) {
        console.log(
          `Awaiting deployment of "${article}". Retrying in 10 seconds`,
        )
        return
      }

      if (!bskyAgent.sessionManager.session) {
        await bskyAgent.login({
          identifier: process.env.BSKY_HANDLE as string,
          password: process.env.BSKY_PASSWORD as string,
        })
      }

      await broadcastArticle(article)
    }

    clearInterval(deploymentInterval)
    clearTimeout(timeoutFallback)
  }, 10000)

  core.setOutput("Broadcast", `${articleSlugs.length} articles`)
}

export { run }
