---
title: 從 Callback 到 Async/Await：以次序淡入動畫為例
date: '2023-08-21'
tags: ['JavaScript', '非同步']
summary: 透過一個次序淡入動畫的需求來看 JS 中非同步操作的處理，如何從 Callback 結構轉換到 Promise ，再用 Async/Await 重構成更簡潔、好讀的程式碼。
---

## Foreword

這篇文章寫給聽過 Callback Hell, Promise 和 Async/Await 但實務上沒碰過，或是仍不清楚演進的人，我會透過「點擊之後元素要一個個漸入」的功能一步步帶大家看怎麼這三種方式會怎麼實作這功能。

功能 MVP 會是這樣：

![Fading Example](/blog/from-callback-to-async/fading-example.gif)

直覺想法：

1. 漸入在元素上放個 transition 然後點擊時改變 opacity 就好
2. 一個個漸入？代表後面的元素漸入需要「等」前面的元素先漸入完畢？
3. 在 JS 中要「等」首選就是 setTimeout，一個個等的話，就是一個 setTimeout 結束，再去呼叫另一個 setTimeout 就好。

於是就寫出了類似這樣的程式碼：

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

寫完了，各個元素可以每 0.5 秒依序漸入了，可以收工了…嗎？

嗯...越看越不對勁...這不就是大名鼎鼎的 **Callback Hell** 嗎？

## 談 Hell 之前，先談談什麼是 Callback？

> 一個 function A 被當作另一個 function B 的參數，並在之後被調用，Function A 就是 Callback

以下面這個範例來說：「`greet` 的第二個參數即是一個 callback function，並且在 `console.log` 之後被調用」，而在範例中，我們將 `sayGoodbye` 作為 callback 傳進去。

```javascript
function greet(name, callback) {
  console.log('Hello, ' + name + '!');
  callback();
}

function sayGoodbye() {
  console.log('Goodbye!');
}

greet('John', sayGoodbye);
```

## 那什麼是 Callback Hell？

> 在 JS 在處理非同步操作時，使用過多巢狀的 Callback function 的情形，另一個名字叫作 "Pyramid of Doom" （詛咒金字塔）或 "Haduken Code"（波動拳，對你沒看錯）。

![Haduken Code](/blog/from-callback-to-async/Haduken.jpeg)

![Pyramid Of Doom](/blog/from-callback-to-async/pyramid-of-doom.webp)

相信大家看完那記波動拳，~~已經很想對開發者使出波動拳~~，但別急，先細數一下 Callback Hell 的罪狀：

1. **可讀性差**、**維護困難**

   - 由於 Callback function 層層嵌套，程式碼變得很難閱讀、理解跟追蹤流程，想要新增、修改或刪除其中一個 Callback Function 都很不容易

   - 就漸入動畫的範例來說，中間有一個元素要延遲更久，你有辦法快速找到它嗎？而且在實務情境中邏輯只會更複雜。

2. **錯誤處理複雜**：

   - 這邊還沒有放入錯誤處理就已經很難閱讀了，想像一下每個 callback 或其中幾個 callback 如果有錯誤要處理會有多麻煩

3. **可測試性差**：

   - 因為 Callback function 都耦合在一起了，很難撰寫各自對應的單元測試。

4. **性能問題**：

   - 過多的巢狀回調不斷堆積在 Call stack ，最後可能造成 Stack Overflow（對，就是那個網站的名字），白話文即是 Stack 被塞到滿出來，程式會直接無法運作。

**補充：Call Stack**： JS 在執行 function 的機制，每個 function 都會先進到這個 Stack 再遵循 Stack 這個資料結構的 後進先出（LIFO）原則 來執行，在這邊先點到為止不贅述。

> 那我們有方法對付 Callback Hell 嗎？ ~~我們有機會上天堂嗎？~~

