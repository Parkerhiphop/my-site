---
title: 談談 JavaScript 中的 eval、風險及替代方案
date: '2023-09-30'
draft: false
summary: 介紹 JavaScript 中的 eval，再談談為什麼不要用它，最後以 App script 爬蟲時需要讀取`<script />` 和 取得 JS 運算結果的面試考題來看它的應用，以及它的替代方案。
---

## 前言

最近用 Google Sheets 提供的 App Script 幫朋友寫了個小爬蟲，來自動化搬運跟整理網頁上資訊，發現 HTML Source 裡`<script />` 的資訊無法直接被讀取，在問 ChatGPT 時，它突然給了我一個有用到 `eval` 的實作，之前只知道不要用它，這次決定來認真理解一下 **什麼時候可能用到** ， **為什麼不要用** ，以及 **有什麼替代方案** 。

這篇文章會簡單介紹 `eval` 後，並帶上一個使用情境跟一個面試考題。

## `eval` 基本介紹

`eval(script);` 是一個 JavaScript 內建函數。

它可以將傳入的 script String 視為 JavaScript 表達式（Expression）或語句（Statement）來執行。

> **使用情境：「你信任你要執行的 script 以及 想把 String 當 JS Code 來執行」**

### Return value

若參數為 String，則會回應 JS 實際執行的結果，如果該 String 不是可執行的 JS Code，則回傳 `Error: {script} is not defined`

若參數不是 String，則直接回傳參數。

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

可以直接把字串拿來當 JS 執行聽起來就很不妙，可以看到 MDN 在 [Never use `eval()`!](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!) 中指出了使用 `eval` 可能有的四個原因：

### 1. Security Risks

只要攻擊者能有辦法置換傳入的 `script` 參數就能透過它執行惡意程式（取得你本地的資料、透過你發請求等等）。

### 2. Performance Impact

它會直接呼叫 JS 直譯器，所以無法使用現代 JS engines 在讀取 JS 時做的各種優化。

### 3. Variable Name Lookups

雖然 JS 是直譯語言，但任何語言要讓機器（ex: 電腦）來執行時，依然還是要轉成機器語言（machine code），電腦才能讀得懂並執行。

但因為 eval 可能會宣告變數(Variable) ，所以如果在瀏覽器上執行的話，瀏覽器會需要去檢視 JS 直譯器轉譯 JavaScript 得出的機器語言（machine code）中的變數名稱有沒有存在、重疊或改變。

這個過程非常耗效能。

### 4. Minification Issues

> Minifiers 是一個可以縮小 JS Code 的工具。
> 當我們在寫程式時會為了可讀性放很多空格、標點符號或是好讀的變數名稱，但電腦要執行的話，這些都是不需要的，透過 Minifiers 就能讓 JS Code 極簡化，節省空間。

因為 eval 一定是在 runtime 讀到才能執行， Minifiers 這種工具通常是在 build time 打包程式碼時進行處理。

所以如果 `eval(script)` 的 `script` 很大一包就會浪費很多空間，無法進行優化。

---

## 使用情境

### 1. App Script 爬蟲時讀取 `<script />` 的內容

只要填入「 YouTuber 網址」，再去 App Script 上按執行就可以自動填入 YouTuber 的「頻道名稱」和「訂閱人數」。

雖然 App scripts 不能模擬出瀏覽器，但可以讀取 HTML source，而就算 JS 再怎麼 uglify，要顯示的 String 一定還會是原狀，所以只需要找一下想要的資料在整包 HTML 裡面位於哪個地方就好。

在 YouTuber 的 about 頁面點右鍵再選取「View Page Source」，可以找到「頻道名稱」和「訂閱人數」是在以下這段 `script` 裡面的 `ytInitialData`：

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

在 App Script 中，可以用 `UrlFetchApp.fetch` 去 GET 一個 url，並用 `getContentText` 取得該頁面所有的 HTML Code。

再根據先前對於 HTML 結構的觀察，我們可以再透過正則表達式取得我們想要的程式碼段落。

```js
let response = UrlFetchApp.fetch(youtubeUrl);

let pageSource = response.getContentText();

let jsCodeMatch = pageSource.match(/var ytInitialData = (\{[^]+?\});/);
```

接下來是不是只要再寫一次正則來 match 就可以取得我們要的資料了呢？

```js
let titleMatch = pageSource.match(/title: '([^']+)'/);
let subscriberCountMatch = pageSource.match(/simpleText: '([^']+)'/);
```

**很可惜地不行！**

從上面的的 raw data 可以看到它是被包在 `<script />` 裡面，而 HTML source 裡面的 `<script />` 雖然我們看得到，但對程式來說其實是 visible 的，無法直接讀取。

