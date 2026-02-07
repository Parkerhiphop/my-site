---
title: JavaScriptにおけるeval、リスク、そして代替案について
date: '2023-09-30'
draft: false
summary: JavaScriptにおけるevalを紹介し、なぜそれを使うべきではないかについて語り、最後にApp Scriptクローラーで`<script />`を読み取る際やJSの計算結果を取得する面接問題を例に、その応用と代替案を見ていきます。
tags: ['Software Development', 'Web Development', 'JavaScript', 'Security', 'Eval']
---

> **注:** この記事は AI によって翻訳されています。もし不自然な表現や誤りがありましたら、メールやその他の手段でお知らせいただけると幸いです。フィードバックをいただけると助かります！

## はじめに

最近、Google Sheets が提供する App Script を使って友人のために小さなクローラーを書き、ウェブ上の情報を自動的に移動・整理しようとしました。その際、HTML ソース内の`<script />`の情報が直接読み取れないことに気づきました。ChatGPT に聞いたところ、突然`eval`を使用した実装を提示されました。以前は使ってはいけないということしか知らなかったので、今回は**どのような時に使われる可能性があるのか**、**なぜ使ってはいけないのか**、そして**どのような代替案があるのか**について真剣に理解することにしました。

この記事では、`eval`を簡単に紹介した後、一つの使用事例と一つの面接問題を取り上げます。

## `eval` 基本紹介

`eval(script);` は JavaScript の組み込み関数です。

渡された script 文字列（String）を JavaScript の式（Expression）または文（Statement）として実行することができます。

> **使用シーン：「実行したい script を信頼しており、かつ String を JS コードとして実行したい場合」**

### 戻り値 (Return value)

パラメータが String の場合、JS の実際の実行結果を返します。その String が実行可能な JS コードでない場合は、`Error: {script} is not defined`を返します。

パラメータが String でない場合は、パラメータをそのまま返します。

```js
console.log(eval('2 + 2'));
// Expected output: 4

console.log(eval(new String('2 + 2')));
// Expected output: 2 + 2

console.log(eval('2 + 2') === eval('4'));
// Expected output: true

console.log(eval('2 + 2') === eval(new String('2 + 2')));
// Expected output: false

console.log(eval(123));
// Expected output: 123
```

## Never use `eval()`!

文字列をそのまま JS として実行するのは非常にまずい響きがします。MDN の [Never use `eval()`!](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!) では、`eval`を使用することで生じる可能性のある 4 つの理由が指摘されています：

### 1. セキュリティリスク (Security Risks)

攻撃者が渡された `script` パラメータを何らかの方法で置き換えることができれば、それを通じて悪意のあるプログラムを実行（ローカルデータの取得、あなたを通じたリクエスト送信など）できてしまいます。

### 2. パフォーマンスへの影響 (Performance Impact)

JS インタプリタを直接呼び出すため、現代の JS エンジンが JS を読み込む際に行う様々な最適化を使用できません。

### 3. 変数名の検索 (Variable Name Lookups)

JS はインタプリタ言語ですが、どの言語も機械（例：コンピュータ）で実行するには、コンピュータが理解し実行できるように機械語（machine code）に変換する必要があります。

しかし、eval は変数（Variable）を宣言する可能性があるため、ブラウザ上で実行する場合、ブラウザは JS インタプリタが JavaScript を翻訳して得た機械語の中の変数名が存在するか、重複していないか、変更されていないかを確認する必要があります。

このプロセスは非常にリソースを消費します。

### 4. 最小化の問題 (Minification Issues)

> Minifiers は JS コードを縮小できるツールです。
> プログラムを書くときは可読性のために多くのスペース、句読点、または読みやすい変数名を入れますが、コンピュータが実行する場合はこれらは不要です。Minifiers を通じて JS コードを極限まで簡略化し、スペースを節約できます。

eval は実行時（runtime）に読み込まれて初めて実行できるため、Minifiers のようなツールは通常、ビルド時（build time）にコードをパッケージ化する際に処理を行います。

そのため、`eval(script)`の`script`が非常に大きい場合、多くのスペースを無駄にし、最適化を行うことができません。

---

## 使用シーン

### 1. App Script クローラー時の `<script />` 内容の読み取り

「YouTuber の URL」を入力し、App Script で実行を押すだけで、YouTuber の「チャンネル名」と「登録者数」を自動的に入力できます。

App Script はブラウザをシミュレートできませんが、HTML ソースを読み取ることができます。JS がどれほど難読化（uglify）されていても、表示される String は必ず元の状態のままであるため、HTML 全体の中から欲しいデータがどこにあるかを探すだけで済みます。

