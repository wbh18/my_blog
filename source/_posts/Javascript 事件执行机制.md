---
title: Javascript 事件执行机制
date: 2020-05-08 14:55:55
comments: true
categories:
	- Javascript
tags:
	- js原理
photos:
	- ../gallery/music.jpg
---

JavaScript有一个基于事件循环的并发模型，事件循环负责执行代码、收集和处理事件以及执行队列中的子任务。这个模型与其它语言中的模型截然不同，比如 C 和 Java。归根结底还是因为js是一门单线程语言。在此总结一篇关于js事件执行机制的笔记。
<!-- more -->

## Javascript 事件循环

Javascript 任务：同步任务 异步任务

```flow
st=>start: 任务进入执行栈
e=>end: 读取任务队列中的结果，进入主线程执行
cond=>condition: 是否是同步任务
op1=>operation: 主线程
op2=>operation: Event Table
op3=>operation: 任务全部执行完毕
op4=>operation: Event Queue 
io=>inputoutput: 注册回调函数 
st->cond

cond(yes)->op1->op3->e
cond(no)->op2->io->op4->e


```

1、同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入 Event Table 并注册函数。
2、当指定的事情完成时，Event Table 会将这个函数移入 Event Queue。  
3、主线程内的任务执行完毕为空，会去 Event Queue 读取对应的函数，进入主线程执行。  
4、上述过程会不断重复，也就是常说的 Event Loop(事件循环)。

## 关于 setTimeout

有些时候会发现 setTimeout 的延时执行假若只设置为 3 秒，但是实际上等待的时间可能会比 3 秒要长，正是因为同步的单线程任务需要一个个执行，如果执行的时间太久，则会影响 setTimeout 的执行，必须等待主线程内的任务执行完毕才会执行。
因此不难解释 setTimeout(fn,0)，它的含义是，指定某个任务在主线程最早可得的空闲时间执行，大意是当主线程执行栈内的同步任务全部执行完成，栈为空就会马上执行。

## 关于 setInterval

和 setTimeout 有相似之处，不过 setInterval 是循环执行。setInterval 会每隔指定的时间将注册的函数放入 Event Queue 中，如果前面的任务耗费的时间太久，那么也同样的需要等待。
需要注意的是对于 setInterval(fn, ms)来说，一旦 setInterval 的回调函数 fn 的执行时间超过了延迟时间 ms，那将会完全看不出来有时间间隔。

## Promise与process.nextTick(callback)
除了广义的同步任务和异步任务，我们对于任务有着更为精细的定义：

macro-task(宏任务): 包括整体的代码script、setTimeout、setInterval  
micro-task(微任务): Promise,process.nextTick  

不同类型的任务会进入对应的Event Queue，比如说setTimeout和setInterval会进入相同的Event Queue  

事件循环的顺序决定了js代码的执行顺序。进入整体代码(宏任务)后，开始第一次循环。接着执行所有的微任务，然后再次从宏任务开始，找到其中一个任务队列执行完毕，再执行所有的微任务。

```flow
st=>start: 宏任务
e=>end: 执行所有微任务
op1=>operation: 执行结束
op2=>operation: 开始新的宏任务
op3=>operation: 没有的话，开始新的宏任务
cond=>condition: 有可执行的微任务吗(yes or no)

st->op1->cond(yes)->e->op2
cond(no)->op3->st

```
利用一段代码说明这个过程：

```javascript
setTimeout(function() {
    console.log('setTimeout');
})

new Promise(function(resolve) {
    console.log('promise');
}).then(function() {
    console.log('then');
})

console.log('console');
```

这段代码作为宏任务，进入主线程。  
先遇到setTimeout，那么将其回调函数注册后分发到宏任务Event Queue。(注册过程与上同，下文不再描述)  
接下来遇到了Promise，new Promise立即执行，then函数分发到微任务Event Queue。  
遇到console.log()，立即执行。  
好啦，整体代码script作为第一个宏任务执行结束，看看有哪些微任务？我们发现了then在微任务Event Queue里面，执行。  
ok，第一轮事件循环结束了，我们开始第二轮循环，当然要从宏任务Event Queue开始。我们发现了宏任务Event Queue中setTimeout对应的回调函数，立即执行。  
结束。  
