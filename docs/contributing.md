# contributing

If you're interested in writing your own article or contributing to the project, you've come to the right place.

## quickstart

### prerequisites

1. Ensure you have [Bun](https://bun.sh) installed on your machine
2. Fork and clone the repository
3. Run `bun install` to install dependencies

### write an article

**Before you start**

- Read the [Rules](rules.md)
- Read the [Style Guide](style-guide.md)
- Read the [Article Syntax Reference](syntax.md)

1. Think of a good headline and cover image for your article
2. Run `bun new:article` to open an interactive prompt
3. Fill out the information in the prompt
4. Navigate to the generated article directory and edit the `index.md` file

### development

TehcCringe is a statically-generated Next.js site. To develop locally:

1. Run `bun dev` to start the development server
2. Navigate to [http://localhost:3000](http://localhost:3000) to view the website

## Pull Requests

### new articles

1. Set the PR title to the article headline
2. No description required

### documentation

1. Prefix the PR title with `docs:`
2. Briefly describe your changes

### website/ci/script changes

1. Prefix the PR title with `fix:`, `feat:`, or `chore:`
2. Describe your changes in detail

### misc

1. Funny commit messages are encouraged
2. Try to keep PRs as a single commit to avoid causing merge conflicts (optional)
3. If you're unsure about something, you can ask for help in the [Discord](https://discord.gg/vSwdyDAsUn)