YouTuber の概要ページで右クリックして「ページのソースを表示」を選択すると、「チャンネル名」と「登録者数」が以下の`script`内の`ytInitialData`にあることがわかります：

```html
<!-- HTML source contains: -->
<script>
  ...

  let ytInitialData = {
    header: {
      c4TabbedHeaderRenderer: {
        title: 'YouTuber Name',
        subscriberCountText: {
          simpleText: 'xxx subscribers',
        },
      },
    },
  };

  ...
</script>
```

App Script では、`UrlFetchApp.fetch`を使用して URL を GET し、`getContentText`を使用してそのページのすべての HTML コードを取得できます。

次に、先ほどの HTML 構造の観察に基づいて、正規表現を使用して欲しいコードセグメントを取得できます。

```js
let response = UrlFetchApp.fetch(youtubeUrl);

let pageSource = response.getContentText();

let jsCodeMatch = pageSource.match(/var ytInitialData = (\{[^]+?\});/);
```

次は、もう一度正規表現を書いてマッチさせれば欲しいデータが取得できるでしょうか？

```js
let titleMatch = pageSource.match(/title: '([^']+)'/);
let subscriberCountMatch = pageSource.match(/simpleText: '([^']+)'/);
```

**残念ながらできません！**

上記の生データを見ると、`<script />`の中にラップされていることがわかります。HTML ソース内の`<script />`は私たちには見えますが、プログラムにとっては実際には可視であり、直接読み取ることはできません。

#### `eval` を通じて HTML Source の `<script />` を実行し、配下の変数を取得する

ここで`eval`の登場です。`eval`は String として渡された JS コードを実行できます。見つけた script セグメントを`eval`に投げて実行すれば、`ytInitialData`がそこで宣言・作成されるため、直接`ytInitialData`にアクセスしてその配下のプロパティを取得できるようになります！

```js
// evalを使用してscriptを実行し、script内の `ytInitialData` 変数を宣言する
let jsCodeMatch = pageSource.match(/var ytInitialData = \{[^]+?\};/);

if (jsCodeMatch && jsCodeMatch.length >= 1) {
  // JavaScriptコードブロックを抽出
  let jsCode = jsCodeMatch[0];

  // eval()を使用してJavaScriptコードを実行
  eval(jsCode);

  // ytInitialDataが宣言されます。
  let title = ytInitialData.header.c4TabbedHeaderRenderer.title;
  let subscriberCount = ytInitialData.header.c4TabbedHeaderRenderer.subscriberCountText.simpleText;
}
```

ここまでで機能は完了ですが、実は`eval`には前述のように多くの問題があり、基本的に使用は推奨されません。

#### 代替案 `JSON.parse`

`JSON.parse()`を呼び出してその script セグメントを解析でき、同様に解析された JSON データに直接アクセスできます。これならバックドアを開くように`eval`を使って外部コードを実行する必要はありません！

```js
// 正規表現を使用してJavaScriptコードブロックを見つける
let jsCodeMatch = pageSource.match(/var ytInitialData = (\{[^]+?\});/);

if (jsCodeMatch && jsCodeMatch.length >= 2) {
  // JSONデータを含むJavaScriptコードブロックを抽出
  let jsCode = jsCodeMatch[1];

  // JSONデータを解析
  let jsonData = JSON.parse(jsCode);

  // 抽出されたデータにアクセス
  if (jsonData.header && jsonData.header.c4TabbedHeaderRenderer) {
    let title = jsonData.header.c4TabbedHeaderRenderer.title;
    let subscriberCount =
      jsonData.header.c4TabbedHeaderRenderer.subscriberCountText.simpleText.replace(
        'subscribers',
        ''
      );
  }
}
```

### 2. 面接問題：JS の計算結果を取得する

> `const a = '1 + 2 + 3';` において、a は JavaScript の式を含む String です
>
> 変数 a の計算完了後の結果をどのように取得しますか？

