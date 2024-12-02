# TehcCringe

An open-source satirical tech news outlet that anyone can contribute to

- [𝕏 / Twitter](https://x.com/TehcCringe)
- [Website](https://tehccringe.com)
- [Github](https://github.com/TehcCringe/TehcCringe)

Join the [Discord](https://discord.gg/vSwdyDAsUn) for support, updates, and unhinged discussions

## how it works

TehcCringe is a static Next.js site hosted on Github Pages.

Whenever a PR containing a new article is merged, a CI job will automatically tweet it.

## contributing

Want to write an article, fix a bug that's been bothering you, or create additional tech debt for the core maintainers?

- Check out the [Contributor Guide](docs/contributing.md)
- Read the [Rules](docs/rules.md)
- Read the [Style Guide](docs/style-guide.md)

## development

1. Fork the [repository](https://github.com/TehcCringe/TehcCringe)
2. Ensure you have [Bun](https://bun.sh) installed
3. Run `bun install` to install dependencies

**To create a new article:**

1. Run `bun run new:article` to create a new article
2. Navigate to the newly created article folder, edit the metadata and write the article content

**To run the site locally:**

1. Run `bun dev` to start the development server

