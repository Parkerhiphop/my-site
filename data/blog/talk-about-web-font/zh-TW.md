---
title: 談談網頁中的字體 — 設計、檔案格式與前端載入
date: '2021-10-28'
tags: ['軟體開發', '網頁前端']
draft: false
summary: 介紹字體設計流程（不專業版）、字體的檔案有哪些、網頁如何使用字體。
---

前陣子 設事未深 的字型大補帖引起了一波領取字體的熱潮，除了在簡報、海報、社群貼文之外，你有想過在網頁上是如何使用字體的嗎？

![typewritter](https://cdn-images-1.medium.com/max/800/0*OEf5PYLRWXCaS_Op)

photo by [David Klein](https://unsplash.com/@diklein) on [Unsplash](https://unsplash.com/)

之前 [設事未深](https://www.instagram.com/designnotdeep/) 的字型大補帖引起了一波字體的熱潮，那除了在簡報、海報、社群貼文之外，你有想過在網頁上是如何使用字體的嗎？

於是今天就來先分享一些關於在網頁上使用字體的知識和技術細節，前半算是科普，後半關於網頁如何使用字體的部分談比較多技術，不是前端工程師的就斟酌觀看囉！

**藉由這篇文章，我將會告訴你 👇**

1.  一個字體的誕生（不專業版）
2.  字體的檔案有哪些
3.  網頁如何使用字體

### 字體設計流程

在開始介紹之前，因為實在太好奇字體如何被設計出來的，於是就問了一下身為設計師的朋友一些關於字體設計的問題，在這邊簡短介紹一下流程開個頭。

以繁體中文來說，會先做幾個固定的字 ，這些字做完就能大概涵蓋到中文字的筆畫規律，像是「永」就包括了所有不同筆劃，「鷹」則是可以測試有很多橫筆的情況等等。

![](https://cdn-images-1.medium.com/max/800/0*Yn16A9M8O252zZw9.jpg)

[https://www.easyatm.com.tw/wiki/%E6%B0%B8%E5%AD%97%E5%85%AB%E6%B3%95](https://www.easyatm.com.tw/wiki/%E6%B0%B8%E5%AD%97%E5%85%AB%E6%B3%95)

接著可能會使用 [**Glyphs**](https://glyphsapp.com/) 或 [**FontForge**](https://fontforge.org/en-US/) 等軟體來調整各項細節，把大部分中文字做出來後，擺在一起確認一致性，最後就是一股作把剩下的中文字都做完。

#### 網頁中的繁體中文有多少字要設計？

關於中文字的總量，在教育部的[異體字字典](https://dict.variants.moe.edu.tw/variants/rbt/home.do)收錄了十萬多字，而根據 Google Font 有提供的[思源黑體](https://richer.tw/google_font_info/noto-serif-tc-cut)檔案來看，網頁上會需要載入的字數大概是一萬五千字左右。

不專業地介紹完大致上的流程後，設計的細節就不再這邊誤人子弟了，有興趣的可以去看 [justfont blog](https://blog.justfont.com/) 會有更多關於字體的好文可以看。

### **字體一般來說都以怎樣的檔案格式儲存呢？**

起初電腦的文字都是以點陣圖的方式呈現，這階段與印刷文字還是有很大的落差，因而字體就算設計出來了，也很難在電腦上完整呈現其美感。

但在 1984 年 Adobe 推出了 PostScript 後，電腦開始能夠顯示向量版的文字，效果甚至能跟印刷文字差不多，因而開啟了在電腦上應用各種字體的可能性。

點陣圖與向量圖的差異 👇

![](https://cdn-images-1.medium.com/max/800/0*oABgV6XVSdJyuDPP.png)

[https://digitalmediaandvisualarts.blogspot.com/2016/10/raster-vs-vector.html](https://digitalmediaandvisualarts.blogspot.com/2016/10/raster-vs-vector.html)

接著就是各大軟體龍頭競相開發字體的格式，對歷史有興趣的可以去看 [格式大戰：你用的字型檔，是巨頭們大戰後的產物](https://blog.justfont.com/2017/07/opentype-wars/)，在這邊先逐一介紹大戰過後的這七種字體的檔案格式，其中除了 ttc 之外，都是可供網頁載入的字體。

#### **1. .ttf (TrueType Font)**

- 1989 年，由於 Adobe 不願公佈 PostScript 的商業機密，因此 Apple 和 MicroSoft 合作開發了新的字型格式 TrueType (.ttf)
- 最早也是最廣泛使用的格式，在網路上下載的字體大多都是 ttf 格式

#### 2. .otf (OpenType Font)

- 1997 年，MicroSoft 又和 Adobe 開發了 OpenType (.otf) ，是對 TrueType 的擴充，同時也支援 Unicode 萬國碼。
- 2005 年時被 ISO 納入標準，稱為 Open Font Format (off)

#### 3. .ttc (TrueType Collection)

- 1989 年釋出，是 TTF 或  .OTF 的集合體，主要是來整合同一種字型的文件，像是思源系列就可以包成一個 ttc 檔來減少檔案大小。
- **網頁不能直接載入它，你只能個別載入裡面的某個 ttf 或 otf 檔。**

#### 4. .eot

- 跟字體打交道很久的人可能會看過這格式，是 IE 主要使用的格式，但也因此要隨著 IE 走入歷史了。

#### 5. .woff (Web Open Font Format)

- 2010 年 由 Mozilla、Type Supply、LettError 和其它組織協力開發的[「網路開放字型格式」](https://developer.mozilla.org/zh-TW/docs/Web/Guide/WOFF)。
- woff 格式的字體檔案經過壓縮，相較於 ttf 和 otf 能大幅減輕瀏覽器載入字體的負擔，也加快了載入速度。
- 目前 web 字體的主流之一

#### 6. .woff2

- woff 的 2.0，主要是壓縮得更徹底，相同的字體大約可以比 woff 再壓縮 20% 到 30% 左右的大小。
- 現在開發時其實可以優先考慮使用 woff2 的格式，並根據支援度處理

#### 7. .svg (Scalable Vector Graphics)

- 電腦最初在字體上的一大演進就是從點陣圖進化到向量圖，因此也一定可以在純向量圖格式來表現字體。
- svg 的主要應用是在 icon font ，用來減少圖片的使用率，也能讓 icon 像文字一樣調整大小、粗細和顏色。

### 在網頁上如何載入字體？

在網頁上載入字體時，主要是作為 CSS 的資源載入，並使用 **font-face** 屬性來載入。

#### font-face

> 引入外部字體檔案，客製化相關的 CSS  屬性。

這裏先直接使用 [MDN](https://developer.mozilla.org/zh-TW/docs/Web/CSS/@font-face) 的範例來跟大家說明基本語法 👇

實際用起來大概是這樣 👇

[MDN Demo](https://media.prod.mdn.mozit.cloud/attachments/2012/07/09/2469/ca10cbddcc6c17a120ada25291da053c/webfont-sample.html)

**_對使用 font-face 有一些感覺後，接著來詳細說明我們可以怎麼使用它 👇_**

#### **font-family**

> 定義 font-face 的名稱，可以不用跟字體原本的檔案一樣，之後在 font-family 就只需要使用這名稱就可以使用整組 font-face 的屬性。

而非 font-face 裡的 font-family 可以透過逗點來連接備用字體，即會依照順序取用字體。

#### src

> 用 url 指定要載入的外部字體檔案路徑、 local 來使用本地的字體。

下面的範例就會先用使用者電腦裡的 Helvetica Neue Bold 字體，當兩個 Local 字體都沒有時，才會額外去下載 MgOpenModernaBold.ttf 的字體

    @font-face {  font-family: MyHelvetica;  src: local("Helvetica Neue Bold"),  local("HelveticaNeue-Bold"),  url(MgOpenModernaBold.ttf);  font-weight: bold;}

而不只是能載入多種字體，也可以用 **format** 來載入多種字型的格式來處理瀏覽器的支援度問題。

    @font-face {  font-family: 'MyWebFont';  src:  url('myfont.woff2') format('woff2'),        url('myfont.woff') format('woff');}

#### unicode-range

> 可以讓瀏覽器依據給定的萬國碼範圍來下載字體

unicode 有在上面提到是「萬國碼」的意思，而萬國碼的出現顧名思義就是要解決各國的文字資料格式不統一，而無法正常顯示的問題，主要是為所有文字定義了一個代碼，讓不同語言和平台都能透過 unicode 正常顯示文字。

- 可以在 [Unicode 編碼轉換工具](https://www.ifreesite.com/unicode-ascii-ansi.htm) 看看文字實際轉換的結果！

而使用時主要會想達成以下兩種效果 👇

1.  只下載當前頁面上需要用到的部分，來減少載入大小跟加快載入速度
2.  建立複合式的字體，一個單字、一段話裏可能含有多種字體

以下借用 [GTW](https://blog.gtwang.org/web-development/css-font-face/#comments) 寫的範例來說明：

    /* 備用字型 - 大小：4.5MB */@font-face {  font-family: DroidSans;  src: url(DroidSansFallback.woff);  /* 沒有指定萬國碼區間，預設涵蓋所有的範圍 */}

    /* 日文 - 大小： 1.2MB */@font-face {  font-family: DroidSans;  src: url(DroidSansJapanese.woff);  unicode-range: U+3000-9FFF, U+ff??;}

    /* 英文字型與一些符號等 - 大小： 190KB */@font-face {  font-family: DroidSans;  src: url(DroidSans.woff);  unicode-range: U+000-5FF, U+1e00-1fff, U+2000-2300;}

#### font-display

> 主要是在指定字體載入的期間，網頁因此被阻塞時，該如何顯示跟替換字體的策略，通常是希望能減少網頁被阻塞的時間以優化效能。

**有以下策略可選 👇**

**1\. auto：**順從瀏覽器的預設值，通常是 block。

**2\. block：**字體載完之前，會暫時隱藏文字，直到載完後會馬上替換。

但其實這段時間瀏覽器會載入一個看不見的 placholder 在那邊佔位（以畫面來講會是一面空白），等到字體載完再馬上替換掉 placeholder ，這個效果也有專有名詞 **FOIT (flash of Invisible Text)** ，指稱看不見的文字一閃而過。

![](https://cdn-images-1.medium.com/max/800/0*vLZs0W5YqME4acCw.png)

[https://www.w3cplus.com/css/font-display-masses.html](https://www.w3cplus.com/css/font-display-masses.html)

**3\. swap：**字體載完之前，瀏覽器會使用備用字體顯示文字（備用字體在 font-family 定義） ，當字體載完後一樣會馬上替換。

這效果的專有名詞是 **FOIT (flash of Unstyle Text)** ，相較於 FOIT ，是指沒有客製化樣式的文字一閃而過，基本上能確保正常顯示的 swap 在大多數情況下都很好用。

![](https://cdn-images-1.medium.com/max/800/0*D0fpzSC_xcgLxcKr.png)

[https://www.w3cplus.com/css/font-display-masses.html](https://www.w3cplus.com/css/font-display-masses.html)

**4\. fallback**

介於 auto 和 swap 之間，會很短暫地隱藏文字（約 100 毫秒 ），若字體還沒載好，就會先顯示備用的字體。而字體載好後，一樣會替換。

**5\. optional**

載入時的處理跟 fallback 一樣，但是瀏覽器會自己判斷是否要使用自定義的字體，如果瀏覽器判斷載入速度太慢，就會直接捨棄自定義的字體。

---

那其他比較常見也淺白的字體屬性就不再這邊一一贅述了，可再參考 [MDN — font](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) 就有很完整的範例！

其實原本還想繼續介紹 Google Font 開源字體，與繁體字體目前在網頁使用上遇到的一些困難，但覺得今天的篇幅已經夠多了，就留待下篇再介紹囉！

如果今天的內容有哪裡有問題、建議或想討論的都歡迎留言告訴我！

---

最後，喜歡的話歡迎幫我拍手，拍手最多可以拍 50 下，依據你覺得有幫助的程度幫我拍手就好，這也可以成為讓我調整的依據 🙌

### References

- [https://blog.justfont.com/2017/07/opentype-wars/](https://blog.justfont.com/2017/07/opentype-wars/)
- [https://www.mindscmyk.com/2021/02/26/主題知識](https://www.mindscmyk.com/2021/02/26/%E4%B8%BB%E9%A1%8C%E7%9F%A5%E8%AD%98)｜三個常見字型：ttf-otf-ttc-副檔名的差異？/
- [https://developer.mozilla.org/zh-TW/docs/Web/Guide/WOFF](https://developer.mozilla.org/zh-TW/docs/Web/Guide/WOFF)
- [https://www.twblogs.net/a/5d3f76babd9eee5174229d3f](https://www.twblogs.net/a/5d3f76babd9eee5174229d3f)
- [https://tools.wingzero.tw/article/sn/91](https://tools.wingzero.tw/article/sn/91)
- [https://css-tricks.com/snippets/css/using-font-face/](https://css-tricks.com/snippets/css/using-font-face/)
- [https://www.w3cplus.com/css/font-display-masses.html](https://www.w3cplus.com/css/font-display-masses.html)