この問題は：[是 Ray 不是 Array](https://israynotarray.com/javascript/20230321/3298342448/) の記事からのものです。

`eval`を使えばすぐに結果が得られますが、前述のような問題があります。より確実な方法はあるでしょうか？

```js
const a = '1 + 2 + 3';

eval(a); // 6
```

#### String を Array に変換し、Array 操作を使用して計算する

String の場合、もう一つの一般的な方法は Array に変換することです。そうすれば、Array の多くの便利なメソッドを使用して実行できます。

```js
const a = '1 + 2 + 3';
const b = a.split(' + '); // [ "1", "2", "3" ]，内容に従って文字列を配列に分割
const c = b.map(Number); // [ 1, 2, 3 ]，中の配列を数値に変換
const total = c.reduce((acc, cur) => acc + cur); // 6，reduceを使用して加算
```

### 3. Vue devtools

[Vue devtools](https://github.com/vuejs/devtools/tree/v6.5.0) には、実は非常に便利な機能「[Open component in editor](https://devtools.vuejs.org/guide/open-in-editor.html)」があり、エディタで対応するコンポーネントのソースコードを直接開くことができます。

![Vue devtools](/software-development/talk-about-js-eval/vue-devtools.png)

そして、この機能の実行には `eval` が使用されています：

```js
export function openInEditor(file) {
  // Console display
  const fileName = file.replace(/\\/g, '\\\\');
  const src = `fetch('${SharedData.openInEditorHost}__open-in-editor?file=${encodeURI(
    file
  )}').then(response => {
    if (response.ok) {
      console.log('File ${fileName} opened in editor')
    } else {
      const msg = 'Opening component ${fileName} failed'
      const target = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {}
      if (target.__VUE_DEVTOOLS_TOAST__) {
        target.__VUE_DEVTOOLS_TOAST__(msg, 'error')
      } else {
        console.log('%c' + msg, 'color:red')
      }
      console.log('Check the setup of your project, see https://devtools.vuejs.org/guide/open-in-editor.html')
    }
  })`;
  if (isChrome) {
    target.chrome.devtools.inspectedWindow.eval(src);
  } else {
    // eslint-disable-next-line no-eval
    eval(src); // <---
  }
}
```