有的，我們有 ES6 時提出來的 [Promise](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise#%E6%96%B9%E6%B3%95) ！

## Promise

> Promise 是一個用來處理非同步操作的物件。它代表了一個最終可能完成（並返回一個結果）或失敗（並丟出一個原因）的非同步操作。

### 參數

只接受一個 `executor`，而這個 `executor` 也是一個 callback function：`function(resolve, reject) { ... }`

- 我們可以在 `...` 的部分設定什麼條件下代表完成（resolve） 和 失敗（reject）

- 而使用 Promise 還可以將非同步操作鏈接在一起，如範例中可以一直 `then` 下去

```javascript
const executor = (resolve, reject) => {
  if (/* 條件成立 */) {
    resolve('我成功了！');
  } else {
    reject('我失敗了！');
  }
};

const myPromise = new Promise(executor);

myPromise
  .then(result => {
    console.log('Fulfilled：' + result); // Fulfilled：我成功了！
  })
  .then(() => {
    // 可以一直 then 下去
  })
  .catch(error => {
    console.error('Rejected：' + error); // Rejected: 我失敗了！
  });

```

### 「可能完成或失敗的操作」代表 Promise 會有三種狀態：

1. **Pending（待定）**：既不是成功，也不是拒絕。

   - Promise 執行後尚未得到結果的延遲狀態。

2. **Fulfilled（已完成）**：操作成功完成。

   - Executor 內的條件成功，並已經執行完 resolve 的時候

3. **Rejected（已拒絕）**：操作失敗。

   - Executor 內的條件失敗，並已經執行完 reject 的情況

> 當一個 Promise 物件被創建並開始執行的時候，它的狀態就是 Pending。之後根據非同步操作的結果，它可能變成 Fulfilled（已完成）或 Rejected（已拒絕）其中的一個。

這邊使用 [`fetch`](https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API/Using_Fetch) 這個會永遠 resolve Http response 的 function 來舉例：

```javascript
function fetchStarWarsCharacter(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://swapi.dev/api/people/${id}/`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // Fetch 回傳的 Promise 預設只要接到 response 就會 resolve
          // 因此需要針對 HTTP 狀態碼不是 2xx 的情境來 reject
          reject('請求失敗');
        }
      })
      .then((character) => {
        resolve(character); // 成功取得人物資訊，解析 JSON 並完成 Promise
      })
      .catch((error) => {
        reject('無法預期的錯誤'); // 網路錯誤或其他會中斷 request 的情況
      });
  });
}

// 呼叫
fetchStarWarsCharacter(1)
  .then((character) => {
    // Name: Luke Skywalker
    console.log('Name:', character.name);
  })
  .catch((error) => {
    // Error: 請求失敗 or Error: 無法預期的錯誤
    console.log('Error:', error);
  });
