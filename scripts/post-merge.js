var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// scripts/post-merge.ts
var exports_post_merge = {};
__export(exports_post_merge, {
  default: () => run
});
module.exports = __toCommonJS(exports_post_merge);
async function run({ github, context, core }) {
  const { owner, repo } = context.repo;
  const pullRequest = context.payload.pull_request;
  if (!pullRequest) {
    core.setFailed("This action only works on pull_request events");
    return;
  }
  const response = await github.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: pullRequest.number
  });
  const changedFiles = response.data.map((file) => file.filename);
  core.setOutput("changed_files", changedFiles);
  console.log("Changed files:", changedFiles);
}
