import { GitHub } from "@actions/github/lib/utils";
import { Context } from "@actions/github/lib/context";
import * as core from "@actions/core";
import { existsSync } from "fs";
import { dirname } from "path";
import { getArticle } from "@/app/lib/articles";

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

  console.log(typeof process.env.X_API_KEY, "X_API_KEY");
  console.log(typeof process.env.X_API_KEY_SECRET, "X_API_KEY_SECRET");
  console.log(typeof process.env.X_ACCESS_TOKEN, "X_ACCESS_TOKEN");
  console.log(
    typeof process.env.X_ACCESS_TOKEN_SECRET,
    "X_ACCESS_TOKEN_SECRET"
  );

  for (const file of changedArticleContentFiles) {
    const articleDir = dirname(file);

    const articleSlug = articleDir.split("/").at(-1);

    if (!articleSlug) {
      console.log("Invalid article slug:", articleSlug);
      continue;
    }

    await postTweet(articleSlug);
  }

  core.setOutput("changed_files", changedFiles);
  console.log("Changed files:", changedFiles);
}

async function postTweet(articleSlug: string) {
  const article = getArticle(articleSlug);

  const articleUrl = `https://tehccringe.com/news/${articleSlug}`;

  const shortenedUrl = await fetch(
    `https://tinyurl.com/api-create.php?url=${articleUrl}`
  ).then((res) => res.text());
  const shortenedUrlWithoutHttp = shortenedUrl.replace(/^https?:\/\//, "");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    `OAuth oauth_consumer_key="${process.env.X_API_KEY}",oauth_token="${process.env.X_ACCESS_TOKEN}",oauth_signature_method="HMAC-SHA1",oauth_version="1.0"`
  );

  const raw = JSON.stringify({
    text: `${article.data.title} ${shortenedUrlWithoutHttp}`,
  });

  fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

export { run };
