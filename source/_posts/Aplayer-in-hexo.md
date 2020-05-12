---
title: 为Hexo博客添加音乐播放器并保持跳转时不中断播放状态
date: 2020-05-12 13:34:49
comments: true
categories:
	- 个人blog
tags:
	- hexo
	- pjax
	- aplayer
photos:
	- /gallery/music.jpg
---

由于主题布局的关系，博客网站两翼的位置比较空，所以我在右边摆了一只看板娘作为平衡，就算左边不摆东西，其实已经比较和谐了。但是看到网上有一些个人博客炫酷的音乐播放器，正好置于左下固定位置，就想自己也弄一个也不错。

<!-- more -->

## 音乐播放器的初步实现

其实如果单纯的只是插入一个音乐播放器是很简单的，只需从网易云或其他有相应功能的音乐网站找到外链播放器的代码，在合适的地方插入`iframe`元素即可

```html
    <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=29751583&auto=1&height=66"></iframe>
```

插入sidebar的最终效果还不错

![网易云外链播放器](/img/aplayer/netease.jpg)

## 发现的问题

现在播放音乐没有问题了，但是在跳转站内页面的时候音乐会自动中断很影响体验，并且外链播放器放在sidebar里进入文章详情页sidebar会消失

针对以上问题，使用`aplayer`+`meting.js`生成固定在底部的外链播放器，使用pjax进行页面路由切换的管理

## 插一句：关于pjax

`pjax`主要是利用`pushState`来改变浏览器URL，利用`ajax`来请求页面，以实现不刷新浏览器更新页面，这样就能保证正在播放音乐中的播放器不受影响

## 解决问题

播放器配置，具体可以参考[Aplayer官方文档](https://aplayer.js.org/#/zh-Hans/)、[MetingJS官方文档](https://github.com/metowolf/MetingJS/tree/v1.2)

```html
<!-- 引用Aplayer和metingjs -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/meting@1.2.0/dist/Meting.min.js"></script>
<div id="my-aplayer"
	class="aplayer" 
	data-id="5010430092" 
	data-server="netease" 
	data-type="playlist" 
	data-fixed="true" // 吸底模式可以固定播放器于页面底部
	data-autoplay="false" 
	data-order="list" 
	data-volume="0.55" 
	data-theme="#cc543a" 
	data-preload="auto" 
></div>
```

pjax配置，如果使用next主题应用`pjax`很简单，只需下载相应`npm`包然后在`_config.xml`里配置`pjax:true`，但是我的博客是自己找的主题，所以得手动引入然后配置，参考文档[jquery-pjax文档](http://bsify.admui.com/jquery-pjax/)

```html
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
<script src="https://cdn.bootcss.com/jquery.pjax/2.0.1/jquery.pjax.min.js"></script>
<script>
	// 对所有链接跳转事件绑定pjax容器container
	$(document).pjax('a[target!=_blank]', '#container', {fragment:'#container', timeout:8000})
</script>

```
至此就实现了一个位于浏览器底部的播放器，且在网站内切换页面音乐也不会中断

![最终效果](/img/aplayer/aplayer.jpg)

## 后续

使用`pjax`托管页面后产生了一些问题，因为页面不刷新，所以切换页面后有一些原来会执行的`javascript`代码不会再执行，另外一些监听事件也出了问题，解决方法也比较容易，把这些事件纳入`pjax`管理，在`pjax`执行完后添加相应的回调函数即可

```javascript
$(document).on('pjax:complete', function() {
    // 需要做的操作
})
```