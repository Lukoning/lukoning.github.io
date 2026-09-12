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
      text: 查看归档页
      link: /Archive
    - theme: alt
      text: 白河豚是谁？
      link: /About

features:
  - title: "关于<em><lkn c green> Ao</lkn><lkn c yellow>hina</lkn></em>"
    details: "这个名字来自 ヤマノススメ(向山进发) 的两位主角 <lkn c green><ruby>雪村あおい<rp>(</rp><rt>Yukimura <c>Ao</c>i</rt><rp>)</rp></ruby></lkn> 和 <lkn c yellow><ruby>倉上ひなた<rp>(</rp><rt>Kuraue <c>Hina</c>ta</rt><rp>)</rp></ruby></lkn>。顺带一提，头像上也是她们。<a link href='ACG/ymnssm-Introduction'>了解ヤマノススメ -></a>"
  - title: "关于「白河豚🌻」"
    details: "这个名字嘛……<br>「白河豚」即「百合豚」，<br>而「🌻」跟<em><lkn c green>Ao</lkn><lkn c yellow>hina</lkn></em>同源哦。<br><a link href='Murmurs/about-my-names'>关于我的「名字」 -></a>"
  - title: "碎碎念…"
    details: "其实从这个站点的内容上能看出，此人是有亿点抽象且成分极为复杂之人。好吧我摊牌了其实我是来自外星的伪人我将攻入地球⚠️⚠️⚠️"
---

<lkn layout box-center>

<script setup>
  import { onMounted, onUnmounted } from 'vue'
  import { useData } from 'vitepress'
  import { initLknAnimation, destoryObserver } from "/.vitepress/utils/customElements.ts"
  const { theme } = useData();
  const sb = theme.value.sidebar.map(item => ({ ...item })); //theme是只读数组，要修改的话得转换为新数组
  const items =  {
    hanno: sb.filter(item => item.text === "饭能市"),
    dev: sb.filter(item => item.text === "虚空网络"),
    anyt: sb.filter(item => item.text === "蔬菜罐罐汤"),
  };
  Object.keys(items).forEach( key => items[key][0].collapsed = undefined)
  onMounted(() => { initLknAnimation() });
  onUnmounted(() => { destoryObserver() });
</script>
<style>
  .vp-doc hr {
    margin: 32px 0;
  }
</style>

<lkn layout text-center>
<lkn layout box-center >

### 导航树

<lkn layout small><em>带有渐变色文字的页面使用深色模式浏览更佳。</em></lkn>

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

欢迎你来到被虚假之天包裹住的星球。

</lkn>

<p>
不论你是<lkn title="原神">旅行者</lkn>、<lkn title="崩坏：星穹铁道">开拓者</lkn>、<lkn title="明日方舟：终末地">管理员</lkn>、<lkn title="鸣潮">漂泊者</lkn>、<lkn title="异环">异能者</lkn>、<lkn title="明日方舟">博士</lkn>、<lkn title="卡拉比丘">引航者</lkn>、
<br/>
<lkn title="蔚蓝档案">老师</lkn>、<lkn title="恋与深空">猎人小姐</lkn>、<lkn title="开放空间">队长</lkn>、<lkn title="崩坏3">舰长</lkn>、<lkn title="未定事件簿">律师</lkn>、<lkn title="战场双马尾/战双帕弥什/碧蓝航线/少女前线等等">指挥官</lkn>、<lkn title="尘白禁区">分析员</lkn>、<lkn title="绝区零">绳匠</lkn>……
</p>

---

<lkn layout text-center>

<lkn c ns-blessing-Mavuika><b>真正的命运将以我等的血来缔造</b></lkn>

