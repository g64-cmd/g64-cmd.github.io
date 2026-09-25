# g64-cmd.github.io

个人博客，使用 GitHub Pages 和 Jekyll 发布。

## 写一篇新文章

在 `_posts` 文件夹中新建 `YYYY-MM-DD-文章名.md`，例如 `2026-09-25-test.md`：

```markdown
---
layout: post
title: "文章标题"
date: 2026-09-25 12:48:00 +0800
---

文章正文。
```

文章发布后会自动出现在首页。文章日期如果晚于当前时间，Jekyll 默认不会显示它。

在仓库 **Settings → Pages** 中，确认发布来源为 `Deploy from a branch`，分支为 `main`，文件夹为 `/ (root)`。
