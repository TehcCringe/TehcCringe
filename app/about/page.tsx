import MarkdownRenderer from "../components/markdown";
import Flex from "../components/ui/flex";

export default function About() {
  return (
    <Flex col p={4} align="center">
      <Flex col gap={4} align="center" className="max-w-[720px]">
        <MarkdownRenderer overrides={{ img: undefined }}>
          {`# About

TehcCringe is an open-source satirical tech news outlet that anyone can contribute to.

## How it works

The website is statically generated using Next.js and hosted on Github Pages.

Whenever an article is approved and merged via a [Github Pull Request](https://github.com/TehcCringe/TehcCringe/pulls), a CI job will automatically publish the article to our [𝕏 / Twitter](https://x.com/TehcCringe) page and [Discord](/discord) server.

## Contributing

Interested in writing your own article, fixing a bug, or creating additional tech debt for the maintainers?

- Check out the [Contributing Guide](https://github.com/TehcCringe/TehcCringe/tree/master/docs/contributing.md)
- Glance at the [Rules](https://github.com/TehcCringe/TehcCringe/tree/master/docs/rules.md)
- Read the [Style Guide](https://github.com/TehcCringe/TehcCringe/tree/master/docs/style-guide.md)

If you're not sure where to start, check out some of the [Pull Requests](https://github.com/TehcCringe/TehcCringe/pulls) and have some friendly conversations in the [Discord](/discord) server.
`}
        </MarkdownRenderer>
      </Flex>
    </Flex>
  );
}