```

### Promise 的另外四個靜態方法

1. Promise.resolve

- 將非 Promise 值轉換為 Promise 或創建一個立即接受的 Promise 時可以用。
  ```javascript
  Promise.resolve(value);
  Promise.resolve(promise);
  Promise.resolve(thenable);
  ```

2. Promise.reject

- 將非 Promise 值轉換為 Promise 或創建一個立即失敗的 Promise 時可以用。
  ```javascript
  Promise.reject(reason);
  ```

3. Promise.all

   - 回傳一個 promise，當在 iterable 中所有 promises 都被實現時被實現，或在當中有一個 promise 被拒絕時立刻被拒絕。

   ```javascript
   Promise.all(iterable);

   // Example
   var p1 = Promise.resolve(3);
   var p2 = 1337;
   var p3 = new Promise((resolve, reject) => {
     setTimeout(resolve, 100, 'foo');
   });

   Promise.all([p1, p2, p3]).then((values) => {
     console.log(values); // [3, 1337, "foo"]
   });
   ```

   想更了解 `Promise.all` 的話，推薦寫看看 Leetcode - JS30 的 [2721. Execute Asynchronous Functions in Parallel](https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/description/)

4. Promise.race

   - 當傳入的 iterable 中有 promise 被實現或拒絕時，立刻回傳被實現或拒絕的 [`Promise`](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise)

   ```javascript
   Promise.race(iterable);

   // Example
   var resolvedPromisesArray = [Promise.resolve(33), Promise.resolve(44)];

   var p = Promise.race(resolvedPromisesArray);
   console.log(p);

   setTimeout(function () {
     console.log('the stack is now empty');
     console.log(p);
   });

   // logs, in order:
   // Promise { <state>: "pending" }
   // the stack is now empty
   // Promise { <state>: "fulfilled", <value>: 33 }
   ```

   Leetcode - JS30 一樣也有一題 [2637. Promise Time Limit](https://leetcode.com/problems/promise-time-limit/description/) 可以做憐惜！

> 這邊的 `Promise.resolve` 和 `Promise.reject` 雖然跟 `new Promise((resolve, reject) => {...}` 裡面的參數命名慣例同名，但其實概念是不樣的。

這邊的是靜態方法，用來創建一個已解決或已拒絕的 Promise，而 executor callback 中的 resolve 和 reject 函數是用來控制 Promise 物件的狀態（Pending / Fulfilled / Rejected）。

還有其他可參考 [MDN - Promise Methods](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise#%E6%96%B9%E6%B3%95)。

### **用 Promise 解決 Callback Hell**

以範例來說，我們可以先把 setTimeout 用 Promise 包成 delay function，之後用 Promise 的鏈狀特性把每個操作連起來，每次操作完畢時呼叫 delay 並放入對應的秒數即可。

```javascript
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

startBtn.addEventListener('click', function () {
  this.style.display = 'none';
  this.style.opacity = 0;
  container.classList.remove('hidden');

  delay(500)
    .then(() => {
      first.classList.remove('hidden');
      return delay(500);
    })
    .then(() => {
      second.classList.remove('hidden');
      return delay(500);
    })
    .then(() => {
      third.classList.remove('hidden');
      return delay(500);
    })
    .then(() => {
      forth.classList.remove('hidden');
      return delay(500);
    })
    .then(() => {
      fifth.classList.remove('hidden');
      return delay(500);
    })
    .then(() => {
      resetBtn.classList.remove('hidden');
      return delay(500);
    });
});
```

### 使用 Promise 後的差異

1. 從巢狀結構轉為鏈狀結構

   - 不再是把 function 丟到 function 裡面，而是透過 .then 像一條鏈子一樣串連下去

   - 只要順著往下看 function 在鏈中的哪個位置，不必像處理 callback 時那樣左右與上下穿插閱讀

     - 像是 `third` 這個元素顯示後想要延遲久一點，很快就能知道是它下一行的 `return delay(500`

2. 透過 `.catch` 可以方便進行錯誤處理（雖然上面這段程式碼沒有需要錯誤處理）

   - 集中處理錯誤，代碼更乾淨，也達成關注點分離

<center><h2>**但…我們還有機會更清爽嗎？**</h2></center>

有的！認真的孩子有糖吃，來吃真香真好吃的 Promise 語法糖 [Async/Await](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/async_function) ！

## `Async/Await`： Promise 語法糖

### 什麼是語法糖？

> 記住一個重點：**語法糖不會新增任何功能，純粹是增進開發者體驗（DX）**

- 語法糖是在程式語言中的一個術語，指的是一種語法特性，讓身為人類的開發者有更方便、好讀的方式來寫 Code

- 所以其實要不要用都是看個人跟團隊風格，而我自己是覺得 Async/Await 真的很香

### Async 與 Await 關鍵字

1. **`async`**：用於聲明一個 function 裡面有非同步操作的 Keyword

2. **`await`**：僅可用於 **`async`** function 內部的 Keyword，它後面會接的就是一個會回傳 Promise 的非同步操作

> 當放置在一個 Promise 前面時，它會暫停當前的 **`async`** 函數的執行，直到 Promise 完成，然後返回 Promise 的結果。

提供大家我怎麼理解 Async Await ：「**它讓非同步的程式碼寫起來就像同步一樣**」，可以像原本一樣一行行地去閱讀程式碼，遇到 await 就是等 await 後方的程式執行完才會到下一行。

```javascript
async function fetchData() {
  try {
    let response = await fetch('url'); // 等 fetch 確實執行完畢，response 有值才會到繼續
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('出錯了：', error); // fetch 或 response.json 有錯的話就會 reject 進到這裡
  }
}
```

- 大家有注意到這邊的錯誤處理是使用 `try…catch` 嗎？
- 就像 `Promise` 可以用 `.catch` 捕捉處理錯誤， `async/await` 的標配就是 `try…catch` ，我個人認為把成功區域跟錯誤區域區分開來有提供更好的可讀性

### Async/Await 的好處

- 可讀性、DX 更佳，並可使用 `try…catch` 的非同步處理方式

### **用 Async/Await 進一步簡化的最終版**

> 最後還是要回到我們的範例啦，我們可以看看如何使用 `async/await ` 進一步簡化 Promise 建構的程式碼：

首先我們一樣有一個 delay function，接著只要用 IIFE 的方式呼叫一個 async function ，並在每個需要延遲的時間點呼叫 `await delay(ms)` ，執行到 await 那一行時，就會名副其實的等那一行執行完才繼續往下一行跑。

- 補充：IIFE 是立即呼叫函示（Immediately Invoked Function Expression），是指我們在定義完這個 function 後馬上觸發它。它也可以被稱為 Self-Executing Anonymous Function，因為我們通常不會給它命名，鑑於它一定義就觸發，也不需要多一個命名的步驟，在範例中我進一步用了 arrow function 來讓我連 `function` 這個 keyword 都不用寫！

```javascript
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

startBtn.addEventListener('click', function () {
  this.style.display = 'none';
  this.style.opacity = 0;
  container.classList.remove('hidden');

  (async () => {
    await delay(500);
    first.classList.remove('hidden');
    await delay(500);
    second.classList.remove('hidden');
    await delay(500);
    third.classList.remove('hidden');
    await delay(500);
    forth.classList.remove('hidden');
    await delay(500);
    fifth.classList.remove('hidden');
    await delay(500);
    resetBtn.classList.remove('hidden');
  })();
});
```

從一開始的巢狀 Callback hell 到 鏈狀的 Promise 再到 簡潔的 Async Await 有沒有感覺差很多呢？

希望利用這個實務上有碰到的需求幫助大家理解 Callback Hell、Promise 和 Async/Await 的概念，以及如何一步步將 Callback 簡化成 Async/Await ！

有任何問題歡迎留言或透過任何方式告訴我哦！

- 最後附上完整 [Demo Code](https://codepen.io/ParkerZhang/pen/VwqYZEm?editors=1010)
