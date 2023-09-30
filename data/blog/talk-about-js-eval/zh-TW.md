---
title: 談談 JavaScript 中的 eval、風險及替代方案
date: '2023-09-30'
tags: ['JavaScript', '軟體開發']
draft: false
summary: 介紹 JavaScript 中的 eval，再談談為什麼不要用它，最後以 App script 爬蟲時需要讀取 `<script />` 和 取得 JS 運算結果的面試考題來看它的應用，以及它的替代方案。
---

## 前言

最近用 Google Sheets 提供的 App Script 幫朋友寫了個小爬蟲，來自動化搬運跟整理網頁上資訊，發現 HTML Source 裡`<script />` 的資訊無法直接被讀取，在問 ChatGPT 時，它突然給了我一個有用到 `eval` 的實作，之前只知道不要用它，這次決定來認真理解一下**什麼時候可能用到**，**為什麼不要用**，以及**有什麼替代方案**。

這篇文章會簡單介紹 `eval` 後，並帶上一個使用情境跟一個面試考題。

## eval 基本介紹

`eval(script);` 是一個 JavaScript 內建函數。

主要用法：將傳入的 script String 視為 JavaScript 表達式（Expression）或語句（Statement）來執行。

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

雖然剛剛才介紹完，但馬上就要來請大家不要使用 `eval` 哈哈！

MDN 在 [Never use `eval()`!](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!) 指出了以下四個原因：

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

## 使用情境一：App Script 爬蟲時讀取 `<script />` 的內容

只要填入「 YouTuber 網址」，再去 App Script 上按執行就可以自動填入 YouTuber 的「頻道名稱」和「訂閱人數」。

{/* TODO: 放影片 */}

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

### 透過 `eval` 執行 HTML Source 的 `<script />` 並取得底下變數

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

**那還能怎麼做？**

### 替代方案 `JSON.parse`

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
    let subscriberCount = jsonData.header.c4TabbedHeaderRenderer.subscriberCountText.simpleText.replace('subscribers', '');
  }
}
```

## 使用情境二： 取得 JS 計算結果

> 在 `const a = '1 + 2 + 3';` 中，a 是一個包含 JavaScript Expression 的 String
> 
> 該如何取得 a 變數運算完的結果？

這來自於：https://israynotarray.com/javascript/20230321/3298342448/ 的文章。

透過 `eval` 可以很快地得到結果，但 `eval` 是一個不該被使用的方法，所以可以先當作沒有這個解法。

```js
const a = '1 + 2 + 3';

eval(a); // 6
```

### String 轉 Array 並用 Array 操作來運算

如果是 String 的話，還有一種常見的作法就是把它轉成 Array，接著就可以使用 Array 很多方便的 methods 來執行了。

```js
const a = '1 + 2 + 3';
const b = a.split(' + '); // [ "1", "2", "3" ]，將字串依照內容切割成陣列
const c = b.map(Number); // [ 1, 2, 3 ]，將裡面的陣列轉換成數字
const total = c.reduce((acc, cur) => acc + cur); // 6，使用 reduce 來做相加
```

## 結語

以上就是 `eval` 的介紹，以及兩個可以使用到它的地方，以及替代方案。

**必須再重申 `eval` 是一個不該被使用的東西**，一定有替代方案，像是今天介紹的 `JSON.pars()` 和 `String To Array`。

大方向都是不能直接執行外部的 JS Code，一定要預處理傳入的 String 來避免執行到惡意程式片段。

同時也警惕自己，ChatGPT 提供的解法雖然可以符合需求，但它可能不會考慮那麼多，也不一定會提供符合當前情境的最佳解，像這次就是提供了有嚴重資安問題的程式碼，平常還是要多擴充自己的知識，來增加對於這些資訊的判斷力！

如果有人想補充或知道 `eval` 其他的使用情境，歡迎留言告訴我！
