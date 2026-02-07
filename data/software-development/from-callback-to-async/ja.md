---
title: CallbackからAsync/Awaitへ：順次フェードインアニメーションを例に
date: '2023-08-21'
draft: false
summary: 順序的なフェードインアニメーションの実装を通して、JSにおける非同期処理を学びます。CallbackからPromiseへの移行、そしてAsync/Awaitを使ったより簡潔で読みやすいコードへのリファクタリングを解説します。
---

> **注:** この記事は AI によって翻訳されています。もし不自然な表現や誤りがありましたら、メールやその他の手段でお知らせいただけると幸いです。フィードバックをいただけると助かります！

## まえがき

この記事は、Callback Hell、Promise、Async/Await という言葉は聞いたことがあるけれど、実務で触れたことがない、あるいはその進化の過程がよくわからないという方向けに書かれています。「クリック後に要素を一つずつフェードインさせる」機能を実装しながら、これら 3 つの方法でどのように実装するかをステップバイステップで見ていきます。

機能の MVP（実用最小限の製品）は以下のようになります：

![Fading Example](/software-development/from-callback-to-async/fading-example.gif)

直感的な考え方：

1. フェードインは要素に transition を設定し、クリック時に opacity を変更すればいい。
2. 一つずつフェードイン？ということは、後ろの要素のフェードインは前の要素のフェードイン完了を「待つ」必要がある？
3. JS で「待つ」といえば setTimeout が第一候補。一つずつ待つなら、一つの setTimeout が終わったら、別の setTimeout を呼べばいい。

そこで、以下のようなコードを書きました：

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

書き終わりました。各要素は 0.5 秒ごとに順次フェードインします。これで完了...ですか？

うーん...見れば見るほどおかしい...これがあの有名な **Callback Hell（コールバック地獄）** ではないでしょうか？

## 地獄について語る前に、そもそも Callback とは？

> 関数 A が別の関数 B の引数として渡され、その後呼び出される場合、関数 A が Callback（コールバック）です。

以下の例で言えば：「`greet`の 2 番目の引数がコールバック関数であり、`console.log`の後に呼び出されます」。この例では、`sayGoodbye`をコールバックとして渡しています。

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

## では、Callback Hell とは？

> JS で非同期処理を扱う際、ネストされたコールバック関数を使いすぎる状況のことです。別名「Pyramid of Doom（破滅のピラミッド）」や「Haduken Code（波動拳コード）」とも呼ばれます。

![Haduken Code](/software-development/from-callback-to-async/Haduken.jpeg)

![Pyramid Of Doom](/software-development/from-callback-to-async/pyramid-of-doom.webp)

あの波動拳を見た後、~~開発者に波動拳を打ち込みたくなったかもしれませんが~~、焦らないでください。まずは Callback Hell の罪状を挙げてみましょう：

1. **可読性が悪い**、**メンテナンスが困難**

   - コールバック関数が層状にネストされているため、コードを読むのも理解するのも、フローを追うのも難しくなります。コールバック関数の一つを追加、修正、削除するのも容易ではありません。

   - フェードインアニメーションの例で言えば、途中のある要素だけ遅延時間を長くしたい場合、すぐに見つけられますか？実務のシナリオではロジックはもっと複雑になります。

2. **エラー処理が複雑**：

   - ここではまだエラー処理を入れていませんが、すでに読むのが難しいです。各コールバックやその中のいくつかにエラー処理が必要な場合、どれほど面倒になるか想像してみてください。

3. **テスト性（Testability）が悪い**：

   - コールバック関数が結合してしまっているため、それぞれの単体テストを書くのが難しくなります。

4. **パフォーマンスの問題**：

   - 過剰なネストされたコールバックが Call stack に積み重なり、最終的に Stack Overflow（そう、あのウェブサイトの名前です）を引き起こす可能性があります。簡単に言えば、Stack がいっぱいになり、プログラムが動作しなくなります。

**補足：Call Stack**：JS が関数を実行するメカニズムです。各関数はこの Stack に入り、Stack というデータ構造の後入れ先出し（LIFO）原則に従って実行されます。ここではこれ以上深く触れません。

> では、Callback Hell に対抗する方法はあるのでしょうか？ ~~天国に行けるチャンスはあるのでしょうか？~~

あります。ES6 で提案された [Promise](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise) です！

## Promise