#### 透過 `eval` 執行 HTML Source 的 `<script />` 並取得底下變數

這時候 `eval` 就登場啦，`eval` 可以執行作為 String 被傳入的 JS Code，而我們若把找到的那段 script 丟進去 `eval` 執行，`ytInitialData` 就會在此被宣告跟建立，因此我們也就可以直接去存取 `ytInitialData` 取得它底下 Property 啦！

```js
// Use eval to execute the script to declare the `ytInitialData` variable inside script
let jsCodeMatch = pageSource.match(/var ytInitialData = \{[^]+?\};/);

if (jsCodeMatch && jsCodeMatch.length >= 1) {
  // Extract the JavaScript code block
  let jsCode = jsCodeMatch[0];

  // Execute the JavaScript code using eval()
  eval(jsCode);

  // ytInitialData is declared.
  let title = ytInitialData.header.c4TabbedHeaderRenderer.title;
  let subscriberCount = ytInitialData.header.c4TabbedHeaderRenderer.subscriberCountText.simpleText;
}
```

到這邊功能就已經做完了，但其實 `eval` 如上所述有很多問題，基本上不建議使用。

#### 替代方案 `JSON.parse`

可以呼叫 `JSON.parse()` 來把那段 script 解析出來，並且一樣可以直接存取解析出來的 JSON data，這樣就不用像是開後門一樣使用 `eval` 執行外部的程式碼了！

```js
// Use regular expressions to find the JavaScript code block
let jsCodeMatch = pageSource.match(/var ytInitialData = (\{[^]+?\});/);

if (jsCodeMatch && jsCodeMatch.length >= 2) {
  // Extract the JavaScript code block containing JSON data
  let jsCode = jsCodeMatch[1];

  // Parse the JSON data
  let jsonData = JSON.parse(jsCode);

  // Access the extracted data
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

### 2. 面試題：取得 JS 計算結果

> 在 `const a = '1 + 2 + 3';` 中，a 是一個包含 JavaScript Expression 的 String
>
> 該如何取得 a 變數運算完的結果？

這題是來自於：[是 Ray 不是 Array](https://israynotarray.com/javascript/20230321/3298342448/) 的文章。

透過 `eval` 可以很快地得到結果，但它有如上所述的問題，有沒有更萬無一失的作法？

```js
const a = '1 + 2 + 3';