[ソースコードを見る](https://github.com/vuejs/devtools/blob/v6.5.0/packages/shared-utils/src/util.ts#L716)

このコードを簡単に分析します：

1. バックスラッシュを処理して、ファイル名が正しいパスであることを確認します
2. `{your_localhost}/_open-in-editor?file=/path/to/xxx.vue` に GET リクエストを送信します。このリクエストは [launch-editor](https://github.com/yyx990803/launch-editor) パッケージを呼び出して編集および対応するファイルを開きます。
   - 詳細は [Vue Devtools の『Open component in editor』機能はどのように実装されているか？](https://juejin.cn/post/7180730804467662907) を参照してください。
3. ブラウザコンソールに成功または失敗のメッセージをログ出力します

その中で `2.` と `3.` のステップはすべて文字列にラップされ、`eval` を使用して実行されます。

ここで `eval` を使用する理由は、**異なる環境で同じコードを実行するため**です。そのため、まずこの JS コードを文字列として保存し、環境（Chrome か非 Chrome か）に応じてネイティブの `eval` を使用するか、Chrome API が提供する [chrome.devtools.inspectedWindow.eval](https://developer.chrome.com/docs/extensions/reference/devtools_inspectedWindow/#method-eval) を使用するかを決定します。

### 4. Angular i18n

これは Angular が以前 i18n の数字記号や通貨記号を処理していた際の話ですが、`eval(content.toString())` を介して実行することで、渡された `content` 内の変数を宣言してアクセスできるようにしていました。

```js
function extractNumberSymbols(content, localeInfo, currencySymbols) {
  //eval script in the current context so that we get access to all the symbols
  // eslint-disable-next-line no-eval
  eval(content.toString());
  for (var propName in goog.i18n) {
    var localeID = findLocaleId(propName, 'num');
    if (localeID) {
      var info = getInfoForLocale(localeInfo, localeID);
      info.NUMBER_FORMATS = converter.convertNumberData(goog.i18n[propName], currencySymbols);
    }
  }
}
```

詳細を完全に説明するのは複雑なので、ここでは触れるだけに留めます。残りは [Source Code](https://github.com/angular/angular.js/blob/master/i18n/src/closureI18nExtractor.js) を見に行ってみてください！

## `eval` が実行する script を信頼しない場合

JavaScript 自体や異なる実行環境（Node.js とブラウザ）にはそれぞれ対応する解決策がありますが、大まかには元の実行環境から隔離することです。

#### 1. JavaScript： [ShadowRealm（提案中）](https://github.com/tc39/proposal-shadowrealm)

ShadowRealm は、固有の組み込み関数やビルトイン（Object.prototype の初期値など、グローバル変数にバインドされていない標準オブジェクト）を含む独自のグローバルオブジェクトを持つ、ユニークなグローバル環境です。

JavaScript における `eval` や `new Function` などのメソッドによって引き起こされる可能性のあるセキュリティ問題を解決し、信頼できないコードがメインアプリケーションの内部変数やリソースにアクセスできないようにし、より安全なコード隔離メカニズムを提供することが期待されています。

**ShadowRealm はまだ提案段階にあり、すべてのブラウザで完全に実装されているわけではないため**、ここでは触れるだけにします。興味のある方は深く調べてみてください。

#### 2. ブラウザ： iframe + sandbox + srcdoc

`sandbox` 属性を持つ `<iframe>` を作成し、srcdoc 属性を使用して実行したい JS コードを埋め込みます。

`sandbox` 属性は iframe に多くの制限を与えます。フォーム送信の禁止、API 送信の禁止などです。信頼できないコードを隔離するために使用できます。

- ただし、`allow-scripts` と `allow-same-origin` を併用すると、iframe はスクリプトを実行して親 DOM にアクセスでき、sandbox 配下の属性がリセットされて本来の機能を失う可能性があることに注意してください。

```html
<body>
  <button id="runCodeButton">信頼できないコードを実行</button>
  <div id="output"></div>

  <script>
    document.getElementById('runCodeButton').addEventListener('click', () => {
      const untrustedCode = `
        let ytInitialData = {
          header: {
            c4TabbedHeaderRenderer: {
              title: 'YouTuber Name',
              subscriberCountText: {
                simpleText: 'xxx subscribers',
              },
            },
          },
        };
        ytInitialData;
      `;

      const iframe = document.createElement('iframe');

      // sandbox 属性を使用してコードを隔離する
      iframe.sandbox = 'allow-scripts'
      // srcdoc 属性を使用して実行するコードを設定する
      iframe.srcdoc = `
        <script>
          ${untrustedCode}
          top.postMessage({data: ytInitialData}, '*');
        <\/script>
      `;

      onmessage = () => (event) => {
        console.log('message received');
        console.log(event.data); // データを取得！
      });

      iframe.style.display = 'none';

      // iframe をドキュメントに追加する
      document.body.appendChild(iframe);
    });
  </script>
</body>
```

#### 3. Node.js： [isolated-vm](https://www.npmjs.com/package/isolated-vm)

isolated-vm というパッケージを通じて、メインスレッドから隔離された独立した仮想マシン（virtual machine）内で JavaScript コードを実行できます。これにより、信頼できないコードは制限された環境で実行され、元のコードに影響を与えません。

## 結びに

この記事を書き始めた当初は、実は最初の 2 つの使用シーンしか含まれておらず、`eval` の使用に対して極端に否定的な態度を取っていました。しかし実際に詳しく調べてみると、使用シーンは少なからず存在します。概念を把握し、現在の状況をよく分析すれば使用できます。`eval` の判断基準は「実行する script を信頼するかどうか」、そして **Never use eval()!** で言及されたパフォーマンス問題を避けることです。

このような変化があったのは、主に Twitter で共有した後、[Huli](https://blog.huli.tw/about/) さんから Vue devtools と Angular のユースケース（[元のツイート](https://twitter.com/hulitw/status/1708017887821328486?s=21&t=yUI4r6jzTXeexUO11Jh8rg)）を提供していただき、[flandre](https://twitter.com/flandrekawaii/status/1708020622981546198?s=21&t=yUI4r6jzTXeexUO11Jh8rg) さんから提案をいただいたおかげです。もともと適当にメモして何もないと思っていたものが、意外にも多くの知識に広がり、とても面白かったです。同時に非常に感謝しています！

また、今回 `eval` に触れたのは ChatGPT で見たのがきっかけでした。**ChatGPT は確かに私の「知らないことを知らない (Unknown Unknown)」知識の境界を広げることができる**と痛感しましたが、拡張した後も理解する必要があります。なぜなら、提供された解決策はニーズを満たすことはできますが、それほど多くのことを考慮していない可能性があり、必ずしも現在の状況に最適な解決策を提供するとは限らないからです。今回のように `eval` の解決策が提示されましたが、実際にはより安全な `JSON.parse()` の解決策を使用できます。深く掘り下げた後、`eval` が意外にも dev tools や開発ツールに応用できることがわかり、これは完全に予想外のつながりでした。

**一言で言えば、日頃から自分の知識を広げ、これらの情報に対する判断力を高めることです！**

もし補足したいことや、`eval` の他の使用シーンを知っている人がいれば、ぜひコメントで教えてください 🤩！