> Promise は非同期処理を扱うためのオブジェクトです。それは最終的に完了（して結果を返す）するか、失敗（して理由を投げる）する可能性のある非同期操作を表します。

### パラメータ

`executor`という関数を一つだけ受け取ります。この`executor`もコールバック関数です：`function(resolve, reject) { ... }`

- `...`の部分で、どのような条件で完了（resolve）とみなすか、失敗（reject）とみなすかを設定できます。

- また、Promise を使用すると、以下の例のように`then`で非同期操作を連鎖させることができます。

```javascript
const executor = (resolve, reject) => {
  if (/* 条件成立 */) {
    resolve('成功しました！');
  } else {
    reject('失敗しました！');
  }
};

const myPromise = new Promise(executor);

myPromise
  .then(result => {
    console.log('Fulfilled：' + result); // Fulfilled：成功しました！
  })
  .then(() => {
    // ずっと then を繋げられます
  })
  .catch(error => {
    console.error('Rejected：' + error); // Rejected: 失敗しました！
  });

```

### 「完了または失敗する可能性のある操作」は、Promise に 3 つの状態があることを意味します：

1. **Pending（待機中）**：成功でも拒否でもない状態。

   - Promise 実行後、まだ結果が出ていない遅延状態。

2. **Fulfilled（履行/成功）**：操作が成功して完了。

   - Executor 内の条件が成功し、resolve が実行された時。

3. **Rejected（拒否/失敗）**：操作が失敗。

   - Executor 内の条件が失敗し、reject が実行された時。

> Promise オブジェクトが作成され実行が開始された時、その状態は Pending です。その後、非同期操作の結果に応じて、Fulfilled（成功）または Rejected（失敗）のいずれかになります。

ここでは、常に HTTP レスポンスを resolve する [`fetch`](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch) 関数を例に挙げます：

```javascript
function fetchStarWarsCharacter(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://swapi.dev/api/people/${id}/`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // Fetchが返すPromiseはデフォルトではレスポンスを受け取ればresolveします
          // そのため、HTTPステータスコードが2xxでない状況に対してrejectする必要があります
          reject('リクエスト失敗');
        }
      })
      .then((character) => {
        resolve(character); // 人物情報の取得に成功、JSONを解析してPromiseを完了
      })
      .catch((error) => {
        reject('予期せぬエラー'); // ネットワークエラーやリクエストを中断させるその他の状況
      });
  });
}

// 呼び出し
fetchStarWarsCharacter(1)
  .then((character) => {
    // Name: Luke Skywalker
    console.log('Name:', character.name);
  })
  .catch((error) => {
    // Error: リクエスト失敗 or Error: 予期せぬエラー
    console.log('Error:', error);
  });