eval(a); // 6
```

#### String 轉 Array 並用 Array 操作來運算

如果是 String 的話，還有一種常見的作法就是把它轉成 Array，接著就可以使用 Array 很多方便的 methods 來執行了。

```js
const a = '1 + 2 + 3';
const b = a.split(' + '); // [ "1", "2", "3" ]，將字串依照內容切割成陣列
const c = b.map(Number); // [ 1, 2, 3 ]，將裡面的陣列轉換成數字
const total = c.reduce((acc, cur) => acc + cur); // 6，使用 reduce 來做相加
```

### 3. Vue devtools

在 [Vue devtools](https://github.com/vuejs/devtools/tree/v6.5.0) 中其實有一個很方便的功能「[Open component in editor](https://devtools.vuejs.org/guide/open-in-editor.html)」，可以直接在輯器上打開對應的 Component Source Code。

![Vue devtools](/software-development/talk-about-js-eval/vue-devtools.png)

而這個功能的執行就有使用到 `eval`：

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

[點我看 Source Code](https://github.com/vuejs/devtools/blob/v6.5.0/packages/shared-utils/src/util.ts#L716)

簡單分析一下這段程式碼：

1. 處理反斜線，確保 filename 是正確路徑
2. 對 `{your_localhost}/_open-in-editor?file=/path/to/xxx.vue` 發送一個 GET Request，這個 request 會去呼叫 [launch-editor](https://github.com/yyx990803/launch-editor) 這個套件來打開編輯及對應文件。
   - 更多細節可參考 [Vue Devtools 的『Open component in editor』功能是如何实现的？](https://juejin.cn/post/7180730804467662907)
3. Log 成功或失敗的訊息在 Browser Console

其中 `2.` 跟 `3.` 的步驟都在包成字串再用 `eval` 去執行的。

這邊使用 `eval` 的原因是要**在不同環境執行同一段程式碼**，所以先把這段 JS code 用 string 存起來，再根據環境（Chrome 或 非 Chrome）決定使用原生 `eval` 還是 Chrome API 提供的 [chrome.devtools.inspectedWindow.eval](https://developer.chrome.com/docs/extensions/reference/devtools_inspectedWindow/#method-eval)。

### 4. Angular i18n

這是 Angular 之前再處理 i18n 的數字符號跟貨幣符號時，可以透過 `eval(content.toString())` 執行後可以讓傳入的 `content` 中的變數被宣告跟存取。

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

由於要詳細解釋完比較複雜，所以就先點到這邊，其餘可以進行去 [Source Code](https://github.com/angular/angular.js/blob/master/i18n/src/closureI18nExtractor.js) 上看！

## 當你不信任 `eval` 要執行的 script 時

在 JavaScript 本身的以及不同的執行環境（Node.js 和 瀏覽器 ）都有對應的解決方法，但大致上都是與原本的執行環境進行隔離。

#### 1. JavaScript： [ShadowRealm（提案中）](https://github.com/tc39/proposal-shadowrealm)

ShadowRealm 是一個獨特的全域環境，擁有自己的全域對象，其中包含自己的內在函數和內建函數（未綁定
到全域變數的標準對象，例如 Object.prototype 的初始值）。

有望能解決 JavaScript 中 `eval` 和 `new Function` 等方法可能引發的安全問題，使得不信任的程式碼無法訪問主應用程式的內部變數或資源，提供更安全的程式碼隔離機制。

**由於 ShadowRealm 還在提案中，尚未被所有瀏覽器完全實現**，這邊也就先點到為止，有興趣的人可以去深究。

#### 2. 瀏覽器： iframe + sandbox + srcdoc

建一個帶有 `sandbox` 屬性的 `<iframe>` ，並使用 srcdoc 屬性將想要執行的 JS Code 嵌入。

`sandbox` 屬性會給予 iframe 諸多限制，像是禁止表單送出、禁止發送 API 等等。可以用於隔離不信任的程式碼。

- 但注意 `allow-scripts` 和 `allow-same-origin` 一起用時，iframe 就可以運行 script 並訪問 parent DOM ，甚至會導致 sandbox 底下的屬性可以被重置，失去了原本的功用。

```html
<body>
  <button id="runCodeButton">執行不信任的程式碼</button>
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

      // 使用 sandbox 屬性來隔離程式碼
      iframe.sandbox = 'allow-scripts'
      // 使用 srcdoc 屬性設定要運行的程式碼
      iframe.srcdoc = `
        <script>
          ${untrustedCode}
          top.postMessage({data: ytInitialData}, '*');
        <\/script>
      `;

      onmessage = () => (event) => {
        console.log('message received');
        console.log(event.data); // 取得資料！
      });

      iframe.style.display = 'none';

      // 將 iframe 添加到文檔中
      document.body.appendChild(iframe);
    });
  </script>
</body>
```

#### 3. Node.js： [isolated-vm](https://www.npmjs.com/package/isolated-vm)

透過 isolated-vm 這個套件可以在一個獨立的、與主線程隔離的虛擬機(virtual machine)中執行 JavaScript 程式碼，讓不信任的程式碼將在一個受到限制的環境中運行，就不會影響到原本的程式碼。

## 結語

這篇文章剛寫好時，其實只包含了前兩個使用情境，並且對於 `eval` 的使用採取極端否定的態度，但其實仔細找還是有不少使用的情境，只要掌握觀念，分析好當前情境就可以使用，而對於 `eval` 的判斷依據就是「信不信任你要執行的 script」，以及避免 **Never use eval()!** 提到的效能問題。

會有這樣的轉變主要是分享到 Twitter 後，得到 [Huli](https://blog.huli.tw/about/) 提供 Vue devtools 和 Angular 的使用案例（[Original Tweet](https://twitter.com/hulitw/status/1708017887821328486?s=21&t=yUI4r6jzTXeexUO11Jh8rg)）和 [flandre](https://twitter.com/flandrekawaii/status/1708020622981546198?s=21&t=yUI4r6jzTXeexUO11Jh8rg)　的建議，原本隨筆紀錄，然後以為沒什麼的東西意外延伸了很多知識挺有趣的，同時也非常感謝！

另外這次會接觸到 `eval` 是在 ChatGPT 上看到的，深感 **ChatGPT 確實能擴充我對於「不知道的不知道(Unknown Unknown)」的知識邊界** ，但擴充了之後仍然需要去理解，因為它提供的解法雖然可以符合需求，但可能沒有考慮那麼多，也不一定會提供符合當前情境的最佳解，像這次就是提供 `eval` 的解法，但其實是可以使用更安全的 `JSON.parse()` 解法，在深入探討後，也發現了 `eval` 竟然可以應用在 dev tools 和 開發工具上，這算是完全沒想到的連結。

**一言以蔽之，平常要多擴充自己的知識，來增加對於這些資訊的判斷力！**

如果有人想補充或知道 `eval` 其他的使用情境，歡迎留言告訴我 🤩！
