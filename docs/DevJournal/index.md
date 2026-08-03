---
createdDate: 2026-02-11T16:55:09+08:00
title: 虚空网络
order: 41735173
placeDocInfoAtBottom: true
---

# 欢迎接入「虚空网络」

这里是提瓦特最成熟的意识互联网络系统。

请放心，本网络系统已经经过改造，不再会窃取你的大脑算力，请放心接入网络。

今晚好梦。

<script setup>
  import { useData } from 'vitepress'
  const { theme } = useData();
  const items = theme.value.sidebar.filter(item => item.text === "虚空网络")[0].items;
</script>

::: info 请收下罐装知识：
<CNavTree :items="items" />
:::