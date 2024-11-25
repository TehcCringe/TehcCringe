import { GitHub } from "@actions/github/lib/utils";
import { Context } from "@actions/github/lib/context";
import * as core from "@actions/core";

interface ScriptParams {
  github: InstanceType<typeof GitHub>;
  context: Context;
  core: typeof core;
}

export default async function run({ github, context, core }: ScriptParams) {
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

  core.setOutput("changed_files", changedFiles);
  console.log("Changed files:", changedFiles);
}
