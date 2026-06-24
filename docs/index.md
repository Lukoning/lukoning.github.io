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
      text: 转至导航树
      link: \#导航树
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
    details: "这个名字嘛……<br>「白河豚」即「百合豚」，<br>而「🌻」跟<em><lkn c green>Ao</lkn><lkn c yellow>hina</lkn></em>同源哦。<br><a link href='Murmurs/about-my-names'>关于我的「名字」 -></a>"
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
  Object.keys(items).forEach( key => items[key][0].collapsed = undefined)
</script>

<lkn layout text-center>
<lkn layout box-center >

### 导航树

<lkn layout small><em>部分页面使用深色模式浏览更佳。</em></lkn>

</lkn>

<details open>
<summary style="cursor: pointer; width: fit-content; margin-inline: auto;">点击收起/展开</summary>

:::tabs

== 饭能市
<lkn layout box-center>
<em>ACG文化</em>
<CNavTree :items="items.hanno" />
</lkn>

== 虚空网络
<lkn layout box-center>
<em>技术笔记</em>
<CNavTree :items="items.dev" />
</lkn>

== 蔬菜罐罐汤
<lkn layout box-center>
<em>个人空间</em>
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

「霜月」是三月中残存的最后一轮月亮，却曾被虚假之天蒙蔽，只能在天上投下它的影子。

如今的「真实之月」已经坠入虚假之天内，它虚假的投影随之消失。

「霜月」上究竟有什么东西，让它被法大王抛出天外？

</lkn>

---

<lkn layout box-center>

<p>并不是我们选择将武器改造成玩具，才为民众换来了安乐的生活。
<br/>而是我们<b>用武器赢来了安乐的生活，才让它有了被改造成玩具的机会。</b></p>

*——礁与浪的相逢·其三「留给孩子们的『玩具』」*

</lkn>

---

<lkn layout text-center>

<p>我们『团结』一心
<br/>经受『回火』洗礼
<br/>肩负『祝福』古名
<br/>知晓『力量』真意
<br/>接纳『奉献』命运
<br/>终迎『超越』之火</p>

<p><b>为了纳塔！</b></p>

<p><b>为了纳塔！！</b></p>

*——第五章「炽烈的还魂诗」第四幕「命定将焚的虹光·绝望高悬天之上」*
</lkn>

---

<lkn layout box-center>

<p>希尔妲和我聊的最多的是…哲学。</p>

<p>很难想象我的姐姐和你这样博学的人聊这个的情景。</p>

<p>哪里哪里。
<br/>我们也不会做很深刻复杂的思辨。无非是从<b>身边的事情</b>聊聊如何思考罢了。
<br/>比如，人活在世界上最根本的哲学问题，就是<b>明天要不要自杀</b>。</p>

<p>啊？</p>

<lkn layout small><em><b>……省略部分剧情……</b></em></lkn>

<p>我见到姐姐的墓碑，本以为自己会哭出来。结果我<b>反而异常平静</b>。
<br/>哭出来可能会好点吧。</p>

*——山中好长日·第一章「天堂·圣殿的一日春秋·生命万岁」*

</lkn>

---

<lkn layout box-center>

> 前情大概是：需要有一个人献出自己的记忆，换取离开的机会。

<p>上一个，为了我们所有人去面见了梅兰塔…
<br/>献出了自己所有记忆的人，正是琳德的姐姐劳姆希尔妲。</p>

<p>什么？！</p>

<lkn layout small><em><b>……省略部分剧情……</b></em></lkn>

<p>但是我和旅行者，唔，还有很重要的事情要去做。</p>

<p>不对哦，派蒙。所有人都是平等的。
<br/><b>责任重大不是牺牲他人的理由。</b></p>

<p>去问其他人愿不愿意放弃经历的一切，确实也有点…</p>

<p>让我来吧。</p>

<p>彩特琳德！</p>

<p>你又说了和你姐姐一样的话，但是这一次我绝对不会同意了。
<br/>如今你在这里体会了纵观古今的历史，还见识到了世界所有的不可思议。
<br/>难道这一切，都不能唤起你对这个世界的一丝丝留念吗？
<br/>如今我想到那个问题的答案了。
<br/>哲学的根本问题是明天要不要自杀。</p>

<p>……</p>

<p>你看，你犹豫了。
<br/>哪怕一秒的犹豫都说明这个问题有答案：
<br/><b>明天值得活下去。</b></p>

<p>不，伊斯托利亚。智慧如你，也弄错了两件事。</p>

<p>请你论述。</p>

<p>尼西里塔为什么选择姐姐？
<br/>以及我真的只是因为巧合，才被送上来了吗？</p>

<p>你的姐姐说过，她真的只是因为巧合。
<br/>疗养院宣布关闭，但还没动迁的时候，她在午夜散步。
<br/>结果遇到了尼西里塔。</p>

<p>才不是巧合。你听着：
<br/>因为，<b>拯救自己就是拯救世界。</b></p>

<p>这…</p>

<p><b>如果姐姐不忘记一切，她一定会自杀。</b>
<br/>我现在明白为什么敢肯定我的姐姐一定还活着了。
<br/>一段重新开始的人生，想必充满了希望吧。
<br/>我在唐泽荣一的小说里看到过这么一段话：
<br/>「救世主在黑暗的世界里牺牲自己，自愿被钉缚于十字上。
<br/>因此他的灵魂才得以获救，升入光的王国。」
<br/>这太酷了不是吗？
<br/><b>治疗了自己的忧郁，还拯救了世界。</b>
<br/>这个机会我是不会让给你的。
<br/>派蒙和旅行者，你们也不许有意见。
<br/>等我失去记忆回到地上时，还需要你们告诉我：
<br/>我是谁，我要去往何处。</p>

*——山中好长日·第三章「审判·最后的审判」*


</lkn>

---

<lkn layout box-center>

<p><em>Frost Moon coordinates located.</em></p>

<p><em>Please proceed to the Main Control Hall 
<br/>for moon landing preparations.</em></p>

*——英文版「空月之歌·谐谑」版本PV*

</lkn>

---

</lkn>