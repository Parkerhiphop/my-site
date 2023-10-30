---
title: Design System — 前端工程師也該知道的那些事
date: '2021-09-22'
tags: ['軟體開發', '網頁前端']
draft: false
summary:
---

在講 Design System 之前想要先提到一個觀念：「前期規劃 > 實作」。

軟體工程師的本質其實跟建築師很接近，只是他們是建造房屋，我們是建造系統。

一個好的房子，它需要良好的架構設計，會需要規劃藍圖、理解整個建物的結構，在前期規劃設計上會花很多的時間。

而這概念對應到 網頁 來說，就是 Design System！

## Design System 的前身 — Atomic Design

講 Design System 之前要先來講講 Atomic Design 這個概念。

畢竟整個網頁架構的設計的先驅可以是說由 2013 年 Brad Forst 提出的 Atomic Design 開了第一槍。

後續 Google 才在 2014 年做了 Material Design，再到 2016 年由 Airbnb 進而提出了更完整的 Design System，更多細節可以參考 [Karri Saarinen, Principle Designer at Airbnb](https://www.youtube.com/watch?v=TuLY1cYM57g) 的演講。

### 那 Atomic Design 是什麼呢？

那我們先來看看張圖：

![https://ithelp.ithome.com.tw/upload/images/20210921/20120754nnz7IF7SJF.png](https://ithelp.ithome.com.tw/upload/images/20210921/20120754nnz7IF7SJF.png)

簡單來說，就跟化學裡的原子概念一樣，原子組成分子，分成組成一個組織，只是最終組成的是一個個頁面。

而原子、分子和組織與頁面中的元素對應如下：

![https://ithelp.ithome.com.tw/upload/images/20210921/20120754GCepDSrtrW.png](https://ithelp.ithome.com.tw/upload/images/20210921/20120754GCepDSrtrW.png)

前幾天一直賣關子的精華也就在這了，Input 或 Button 等 UI 元件都是一個原子，Input + Button 可以組成一個分子（InputSearch），InputSearch 再加上其他東西則可以形成一個組織（Header），再慢慢組上去變 Templates，然後再變成一個完整的頁面。

這就是在網頁中一個個的 UI 元件如何堆疊上去的一種設計理念 — Atomic Design。

還有興趣深入的讀者們可以再去看 UX 四神湯 的 [Atomic Design 介紹文](https://medium.com/uxeastmeetswest/%E7%B6%B2%E9%A0%81%E8%A8%AD%E8%A8%88-atomic-design%E7%B0%A1%E4%BB%8B%E5%8F%8A%E5%B7%A5%E4%BD%9C%E5%AF%A6%E4%BE%8B-42e666358d52)。

## 所以 Design System 是什麼？

它有很多種定義，但比較多人推崇的依然是 Airbnb 提出的：

“**Set of shared and integrated patterns and principles that define the overall design of a product**”

指出說 Design System 是由一組共享、整合的元素及原則來定義產品整體的設計。

**這樣講應該還是有點抽象，讓我們從 Design System 解決了什麼問題開始切入：**

1. **不一致的介面體驗**
   - 舉個例子就是一個網頁可能會有很多種 button ，卻都執掌相同的功能
   - 像是一個送出按鈕一下是圓的、一下是方的、一下又是純文字無邊框的按鈕，沒有系統化地去設計介面，就會讓使用者很混亂，無法預測畫面該長什麼樣子。
2. **重複造輪子**
   - 除了設計師跟使用者很混亂以外，對前端開發者也是一樣。
   - 明明都是 Button，為什麼那邊是圓的，這邊是方的，因此常常會需要重複做好幾份功能一樣但樣式不一樣的 Button，因而導致不斷花費時間在做很多基礎設置。

### Design System 又是如何幫我們解決這些問題的呢？

就如同定義中所說的，建立一套原則來設計，區分與規範出許多設計中的單位，如顏色、字的層級、間距、尺寸大小等等的，接著依此設計出各個元件，以至於整個系統的風格。

而既然有規則，前端在開發時也可以把這些規則先寫好，後續元件和頁面的開發也都能按照這套寫好的規則，大量減少了重複的程式碼，而後續不論是在統一修正或是改寫上就也都能一次到位。

**除此之外還會有以下優點：**

1. 加速開發流程 → 減少了重複的程式碼
2. 較好的產品延展性 → 統一規格後，要修正跟擴充都不用再一個個去修改元件，修改大規則就好
3. 專注在產品本身 → 元件們的規則統一後，就能專注在頁面上的商業邏輯，提升整體網站操作流程上的使用者體驗

### Atomic Design vs Design System

Atomic Design 早先提出來，是在講述元件如何組裝成一個完整的頁面的設計理念。

而後續衍伸出的 Design System 則是在網頁中找到規則，把應用層面推到更廣，去思考元件、元件組裝上會遇到的共同需求，把這些需求拉出來到系統的層級，讓你能把整個網站的風格和設定都先定義出來，會用到它的地方可以小至一個元件，大至整個網頁。

### Design System 有缺點嗎？

當然有！但其實也不太能說是缺點啦，主要都是看使用情境、脈絡。

在軟體開發的一切都是取捨，原則、技術的演進跟應用主要都還是視情況而定，再怎麼完整的架構跟系統，都還是有其不適合的情境，於是在這邊就來提一下 Design System 使用上需要顧慮的一些情境：

1. **小專案、小型團隊不適合**
   - 團隊層面上，是人力不足，光是設計 Design System 的時間可能就要結案了，而且其實人不多的情況下溝通上也相對順暢，很多事情當下同步一下就好了。
   - 專案層面上，因為專案太小，多去弄一套 Design System 出來只會綁手綁腳，還不如就直接把專案寫完。
2. **維護跟產品迭代的考量**
   - Design System 是一套原則、定義好的元素，隨著使用它的專案越來越多，使用情境上也會越來越多樣跟複雜，因此這個系統不是說設計出來就可以直接用個十年，而是要不斷地動態去更新版本，想弄出一版就一勞永逸的話是不可能的。

---

## 元素介紹

不同的 Design system 之間會各自取捨需要定義的視覺元素，可視情況增減需要的元素。

像是 [Material Design](https://material.io/design) 和 [Shopify](https://polaris.shopify.com/design/design) 的 Design System 所包含的元素就稍有不同：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754RrTIjIaDOJ.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754RrTIjIaDOJ.png)

以下就會透過 Material Design 和 Shopify Design 來跟介紹 Design System 真正所包含的東西 — Color System, Typography, Spacing, Icon, interaction states, and Motion 。
其實色碼、字級、間距這些也就是一個網頁和 UI 元件們都會需要的基礎視覺元素，而聲音跟動畫則是進階一點的元素。

### Color System - Palette

參考 [Material Design - The Color System](https://material.io/design/color/the-color-system.html#color-usage-and-palettes)

Color System 經常會以 Palette （調色盤）來命名。

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754oVgXhFSrai.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754oVgXhFSrai.png)

顏色是網站中很重要的元素，也是能快速讓人識別品牌的方式之一

Material 管理的方式主要是定義出三種角色：

1. 主色跟副色 （ Primary & Secondary ）
2. 根據使用情境再賦予主副色不同的 深淺 （ variant ）
3. 其他 UI 顏色，例如背景、表面、錯誤、排版和圖標的顏色。

同時也可以使用主題 ( Theme ）來設定替代色 （ Alternative Colors ）以支援各種使用情境。

可以用來支援 深色模式（ Dark Mode ）。

上述第三個角色「其他 UI 的顏色 」是 Color System 中最複雜的部分，因為我們需要「定義各種情境下要使用的顏色名稱」，也就是語意化你的色碼。

這是什麼意思呢？讓我們以這張用到的色塊為例來說明：

![https://ithelp.ithome.com.tw/upload/images/20210922/201207543E6FLtp94Q.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207543E6FLtp94Q.png)

**Background**：指網頁的背景底色

**Surface**：指各種 UI 元件的背景底色，而 UI 元件的底色就像是他們的表面一樣，一個系統中 UI 元件都會共享一個相同的底色，來與背景做出對比，像是頁面的主要內容、卡片 或是 彈出框，如果應用 Surface 就能讓使用者很明顯地知道這是與背景不一樣的區塊，是獨立的元件。

**Surface Subdued**：這個命名我認為就見仁見智了，一樣是用來呈現出不同區域的色碼，需要讓使用者注意到的程度沒有 Surface 的那麼重要，但也不能與背景同色的情境，像是表單的底色就可以用這個。

這邊還是強調一下，命名的邏輯其實都是看各個 Design System 怎麼去定，而上面提到的大多已是約定俗成的取名方式，像是 Primary, Secondary, Backgrond, Surface 等等，而更細部的其他 UI 顏色定義就是看各系統之間怎麼去設定了。

以下多列了一些情境供大家再感受一下：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754RSDXC5EAZb.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754RSDXC5EAZb.png)

最後完整定義出來的 Color System 在 Figma 上面看大概會長這樣：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754x38BxV2qNS.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754x38BxV2qNS.png)

**（ 明天 Day 08 就會講如何在網頁中實作你自己的 Palette ！ ）**

### Typography

參考 [Material Design - Typography](https://material.io/design/typography/the-type-system.html#type-scale)

在 Design System 中，文字的系統有一個專有名詞叫 Typograhy ，中譯為「字體排印學」，是指透過排版使得文字易認、可讀和優美的技藝。

而「排版」則包括字體與字號的選取(h1~h6, ...）、行高以及字距的調整等。

那 Typography 實際上在 Material Design 中會有這樣的表格：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754dIAvsTl03N.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754dIAvsTl03N.png)

基本上整個 **字型（ Font Family ）**會統一，如圖就是 Roboto ，各個字級是通過**字體粗細（ Font Weight ）**、**大小 ( Font Size )**、**字母間距 ( Letter Spacing)** 還有**行高 ( Line Height )** 來體現差異的，這些屬性也就是在使用 Design System 時我們可以去客製化的選項。

有關網頁中的文字層級差不多就像圖上寫得這樣，而各個層級對應到的場景應該也挺直覺的。

在 Material-Design 中 **H1 ~ H6** 是應用在標題，**Subtitle** 是副標或小標，**Body** 會應用在大段文字，類似 p ，**Caption** 是照片的描述文字、**Overline** 就是指有底線的字。

但其實在各系統中如何去定義和使用也還是因人而異，像我之前參與過的專案就沒去定義 Subtitle 的層級，但多定義了 Input 1~3 來滿足我們的使用情境。

剩下的實作就留待 Day 09 來介紹了！

### Spacing 間距

參考 [Shopify Polaris - Spacing](https://polaris.shopify.com/design/spacing#navigation)

間距其實就是我們熟知的內距跟外距（ Padding & Margin ），一致性的間距會創造視覺平衡，讓使用者能更容易地瀏覽網頁。

需要定義主要是元素跟元素之間的距離，如下：
![https://ithelp.ithome.com.tw/upload/images/20210922/20120754SCpL7DOvhZ.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754SCpL7DOvhZ.png)!

![https://ithelp.ithome.com.tw/upload/images/20210922/201207549yaEDtSxxz.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207549yaEDtSxxz.png)

![https://ithelp.ithome.com.tw/upload/images/20210922/201207541cJHx6dNZY.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207541cJHx6dNZY.png)

最後跟 Typography 一樣，會產出一個 Spacing 的層級表，像這樣：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754eoRvQH3TCp.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754eoRvQH3TCp.png)

有了這個表之後，所有元素之間的距離都只是不同等級的 spacing 而已，設計只要在稿上標註 `spacing-1` 工程師就能知道是 4px，而工程端其實也只要在一開始寫好 CSS 變數，後續要套用跟修改都去改變數就好。

這邊在 Tailwind 很讚的是它已經幫你預設好一系列的 Spacing 了，使用 Tailwind 的話就能無痛使用，不用自己做太多設定！
![https://ithelp.ithome.com.tw/upload/images/20210922/20120754xv7AD04KhA.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754xv7AD04KhA.png)
詳見 [Tailwind Spacing](https://tailwindcss.tw/docs/customizing-spacing)

但需要注意的是，不是所有的 Padding 和 Margin 都可以用 Spacing 替代，只有那些你在使用時希望能統一縮放的距離才適用，有些情況你希望元件之間的距離是固定的情況，你就可以直接寫死。

但有些元件內部的距離是固定的情況，像是 Radio 中心的填色區域與圓框的距離就不適合用 Spacing，因為你不會希望在整個網頁間距變大後，Radio 裡面的空白也一起變大導致整個按鈕看起來很奇怪。

![https://ithelp.ithome.com.tw/upload/images/20210922/201207545YsOZNhQjH.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207545YsOZNhQjH.png)

當然這種例外情況在整個系統中佔少數，因此只要記住「 Spacing 的主要使用情境是在方便統一調整元件之間的距離」就好囉！

### Icons

參考 [Shopify Polaris - Icons](https://polaris.shopify.com/design/icons#navigation)

Icon 也是現代網站中很重要的元素，是一種視覺輔助的工具，輔助呈現常見的操作、文件、設備和目錄等等，不只增添網頁的美感，也能輔助使用者更快地理解網頁。

常見的 Icon 大概這些：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754ikiSwPQU48.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754ikiSwPQU48.png)

但 Icon 其實有無限多種，根據不同的網頁設計 Icon 也需要做對應的客製化，像是圓角的程度、中空還是填滿等等，這邊推薦幾個找 Icon 的網站：

1. [iconic](https://iconic.app/)
2. [flaticon](https://www.flaticon.com/)

有關 Icon 的實作重點會在 Day 10 中跟大家介紹。

### Interactive States

參考 [Shopify Polaris - Interaction States](https://polaris.shopify.com/design/interaction-states#navigation)

互動狀態，顧名思義就是使用者對元件進行操作後（滑鼠、觸控和鍵盤事件等等）的各種可能狀態，也是用來讓使用者知道當前元件狀態的重要元素，像是點擊按鈕就應該要有按壓 （ Pressed ）的狀態，不能按就要顯示 Disabled 等等。

舉例來說一個按鈕的狀態展示可參照下圖：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754oznBn3nzLp.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754oznBn3nzLp.png)

其中 Focused 就如其名，是焦點的意思，這個狀態可以提示使用者整個頁面的焦點 — 「正在操作的元件」，同時也是實作無障礙功能 （ A11y ）時的主要狀態，簡言之，你在網頁中一直按 Tabs 鍵時就是在切換焦點。

另外 Demo 一下網頁中 hover, activated. selected 的狀態：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754Zk7qivo3zr.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754Zk7qivo3zr.png)

網頁中可互動的 UI 元件基本上都會有這些狀態，在同一個網站中，這些狀態的呈現都需要是一致的，像是錯誤的色碼都要是同一個，以免混淆使用者。

而狀態應該要是疊加而不是唯一，如果一個元件現在同時有多個狀態被觸發，那應該是要全部顯示而不是選擇性顯示，這樣才能讓使用者正確認知到當前元件有多種狀態被觸發，也能避免我們在某些狀態上做的功能沒有被正確觸發到，像是 Focus 的狀態在上圖左下我們也能看到 Focus 與 Selected 狀態疊加時，是與單純的 Selected 不一樣的。

（實作的部分就待 Day 21 - Button 搭配 Button 來跟大家介紹了！）

### Motion / Transition

最後要來介紹的就是網頁元件的「動畫」啦！
現代網頁大量地使用動畫來創造元件的即時回饋感，打造更直覺的使用者介面，進而達到更好的使用者體驗。
標題放「動畫（Motion）」其實是有點誇張了，畢竟在元件實作上其實不過是在過場（Transition），而元件上的實作也都是稱為 Transition。

Transition 可以翻成過場或過渡，指的是動畫呈現的形式，因為元件動畫的使用情境通常是打開或關閉、出現跟消失，像是打開一個 Modal 時，從無到有的過程中會套用縮放、展開等等的動畫效果，因此是一個過場或過渡。

而 Transition 也已經有許多常見的類型，如下：

1. Collapse ： 摺疊，打開 UI 元件就像是拉開抽屜。
2. Fade in/out：漸進、出，UI 元件會慢慢地出現跟消失。
3. Slide：滑入，UI 元件會從某個方向滑進來。
4. Zoom in/out：縮放，讓 UI 元件變大或變小

其餘還有像是 rotate （旋轉）、transform （變形） 等等可以再定義，但這邊先列舉到這樣就好！

在這邊就不再多放影片了，可以搭配 Mateial 的 [Demo](https://material.io/design/motion/speed.html#easing) ， 或是 [8 SIMPLE CSS3 TRANSITIONS THAT WILL WOW YOUR USERS](https://www.webdesignerdepot.com/2014/05/8-simple-css3-transitions-that-will-wow-your-users/) 來理解一下各種 Transition 類型。

討論完類型之後，Transition 還有 持續時間 （ Duration ） 跟 緩速效果（ Easing ）這兩項重要的參數，不管是哪種過場類型，都需要去定義這兩項參數才能真正達到視覺上的過渡效果。

#### 持續時間 ( Duration )

動畫從開始到結束的時間，會根據動畫影響的畫面範圍來調整，範圍越小持續時間就會越短，通常是以毫秒來表示。

#### 緩速（ Easing ）

定義完 Transition 的時間後，接著要透過調整二次貝茲曲線來在過渡的期間內去實現不同的加減速效果。

**二次貝茲曲線是什麼？**
它是一個用來建立平滑曲線的模型，對於網頁動畫來說是不可不知的一項函數，但我們其實不用真的很理解這個函數在幹嘛，大方向只要能知道「二次貝茲曲線是透過調整兩個控制點，來決定的一個曲線，而曲線越緩的地方速度越慢。」，大家可以在 [cubic-bezier.com](http://cubic-bezier.com) 手動調參數感受一下。

#### 四種常見的緩速效果：

![https://ithelp.ithome.com.tw/upload/images/20210922/201207542Vn4XjQbTo.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207542Vn4XjQbTo.png)

**Standard Easing 標準**

- 通過花費更多時間來「減速」而不是加速，將焦點放在動畫的結束。
- 以靜止開始和結束的元素使用標準緩動。
- 快速加速並逐漸減速，以強調過渡的結束。

**Emphasized Easing 強調**

- 其實跟 Standard Easing 非常像，但比它更強調動畫的結束。
- 通常與更長的持續時間配對，以傳達更風格化的速度感。
- 快速加速並「非常緩慢地」減速，特別強調過渡的結束。

**Decelerated easing 減速**

- 元件要從螢幕外顯示進來時適用
- 動畫開始時速度是最快的，並減速到結束時的靜止狀態。

**Accelerated easing 加速**

- 就是都跟 Decelerated easing 相反
- 元件要離開螢幕的情境可使用
- 動畫是從靜止的狀態開始，接著逐漸加速到動畫結束。

那在元件實作通常會先實作一個 Transition 元件當成底層的介面，再因應不同的 Transition 類型會再實作出各個元件（像是 Fade、Collapse 等等），而剩下的實作細節就等 Day11 再跟各位介紹了！

## 小結

關於 Design System 設計方面的介紹就到這為止了！

內容就如題所說，是前端工程師都該知道的 Design System ，雖說我們不用真的下去設計，但是理解這些設計的基本元素，讓我們與設計師溝通或是自己要做 Side Project 相信都會有很大的幫助，就像我們會希望設計師懂一點技術，那設計出來的東西就不會那麼天馬行空。
而如昨天所說， Design System 就是在使用系統性的方法來減少在 UI 上的不確定，幫助我們更快地釐清跟縮小問題的範圍，確認問題是 Design System 的定義有問題、UI 元件本身設計不良、還是在組裝元件時少考慮了哪些情境，或是錯誤地混用了哪些概念等等，才不至於在與設計師溝通時需要花許多額外的成本。

透過 Design System 將網頁中各種基礎元素詳細定義過後，也能大幅減少每次差個幾 Pixel 在那邊調很久的情境，讓前端工程師能更快、更容易地讓網頁達到 Pixel Perfect （ 讓網頁的每個 Pixel 都與 UI 稿一致 ），進而能有更多時間去處理商業邏輯、效能優化等等。

References：

1. [Do we need design system? 什麼是設計系統，我們需要他來做什麼？](https://medium.com/gogolook-design/do-we-need-design-system-%E4%BB%80%E9%BA%BC%E6%98%AF%E8%A8%AD%E8%A8%88%E7%B3%BB%E7%B5%B1-%E6%88%91%E5%80%91%E9%9C%80%E8%A6%81%E4%BB%96%E4%BE%86%E5%81%9A%E4%BB%80%E9%BA%BC-bc4e62b43ba0)
2. [Design System Practice](https://medium.com/as-a-product-designer/design-system-practice-f460a60c5169)
3. [UI 使用者介面的設計系統(Design System)是什麼？](https://riven.medium.com/ui-%E4%BD%BF%E7%94%A8%E8%80%85%E4%BB%8B%E9%9D%A2%E7%9A%84%E8%A8%AD%E8%A8%88%E7%B3%BB%E7%B5%B1-design-system-%E6%98%AF%E4%BB%80%E9%BA%BC-3af06246ac9f)