```

### Promise の他の 4 つの静的メソッド

1. Promise.resolve

- 非 Promise 値を Promise に変換したり、即座に受け入れられる Promise を作成する際に使えます。
  ```javascript
  Promise.resolve(value);
  Promise.resolve(promise);
  Promise.resolve(thenable);
  ```

2. Promise.reject

- 非 Promise 値を Promise に変換したり、即座に失敗する Promise を作成する際に使えます。
  ```javascript
  Promise.reject(reason);
  ```

3. Promise.all

   - 一つの promise を返します。iterable 内のすべての promise が履行された時に履行され、またはいずれかの promise が拒否された時に即座に拒否されます。

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

   `Promise.all`をもっと知りたい方は、Leetcode - JS30 の [2721. Execute Asynchronous Functions in Parallel](https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/description/) をやってみることをお勧めします。

4. Promise.race

   - 渡された iterable の中でいずれかの promise が履行または拒否された時、即座にその履行または拒否された [`Promise`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise) を返します。

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

   Leetcode - JS30 にも同様に [2637. Promise Time Limit](https://leetcode.com/problems/promise-time-limit/description/) という練習問題があります！

> ここでの`Promise.resolve`と`Promise.reject`は、`new Promise((resolve, reject) => {...}`の中のパラメータの命名慣習と同じ名前ですが、実は概念が異なります。

これらは静的メソッドで、解決済みまたは拒否済みの Promise を作成するために使われます。一方、executor コールバック内の resolve と reject 関数は、Promise オブジェクトの状態（Pending / Fulfilled / Rejected）を制御するために使われます。

他にも [MDN - Promise Methods](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise#%E9%9D%99%E7%9A%84%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89) が参考になります。

### **Promise で Callback Hell を解決する**

例に戻ると、まず setTimeout を Promise で包んだ delay 関数にし、その後 Promise の連鎖特性を使って各操作を繋げ、操作が完了するたびに delay を呼び出し、対応する秒数を入れることができます。

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

### Promise 使用後の違い

1. ネスト構造からチェーン構造へ変化

   - 関数を関数の中に放り込むのではなく、.then を通して鎖のように繋げていきます。

   - チェーンのどの位置に関数があるか順に下へ見ていけばよく、callback を扱う時のような左右や上下への視線移動は不要です。

     - 例えば`third`という要素が表示された後、遅延を長くしたい場合、その次の行の`return delay(500`だとすぐにわかります。

2. `.catch`を通じてエラー処理が容易に行える（このコードではエラー処理は不要ですが）

   - エラーを一箇所で処理でき、コードがすっきりし、関心の分離も達成できます。

<center><h2>**でも...もっとスッキリさせるチャンスはあるでしょうか？**</h2></center>

あります！真剣な子にはご褒美があります。美味しくて香ばしい Promise のシンタックスシュガー、[Async/Await](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function) をいただきましょう！

## `Async/Await`：Promise のシンタックスシュガー

### シンタックスシュガー（糖衣構文）とは？

> 重要なポイントを覚えておいてください：**シンタックスシュガーは機能を追加するものではなく、純粋に開発者体験（DX）を向上させるものです**

- シンタックスシュガーはプログラミング言語の用語で、人間である開発者にとってコードをより書きやすく、読みやすくするための構文機能を指します。

- なので、使うかどうかは個人やチームのスタイル次第ですが、私自身は Async/Await は本当に素晴らしいと思います。

### Async と Await キーワード

1. **`async`**：関数の中に非同期操作があることを宣言するためのキーワード。

2. **`await`**：**`async`**関数内部でのみ使用可能なキーワード。この後ろには Promise を返す非同期操作が続きます。

> Promise の前に置くと、現在の**`async`**関数の実行を一時停止し、Promise が完了するまで待ち、その後 Promise の結果を返します。

私の Async Await の理解の仕方を共有します：「**非同期コードをまるで同期コードのように書けるようにするもの**」。元々のように一行一行コードを読んでいき、await に出会ったら、await の後ろのプログラムが実行し終わるのを待ってから次の行に進む、という感じです。

```javascript
async function fetchData() {
  try {
    let response = await fetch('url'); // fetchが確実に実行完了し、responseに値が入ってから次へ
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('エラーです：', error); // fetchやresponse.jsonでエラーがあればrejectされ、ここに入ります
  }
}
```

- ここのエラー処理が`try…catch`を使っていることに気づきましたか？
- `Promise`が`.catch`でエラーを捕捉できるように、`async/await`の標準装備は`try…catch`です。個人的には成功領域とエラー領域を分けることで、より良い可読性が提供されると思います。

### Async/Await のメリット

- 可読性、DX が向上し、非同期処理に`try…catch`を使用できる。

### **Async/Await でさらに簡略化した最終版**

> 最後はやはり例に戻りましょう。`async/await`を使って Promise 構築のコードをさらに簡略化する方法を見てみましょう：

まず同様に delay 関数を用意し、次に IIFE の方法で async 関数を呼び出します。そして遅延が必要な各時点で`await delay(ms)`を呼び出します。await の行を実行する時、名実ともにその行の実行完了を待ってから次の行へ進みます。

- 補足：IIFE は即時実行関数式（Immediately Invoked Function Expression）で、関数を定義した後すぐにそれをトリガーすることを指します。通常名前を付けないため、自己実行無名関数（Self-Executing Anonymous Function）とも呼ばれます。定義してすぐトリガーするので、命名の手順も不要です。例ではさらにアロー関数を使って、`function`というキーワードさえ書かずに済むようにしました！

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

最初のネストされた Callback hell から、チェーン状の Promise、そして簡潔な Async Await へ。随分違うと感じませんか？

この実務で遭遇した要件を利用して、皆さんが Callback Hell、Promise、Async/Await の概念と、Callback を Async/Await へとステップバイステップで簡略化する方法を理解する助けになれば幸いです！

質問があれば、コメントやその他の方法で私に教えてくださいね！

- 最後に完全な [Demo Code](https://codepen.io/ParkerZhang/pen/VwqYZEm?editors=1010) を添付します。
