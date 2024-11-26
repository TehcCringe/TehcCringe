import { GitHub } from "@actions/github/lib/utils";
import { Context } from "@actions/github/lib/context";
import * as core from "@actions/core";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { getArticle } from "@/app/lib/articles";
import { TwitterApi } from "twitter-api-v2";

interface ScriptParams {
  github: InstanceType<typeof GitHub>;
  context: Context;
  core: typeof core;
}

/**
 * Runs after a Pull Request is merged.
 *
 * 1. Derives a list of changed files
 * 2. Checks to see if the files are in the `articles/` directory
 * 3. If the files exist, sends a tweet with the new article
 */
async function run({ github, context, core }: ScriptParams) {
  const { owner, repo } = context.repo;
  const pullRequest = context.payload.pull_request;

  if (!pullRequest) {
    core.setFailed("This action only works on pull_request events");
    return;
  }

  const response = await github.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: pullRequest.number,
  });

  const changedFiles = response.data.map((file) => file.filename);

  const changedArticleContentFiles = changedFiles
    .filter((file) => file.startsWith("articles/") && file.endsWith("index.md"))
    .filter(existsSync);

  console.log(typeof process.env.X_API_KEY);
  console.log(typeof process.env.X_API_KEY_SECRET);
  console.log(typeof process.env.X_ACCESS_TOKEN);
  console.log(typeof process.env.X_ACCESS_TOKEN_SECRET);

  const client = new TwitterApi({
    appKey: process.env.X_API_KEY as string,
    appSecret: process.env.X_API_KEY_SECRET as string,
    accessToken: process.env.X_ACCESS_TOKEN as string,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET as string,
  });

  for (const file of changedArticleContentFiles) {
    const articleDir = dirname(file);

    const articleSlug = articleDir.split("/").at(-1);

    if (!articleSlug) {
      console.log("Invalid article slug:", articleSlug);
      continue;
    }

    const article = getArticle(articleSlug);

    const articleUrl = `https://tehccringe.com/news/${articleSlug}`;

    const shortenedUrl = await fetch(
      `https://tinyurl.com/api-create.php?url=${articleUrl}`
    ).then((res) => res.text());
    const shortenedUrlWithoutHttp = shortenedUrl.replace(/^https?:\/\//, "");

    const mediaId = await client.v1.uploadMedia(join(articleDir, "cover.png"));
    const newTweet = await client.v1.tweet(article.data.title + " " + shortenedUrlWithoutHttp, { media_ids: mediaId });

    console.log("New tweet:", newTweet);
  }

  core.setOutput("changed_files", changedFiles);
  console.log("Changed files:", changedFiles);
}

export { run };
