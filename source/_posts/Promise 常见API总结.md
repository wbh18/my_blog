---
title: Promise 常见API总结
date: 2020-05-08 17:23:55
comments: true
categories:
	- Javascript
tags:
	- promise
	- 异步
photos:
	- ../gallery/salt-lake.jpg
---

Promise 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象。本文是对常见的promise方法的一个记录。

<!-- more -->


## Promise.then

---

```javascript
promise.then(onFulfilled, onRejected)
```

---

then 代码示例

```javascript
var promise = new Promise(function(resolve, reject) {
  resolve('传递给then的值')
})
promise.then(
  function(value) {
    console.log(value)
  },
  function(error) {
    console.error(error)
  }
)
```

这段代码创建了一个promise对象，定义了处理onFulfilled和onRejected的函数(handler)，然后返回这个promise对象，这个promise对象会在变为resolve或者reject的时候分别调用相应注册的回调函数。也就是说，当handler返回正常值的时候，这个值会传递给promise对象的onFullfilled方法，如果handler中产生异常，则会将这个值传递给promise对象的onRejected方法

## Promise.catch
---
```javascript
promise.then(onRejected)
```
---

catch代码示例

```javascript
var promise = new Promise(function(resolve, reject){
    resolve("传递给then的值");
});
promise.then(function (value) {
    console.log(value);
}).catch(function (error) {
    console.error(error);
});
```

这是一个等价于promise.then(undefined, onRejected)的语法糖


## Promise.resolve

---
```javascript
    Promise.resolve(promise);
    Promise.resolve(thenable);
    Promise.resolve(object);
```
---

Promise.resolve代码示例

```javascript
var taskName = "task 1"
asyncTask(taskName).then(function (value) {
    console.log(value);
}).catch(function (error) {
    console.error(error);
});
function asyncTask(name){
    return Promise.resolve(name).then(function(value){
        return "Done! "+ value;
    });
}
```
根据接收参数的不同，返回不同的Promise对象。  
虽然说每一种情况都会返回Promise对象，但是大致分为以下三类：  
1、当接收到Promise对象参数的时候，返回的也是接收到的Promise对象  
2、当接收到thenable类型的对象的时候，返回的是一个新的Promise对象，该对象具有then方法  
3、当接收到的参数为其他类型时，返回一个将该对象作为值的新的Promise对象  

## Promise.reject

---
```javascript
Promise.reject(object)
```
---

Promise.reject代码示例

```javascript
var failureStub = sinon.stub(xhr, "request").returns(Promise.reject(new Error("bad!")));
//sinon.js用以伪造xhr请求以测试
```
返回一个使用接收到的值进行了reject的新的promise对象  
传给Promise。reject的值也是一个Error类型的对象  
另外，和Promise.resolve不同的是，即使Promise.reject接收到的对象是一个Promise对象，依旧会返回一个全新的Promise对象

## Promise.all
---
```javascript
Promise.all(promiseArray);
```
---
Promise.all代码示例

```javascript
var p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = Promise.resolve(3);
Promise.all([p1, p2, p3]).then(function (results) {
    console.log(results);  // [1, 2, 3]
});
```
生成并返回一个新的promise对象，参数传递所有promise对象都变为resolve的时候，该方法才会返回，而新生成的promise则会使用这些promise的值，如果参数中任意一个promise为reject的话，那么Promise.all会立刻终止，并返回一个reject的新的promise对象。由于参数数组中每一个元素都是有Promise.resolve包装的，所以Promise.all可以处理不同类型的Promise对象

## Promise.race

---
```javascript
Promise.race(promiseArray)
```
---

Promise.race代码示例
```javascript
var p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = Promise.resolve(3);
Promise.race([p1, p2, p3]).then(function (value) {
    console.log(value);  // 1
});
```
生成并返回一个新的promise对象，参数promise数组中的任何一个promise对象如果变为resolve或者reject的话，该函数就会返回，并使用这个promise对象的值进行resolve或者reject

