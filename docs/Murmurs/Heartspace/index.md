---
createdDate: 2026-03-28T18:21:26+08:00
title: 个中诗文
order: 10
placeDocInfoAtBottom: true
---

# 个中诗文

*「欢迎来到某人的情感世界。」*

<script setup>
  import { useData } from 'vitepress'
  const { theme } = useData();
  const items = theme.value.sidebar.filter(item => item.text === "蔬菜罐罐汤")[0].items.filter(item => item.text === "个中诗文")[0].items;
</script>

::: info *你将听到以下内容：*
<CNavTree :items />
:::

