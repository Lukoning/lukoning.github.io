---
# https://vitepress.dev/reference/default-theme-home-page
createdDate: 2026-02-09T12:53:42+08:00
layout: home
title: 主页：提瓦特大陆
description: 欢迎进入白河豚的站~
order: 0
hero:
  name: "I'm <em>Lukoning</em>"
  text: " also<em><lkn c green> Ao</lkn><lkn c yellow>hina</lkn></em>"
  tagline: "<lkn layout micro style='padding-bottom: 6px'><em><b>也可以叫我「白河豚🌻」，本站几乎都是这个署名哦</b></em></lkn>‘ ‘  あ さ ひ よ 、 の ぼ る な  ’ ’ \n—— 佐 倉 綾 音 / 花 譜 《 あ さ ひ 》 "
  image:
    src: /avatar.jpg #记得去CSS里同步修改--vp-home-hero-image-background-image哦
    alt: 头像
  actions:
    - theme: brand
      text: 转至导航
      link: \#全站导航
    - theme: alt
      text: 饭能市
      link: /ACG/
    - theme: alt
      text: 虚空网络
      link: /DevJournal/
    - theme: alt
      text: 蔬菜罐罐汤
      link: /Murmurs/

features:
  - title: "关于<em><lkn c green> Ao</lkn><lkn c yellow>hina</lkn></em>"
    details: "这个名字来自 ヤマノススメ(向山进发) 的两位主角 <lkn c green><ruby>雪村あおい<rp>(</rp><rt>Yukimura <c>Ao</c>i</rt><rp>)</rp></ruby></lkn> 和 <lkn c yellow><ruby>倉上ひなた<rp>(</rp><rt>Kuraue <c>Hina</c>ta</rt><rp>)</rp></ruby></lkn>。顺带一提，头像上也是她们。<a link href='ACG/ymnssm-Introduction'>了解ヤマノススメ -></a>"
  - title: "关于「白河豚🌻」"
    details: "这个名字嘛……「白河豚」即「百合豚」；而「🌻」则是： 雪村あおい/倉上ひなた -> 雪村葵/仓上日向 -> 葵日向 ->「向日葵」，跟<em><lkn c green>Ao</lkn><lkn c yellow>hina</lkn></em>这个名字同源哦。<a link href='Murmurs/about-my-names'>关于我的「名字」 -></a>"
  - title: "碎碎念…"
    details: "其实从这个站点的内容上能看出，此人是有亿点抽象且成分极为复杂之人。好吧我摊牌了其实我是来自外星的伪人我将攻入地球⚠️⚠️⚠️"
  - title: "MBTI？"
    details: "我知道你没问，也许你不想知道。<br/>但是高Ti+INFP会擦出什么花火呢？"
---

<lkn layout box-center>

<script setup>
  import { useData } from 'vitepress'
  const { theme } = useData();
  const sb = theme.value.sidebar.map(item => ({ ...item })); //theme是只读数组，要修改的话得转换为新数组
  const items =  {
    hanno: sb.filter(item => item.text === "饭能市"),
    dev: sb.filter(item => item.text === "虚空网络"),
    anyt: sb.filter(item => item.text === "蔬菜罐罐汤"),
  };
</script>

<lkn layout text-center>
<lkn layout box-center >

### 全站导航

<lkn layout small><em>部分页面使用深色模式浏览更佳。</em></lkn>

</lkn>

<details open>
<summary style="cursor: pointer; width: fit-content; margin-inline: auto;">点击收起/展开</summary>

:::tabs

== 饭能市
<lkn layout box-center>
<CNavTree :items="items.hanno" />
</lkn>

== 虚空网络
<lkn layout box-center>
<CNavTree :items="items.dev" />
</lkn>

== 蔬菜罐罐汤
<lkn layout box-center>
<CNavTree :items="items.anyt" />
</lkn>

:::
</details>

</lkn>

---

<lkn layout text-center box-center>

# 欢迎来到「提瓦特大陆」

欢迎你~！

</lkn>

不论你是旅行者、开拓者、管理员、漂泊者、异能者、博士、老师、猎人小姐、队长、舰长、指挥官、绳匠……

---

<lkn layout box-center>

提瓦特大陆位于提瓦特之上。

提瓦特是被虚假之天包裹住的星球。

「真实之月」已经坠入虚假之天内，它的投影随之消失。

天外旅者的飞船也就此“重回提瓦特”。

「空月」的故事告一段落……

「旅行者，你将要去往何方？」

</lkn>

---

<lkn layout box-center>

“并不是我们选择将武器改造成玩具，才为民众换来了安乐的生活。

“而是我们用武器赢来了安乐的生活，才让它有了被改造成玩具的机会。”

*—— 礁与浪的相逢•其三「留给孩子们的『玩具』」*

</lkn>

---

<lkn layout text-center>
我们『团结』一心

经受『回火』洗礼

肩负『祝福』古名

知晓『力量』真意

接纳『奉献』命运

终迎『超越』之火

为了纳塔！

为了纳塔！！

*—— 第五章•第三幕「绝望高悬天之上」*
</lkn>

</lkn>