*[引燃PV——「以燔燎铸名」](https://www.bilibili.com/video/BV1RZ421K7CT)*

</lkn>

---

<lkn layout text-center>

**派蒙，这不是灾难，这是战争**

</lkn>

*——原神·提瓦特篇<br/>第五章「炽烈的还魂诗」第四幕「命定将焚的虹光·绝望高悬天之上」*

---

<lkn layout text-center>

<lkn c ns-blessing-Mavuika><b>若我注定失败，你又为何恐惧</b></lkn>

</lkn>

*——原神·提瓦特篇<br/>第五章「炽烈的还魂诗」第四幕「命定将焚的虹光·绝望高悬天之上」*

---

<lkn layout box-center>
<lkn layout text-center>

<p><lkn c ns-blessing-Mualani>「我们『团结』一心」</lkn>
<br/><lkn c ns-blessing-Kinich>「经受『回火』洗礼」</lkn>
<br/><lkn c ns-blessing-Xilonen>「肩负『祝福』古名」</lkn>
<br/><lkn c ns-blessing-Iansan>「知晓『力量』真意」</lkn>
<br/><lkn c ns-blessing-Ororon>「接纳『奉献』命运」</lkn>
<br/><lkn c ns-blessing-Chasca>「终迎『超越』之火」</lkn>
</p>

<lkn c ns-blessing-Mavuika><b>
为了纳塔！
<br/>
为了纳塔！！
</b></lkn>

<!--

「全纳塔的战士们，联合起来！」

„Proletarier aller Länder vereinigt Euch!“

-->

</lkn>

*——原神·提瓦特篇<br/>第五章「炽烈的还魂诗」第四幕「命定将焚的虹光·绝望高悬天之上」<br/>[过场动画「夜明之前」](https://www.bilibili.com/video/BV1ET25YtEFr)*
</lkn>

---

<lkn layout box-center>
<lkn layout box-center>

仔细听。

（哭喊）<lkn c ns-blessing-Kachina>我们…！
<br/>继承了记忆与传说！
<br/>我们…
<br/>和太阳与风一同成长！</lkn>

（齐）我们，
<br/>铸造了命运与未来！
<br/>这些都是纳塔的火，
<br/>纳塔的血液！
<br/> *<ruby>Hadithi yaendelea<rp> / </rp><rt>故事仍在延续</rt></ruby>*
<br/> *<ruby>Heshima warithi vizazi<rp> / </rp><rt>荣耀几经传承</rt></ruby>*
<br/> *<ruby>Ushujaa waangaza<rp> / </rp><rt>勇气点亮了</rt></ruby>*

我听到了，
<br/>是他们的声音。
<br/>（背景：*<ruby>mbingu na ardhi<rp> / </rp><rt>天空与大地</rt></ruby>*）

星海幽暗，（背景：*<ruby>Mara tena<rp> / </rp><rt>再一次</rt></ruby>*）
<br/>孤寂无垠。（背景：*<ruby>ashinda Natlan<rp> / </rp><rt>纳塔迎来胜利</rt></ruby>*）
<br/>直到有人点燃了自我，
<br/>宇宙，
<br/>才拥有最初的光。

<lkn c ns-blessing-Mavuika>我们不会放弃希望！
<br/>我们还要携手向前！
<br/>开辟未来的答案，就在这里！
<br/>那就是，
<br/><b>我们自己！！</b></lkn>

</lkn>

*——原神·提瓦特篇<br/>第五章「炽烈的还魂诗」第五幕「炽烈的还魂诗·众望所归」<br/>[过场动画「予夜以火，予光以歌」](https://www.bilibili.com/video/BV1MA66YvEyX)*
</lkn>

---

<lkn layout box-center>

个体与个体之间只存在「借」和「还」的关系。
<br/>我们迟早会两清，你不需要在意。

不是这样的哦。
<br/> **人与人的关系，绝不是轻易就能抚回原状的白纸。** 你一定感受过。
<br/>生命中出现过的人不会像水滴蒸发一样消失，世上不存在真正的「两清」。
<br/>正因为有些事不能挽回也不能改变，人间才会有情感。
<br/>你感受的所有东西都是真实，你欠下的事物也不会被弥补。
<br/>背负裂痕生活下去是人的行为。
<br/>你可以选择是否成为人。

*——原神·提瓦特篇<br/>间章·第三幕「倾落伽蓝·如朝露一般」*

</lkn>

---

<lkn layout box-center>

我本可以完成更多实验……我确实无法再看到更多结果了。
<br/>不过草之主，现在的结果于我而言，也并不糟糕。

我相信你说的话，但很遗憾，你的一切都结束了。
<br/>这场实验不属于你，一切实验的成果也都不属于你。
<br/> **智慧在必要时，也可暴烈如火焰。烧掉你的火焰里，也包含你自己。**
<br/>我不否定你的聪慧。
<br/>只不过，在我的表达里，这些事绝不会被定性为「实验」。
<br/> **那是真真切切发生在世间的事，比数据更有意义。**

*——原神·空月之歌<br/>第十幕「<lkn animated burning-switch script-init=enter-viewport trigger-config="{delay=5000}"><fr>道成千壑，因果异灭</fr><fb>（</fb><to>虚空劫灰往世书</to><fb>）</fb></lkn>」*

</lkn>

---

<lkn layout box-center>

并不是我们选择将武器改造成玩具，才为民众换来了安乐的生活。
<br/>而是我们**用武器赢来了安乐的生活，才让它有了被改造成玩具的机会。**

*——礁与浪的相逢·其三「留给孩子们的『玩具』」*

</lkn>

---

<lkn layout box-center>

啊，不过…**如果只为了回报而去帮助，有点本末倒置了。**
<br/>就算没有任何酬劳，看见问题被解决，原本面露难色的朋友们开心起来，
<br/>一切事情都在向着好的方向发展…
<br/>我喜欢这种感觉！

*——斑斓色彩追逐战·「斑斓色彩在盘中！」*

</lkn>

---

<lkn layout box-center>

希尔妲和我聊的最多的是…哲学。

很难想象我的姐姐和你这样博学的人聊这个的情景。

哪里哪里。
<br/>我们也不会做很深刻复杂的思辨。无非是从**身边的事情**聊聊如何思考罢了。
<br/>比如，人活在世界上最根本的哲学问题，就是**明天要不要自杀**。

啊？

<lkn layout small><em><b>……省略部分剧情……</b></em></lkn>

我见到姐姐的墓碑，本以为自己会哭出来。结果我**反而异常平静**。
<br/>哭出来可能会好点吧。

*——山中好长日·第一章「天堂·圣殿的一日春秋·生命万岁」*

</lkn>

---

<lkn layout box-center>

> 前情大概是：需要有一个人献出自己的记忆，换取离开的机会。

上一个，为了我们所有人去面见了梅兰塔…
<br/>献出了自己所有记忆的人，正是琳德的姐姐劳姆希尔妲。

什么？！

<lkn layout small><em><b>……省略部分剧情……</b></em></lkn>

但是我和旅行者，唔，还有很重要的事情要去做。

不对哦，派蒙。所有人都是平等的。
<br/>**责任重大不是牺牲他人的理由。**

去问其他人愿不愿意放弃经历的一切，确实也有点…

让我来吧。

彩特琳德！

你又说了和你姐姐一样的话，但是这一次我绝对不会同意了。
<br/>如今你在这里体会了纵观古今的历史，还见识到了世界所有的不可思议。
<br/>难道这一切，都不能唤起你对这个世界的一丝丝留念吗？
<br/>如今我想到那个问题的答案了。
<br/>哲学的根本问题是明天要不要自杀。

……

你看，你犹豫了。
<br/>哪怕一秒的犹豫都说明这个问题有答案：
<br/>**明天值得活下去。**

不，伊斯托利亚。智慧如你，也弄错了两件事。

请你论述。

尼西里塔为什么选择姐姐？
<br/>以及我真的只是因为巧合，才被送上来了吗？

你的姐姐说过，她真的只是因为巧合。
<br/>疗养院宣布关闭，但还没动迁的时候，她在午夜散步。
<br/>结果遇到了尼西里塔。

才不是巧合。你听着：
<br/>因为，**拯救自己就是拯救世界。**

这…

**如果姐姐不忘记一切，她一定会自杀。**
<br/>我现在明白为什么敢肯定我的姐姐一定还活着了。
<br/>一段重新开始的人生，想必充满了希望吧。
<br/>我在唐泽荣一的小说里看到过这么一段话：
<br/>「救世主在黑暗的世界里牺牲自己，自愿被钉缚于十字上。
<br/>因此他的灵魂才得以获救，升入光的王国。」
<br/>这太酷了不是吗？
<br/>**治疗了自己的忧郁，还拯救了世界。**
<br/>这个机会我是不会让给你的。
<br/>派蒙和旅行者，你们也不许有意见。
<br/>等我失去记忆回到地上时，还需要你们告诉我：
<br/>我是谁，我要去往何处。

*——山中好长日·第三章「审判·最后的审判」*


</lkn>

---

</lkn>