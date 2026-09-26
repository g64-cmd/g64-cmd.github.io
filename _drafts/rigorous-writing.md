---
title: 如何判断一次学习是否真的有效
date: 2026-09-22 09:00:00 +0800
updated: 2026-09-25
kind: 长文
tags: [学习方法, 评估]
description: 一个用于讨论的简化框架：区分即时表现、延迟回忆和迁移能力，再讨论证据的边界。
math: true
---

这是一篇**本地排版测试草稿**，用于展示长文、公式、图注与脚注的写法。以下数值均为示意，不代表真实研究结果。

## 问题与范围

“刚刚看懂”和“过几天仍然能解释”不是相同的观察指标。我们把一次学习活动的结果拆成几个可以分别描述的量。[^scope]

### 指标定义

令 $$r_i$$ 表示第 $$i$$ 次延迟回忆的结果，最简单的平均值为：

$$
\bar{r} = \frac{1}{n}\sum_{i=1}^{n} r_i
$$

这个数字只描述被观察到的任务，不自动说明迁移能力。

## 一个简化的例子

| 观察项目 | 即时练习 | 延迟回忆 | 新情境迁移 |
| --- | --- | --- | --- |
| 示例 A | 8 / 10 | 6 / 10 | 4 / 10 |
| 示例 B | 7 / 10 | 7 / 10 | 5 / 10 |

<figure>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 180" role="img" aria-labelledby="learning-figure-title" style="width:100%;height:auto">
    <title id="learning-figure-title">学习证据从即时练习到延迟回忆，再到新情境迁移</title>
    <g fill="none" stroke="currentColor" opacity=".2"><rect x="10" y="35" width="200" height="100" rx="14"/><rect x="260" y="35" width="200" height="100" rx="14"/><rect x="510" y="35" width="200" height="100" rx="14"/><path d="M215 85h40m210 0h40"/></g>
    <g fill="currentColor" text-anchor="middle" font-size="22"><text x="110" y="92">即时练习</text><text x="360" y="92">延迟回忆</text><text x="610" y="92">情境迁移</text></g>
  </svg>
  <figcaption>图 1：不同观察时点与任务条件，提供不同类型的证据。</figcaption>
</figure>

### 实验记录

代码块内的公式标记应该保持原样，不能被公式渲染器改写：

```python
formula = "$$ x^2 + y^2 $$"
observations = [0.6, 0.7, 0.8]
average = sum(observations) / len(observations)
print(average)
```

## 局限与讨论

示例没有控制练习时长、先验知识或测量误差，因此不能据此推断哪种学习方式更好。[^evidence]

较长的表达式应只在公式区域横向滚动：

$$
\operatorname{score}(x_1,\ldots,x_n)=\underbrace{w_1 x_1+w_2 x_2+w_3 x_3+w_4 x_4+w_5 x_5+w_6 x_6+w_7 x_7+w_8 x_8}_{\text{a deliberately long illustrative expression}}
$$

## 参考文献

1. 本文为排版演示，不援引实证研究。正式文章请在此列出作者、年份、标题与来源链接。
2. 外部链接与脚注可以配合使用，为重要论断标明证据位置。

[^scope]: 本文只展示如何组织一个问题，不提供学习效果的实证结论。
[^evidence]: 示例表格中的数字全部为虚构，不能用于比较真实方法。

