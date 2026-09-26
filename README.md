# g64-cmd 的博客

一个使用 Jekyll 构建的个人博客。白与灰的简洁界面，支持系统／浅色／深色外观，适合学习记录、随笔和长文。

## 本地预览

已安装 Jekyll 时，在项目目录运行：

```powershell
jekyll serve --host 127.0.0.1 --port 4000
```

浏览器打开 http://127.0.0.1:4000 。要查看四篇排版示例草稿：

```powershell
jekyll serve --drafts --host 127.0.0.1 --port 4000
```

两条命令二选一；先按 Ctrl+C 关闭正在运行的服务再切换。修改配置后需要重启服务。示例草稿带有演示声明，普通构建不会发布它们。

## 写文章

1. 从 `templates/learning.md`、`templates/essay.md` 或 `templates/longform.md` 复制一个模板。
2. 保存到 `_posts/YYYY-MM-DD-英文短名.md`，修改标题、日期、摘要和正文。
3. 本地预览，检查图片、链接和排版，再提交到 GitHub。

```yaml
---
layout: post
title: "文章标题"
date: 2026-09-26 10:00:00 +0800
kind: 学习记录
tags: [计算机, TypeScript]
description: "一两句话说明这篇文章讨论的问题。"
# series: learning-notes
# series_order: 1
# updated: 2026-09-27
# math: true
---
```

- **形式 `kind`**：学习记录／随笔／长文，省略时为随笔。一篇只选一种。
- **主题 `tags`**：自由填写多个标签，非技术文章同样适用。尽量复用已有名称，避免“JS”和“JavaScript”分散为两个标签。
- **摘要 `description`**：建议手写；未填写时从文章开头提取。
- **日期 `date`**：记得修改模板日期。未来日期默认不发布。
- **更新时间 `updated`**：可选，只有填写时才显示。
- **草稿**：放入 `_drafts/英文短名.md`，只有加上 `--drafts` 才参与构建。发布时移动到 `_posts` 并加日期文件名前缀。
- **网址**：新文章采用 `/年/月/日/英文短名/`，与形式、主题和系列无关。既有测试文章通过独立 `permalink` 保留原网址；发布后不要随意更改日期、文件名或 permalink。

## 组织系列

系列定义集中放在 `_series`。复制 `templates/series.md` 到 `_series/your-series.md`，填写：

```yaml
---
title: "操作系统学习笔记"
slug: your-series
description: "从进程与线程开始，建立可以通过实验验证的理解。"
---
```

文件名和 `slug` 保持一致，使用小写英文与连字符。文章里填写 `series: your-series` 和整数 `series_order: 1`，后续篇序递增且不重复。系列页与文章前后篇导航会自动生成。没有已发布文章的系列不会出现在首页或系列总览。

`_series/learning-notes.md` 是示例系列定义，可重命名并修改，或在不再需要示例时删除；同步调整引用它的草稿。

## 长文写法

- 二、三级标题自动生成目录；桌面宽屏显示在侧边，窄屏折叠在正文前。
- 代码用三个反引号包裹，并标明语言，如 javascript、python、typescript。
- 添加 `math: true` 后支持公式。行内使用 `$$x^2$$`；独立公式将 `$$` 分别放在公式前后的独立行，并在整块前后留空行。这是当前 Kramdown 配置的 Markdown 约定。
- 公式库为本地固定版本 KaTeX 0.16.22；不依赖 CDN，不解析代码块内的公式。未开脚本时保留公式源码。
- 脚注写作 `正文[^note]`，文末写 `[^note]: 注释内容。`
- 参考文献使用文末有序列表，手动填写作者、标题、年份与来源链接。

图片建议放到 `assets/images/文章短名/`。需要图注时：

```html
<figure>
  <img src="{{ '/assets/images/example/figure.png' | relative_url }}" alt="图片内容的简短描述" width="1200" height="800">
  <figcaption>图 1：图片说明。</figcaption>
</figure>
```

图片可按实际尺寸修改 width、height。支持浏览器打印，打印时隐藏导航、目录和操作按钮。

## 本地检查

```powershell
jekyll build --drafts
node scripts/verify.mjs --drafts
jekyll build
node scripts/verify.mjs
git diff --check
```

不要与运行中的预览服务同时往同一个 `_site` 构建。检查脚本验证本地链接、脚注锚点、资源路径、系列元数据，以及生产构建不含示例草稿与模板。浏览器检查还应包括：375／768／1440px，浅色与深色，组合筛选、URL 恢复、代码复制、长公式和键盘导航。

## 发布

本地确认后提交源文件并推送。GitHub Pages 若使用分支发布，来源应为 `main`、`/(root)`；然后检查 Pages 构建与线上首页、文章和系列页面。

`_site`、缓存、模板、检查脚本不会作为站点页面发布；示例草稿默认不构建。无自定义 Jekyll 插件。样式与核心导航不依赖 JavaScript；搜索、外观选择、目录增强、代码复制和公式渲染使用少量浏览器脚本。
