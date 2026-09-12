---
createdDate: 2026-02-28T22:15:38+08:00
title: 蔬菜罐罐汤
order: 1234567890
placeDocInfoAtBottom: true
prev: false
---

# 欢迎食用「蔬菜罐罐汤」

这里是杂谈和碎碎念的聚集地。嗯，简称杂念(?)

也就是各种东西都可以放在这的意思啦。

<script setup>
  import { useData } from 'vitepress'
  const { theme } = useData();
  const items = theme.value.sidebar.filter(item => item.text === "蔬菜罐罐汤")[0].items;
</script>

::: info 杂念们：
<CNavTree :items />
:::