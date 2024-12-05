# article syntax reference

This doc covers the syntax for writing TehcCringe articles.

Each article is a directory in the `articles` directory.

```
articles
├── article-title
│   ├── cover.png
│   ├── index.md
│   └── [...static files]
└── [...articles]
```

The `index.md` file consists of the article content as well as some information such as Title, Date, Tags, Author, etc.

[Most basic markdown syntax](app/components/markdown/index.tsx) is supported.

## Embedding Images

To embed an image in your article, simply add an image into your article directory

```
articles
└── my-article
    ├── cover.png
    ├── index.md
    └── meme.png
```

Then reference the image in your article's `index.md` file:

```md
![A funny meme](meme.png)
```

## Metadata / Frontmatter

All articles have some frontmatter fields near the top:

```md
---
title: Article Title
date: 2024-11-21
tags: 
  - tech
  - news
  - neovim
author: https://github.com/TehcCringe
displayName: TehcCringe
---

[article content...]
```

### Title

The title of the article.

- Type: `string`
- Required: `yes`

```
---
title: Article Title
---
```

### Date

The date the article was published in the format `YYYY-MM-DD`.

- Type: `date`
- Required: `yes`

```
---
date: 2024-11-21
---
```

### Tags

Tags for the article. The first tag will be used as the article's category. If not provided, the category will be `NEWS`.

- Type: `list of strings`
- Required: `no`

```
---
tags: 
  - tech
  - news
  - neovim
---
```

### Author

URL to the author's Github or X profile. If not provided, the article will be published and displayed as anonymous.

- Type: `string`
- Required: `no`

```
---
author: https://github.com/TehcCringe
---
```

### Display Name

The author's display name. If not provided, falls back to the author URL.

- Type: `string`
- Required: `no`

```
---
displayName: TehcCringe
---
```
