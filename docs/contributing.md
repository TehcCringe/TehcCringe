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

## pull requests

There is a default template for pull requests.

To check off an item, add an `x` in between the brackets `[ ]`. For example:

```md
## would your mom approve of this PR?

- [x] Yes 
- [ ] No

If you selected no, please explain why
```

### new articles

1. Under **what does this PR do?**, select **Adds a new article**
2. Select **If you are adding a new article, why is it funny?** and provide a brief explanation of why the article is funny
3. Check off everything in the checklist
4. Ensure your mom would approve of the PR

### features, bugs, and tech debt

1. Under **what does this PR do?**, select **Fixes a bug / Implements a feature**
2. Select **If you are implementing a feature, why is it important?** and provide a detailed explanation of why the feature is important
3. Check off everything in the checklist
4. Select **Yes** under **would your mom approve of this PR?**

### misc

1. Funny commit messages are encouraged
2. Try to squash your commits to avoid causing merge conflicts (optional, but preferred)
3. If you're unsure about something or would like to get in touch with a maintainer, you can ask for help in the [Discord](https://tehccringe.com/discord)
