---
title: 'From Callback to Async/Await: Sequential Fade-In Animation'
date: '2023-08-21'
tags: ['JavaScript', 'Asynchronous']
draft: true
summary: Deal with the JS asychronous from sequential fade-in animation. Step by step refactor the code from Callback, Promise to Async/Await, providing cleaner and more maintainable code.
---

## Foreword

The article is aimed at those know the concept of Callback Hell, Promise and Async/Await, but haven't dealt with it or not completely understand the difference.

I will guide you the three ways to implement "Sequential Fade In elements after clicking a button".

The MVP will look like this:
![Fading Example](/blog/from-callback-to-async/fading-example.gif)

Intuitive solution:

1. For fade in, add `transition` to elements, and change the `opacity` while clicking the button.
2. Sequential Fade In? The latter element's fading in has to "wait" for the fore elements fading in.
3. If you want to "wait" in JavaScript, the first thing comes to my mind is `setTimeout`. Waiting one by one is about calling a `setTimeout` after a `setTimeout` countdown.

So, the code is like this:

```javascript
const startBtn = document.getElementById('startBtn');
const container = document.getElementById('container');
const first = document.getElementById('first');
const second = document.getElementById('second');
const third = document.getElementById('third');
const forth = document.getElementById('forth');
const fifth = document.getElementById('fifth');
const resetBtn = document.getElementById('reset');

startBtn.addEventListener('click', function () {
  this.style.display = 'none';
  container.classList.remove('hidden');
  setTimeout(() => {
    first.classList.remove('hidden');
    setTimeout(() => {
      second.classList.remove('hidden');
      setTimeout(() => {
        third.classList.remove('hidden');
        setTimeout(() => {
          forth.classList.remove('hidden');
          setTimeout(() => {
            fifth.classList.remove('hidden');
            setTimeout(() => {
              resetBtn.classList.remove('hidden');
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }, 500);
});
```

That's it! Each Element can fade in each 0.5 seconds after clicking the startBtn.
Is it the end?
Uh...there's something weird...Is it the notorious **Callback Hell**?

## Step back one step. What is Callback?

## What is Callback Hell?

## Promise

### Parameter

### The Three Status of Promise

### The Four Static Methods of Promise

### Deal With Callback Hell with Promise

### What's the difference?

## Async/Await: The sytnax Sugar of Promise

### What is Syntax Sugar?

### Async/Await Keywords

### The benefits of Async/Await

### The Final Code with Async/Await
