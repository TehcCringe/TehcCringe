# article metadata

Articles are written in markdown and have a few metadata fields near the top:

```md
---
title: Prime, Theo to Fight at UFC over Skill Issue Controversy
date: 2024-11-21
tags: 
  - tech
  - news
  - neovim
author: https://github.com/IroncladDev
displayName: IroncladDev
---

[article content...]
```

| Field       | Description                             | Type            | Required |
| ----------- | --------------------------------------- | --------------- | -------- |
| title       | The title/headline of the article       | string          | yes      |
| date        | The date the article was published      | date            | yes      |
| tags        | Tags for the article                    | list of strings | no       |
| author      | URL to the author's Github or X profile | string          | no       |
| displayName | The author's display name               | string          | no       |
