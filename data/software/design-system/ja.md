---
title: Design System — フロントエンドエンジニアも知っておくべきこと
date: '2021-09-22'
draft: false
summary: ソフトウェアエンジニアの本質は実は建築家に非常に近く、彼らが家を建てるのに対し、私たちはシステムを構築します。良い家には優れた建築設計が必要であり、設計図の計画、建物全体の構造の理解、事前の計画設計に多くの時間を費やします。この概念はウェブページにおける Design System に相当します！
tags: ['Software Development', 'Web Development', 'Design System', 'CSS', 'UI/UX']
---

> **注:** この記事は AI によって翻訳されています。もし不自然な表現や誤りがありましたら、メールやその他の手段でお知らせいただけると幸いです。フィードバックをいただけると助かります！

Design System について話す前に、一つの概念に触れておきたいと思います。「事前計画 > 実装」。

ソフトウェアエンジニアの本質は実は建築家に非常に近く、彼らが家を建てるのに対し、私たちはシステムを構築します。

良い家には優れた建築設計が必要であり、設計図の計画、建物全体の構造の理解、事前の計画設計に多くの時間を費やします。

この概念はウェブページにおける **Design System** に相当します！

## Design System の前身 — Atomic Design

Design System について話す前に、**Atomic Design** という概念について話す必要があります。

結局のところ、ウェブページアーキテクチャ設計全体の先駆者は、2013 年に Atomic Design を提唱し、最初の口火を切った Brad Frost だと言えるでしょう。

その後、Google が 2014 年に Material Design を作成し、2016 年に Airbnb がより完全な Design System を提唱しました。詳細は [Karri Saarinen, Principle Designer at Airbnb](https://www.youtube.com/watch?v=TuLY1cYM57g) の講演を参照してください。

### では、Atomic Design とは何でしょうか？

まずこの画像を見てみましょう：

![https://ithelp.ithome.com.tw/upload/images/20210921/20120754nnz7IF7SJF.png](https://ithelp.ithome.com.tw/upload/images/20210921/20120754nnz7IF7SJF.png)

簡単に言えば、化学の原子の概念と同じように機能します。原子は分子を形成し、分子は組織を形成しますが、最終的に形成されるのは個々のページです。

ページ内の原子、分子、組織、要素の対応関係は次のとおりです：

![https://ithelp.ithome.com.tw/upload/images/20210921/20120754GCepDSrtrW.png](https://ithelp.ithome.com.tw/upload/images/20210921/20120754GCepDSrtrW.png)

ここ数日もったいぶっていた本質はここにあります。Input や Button などの UI コンポーネントは一つの原子です。Input + Button は一つの分子（InputSearch）を形成できます。InputSearch に他のものを加えると一つの組織（Header）を形成でき、さらに積み重なって Templates になり、最終的に完全なページになります。

これが、ウェブページ内で個々の UI コンポーネントがどのように積み重なっていくかという設計思想 — Atomic Design です。

興味のある読者は、UX 四神湯の [Atomic Design 紹介記事](https://medium.com/uxeastmeetswest/%E7%B6%B2%E9%A0%81%E8%A8%AD%E8%A8%88-atomic-design%E7%B0%A1%E4%BB%8B%E5%8F%8A%E5%B7%A5%E4%BD%9C%E5%AF%A6%E4%BE%8B-42e666358d52) をさらに参照してください。

## それで、Design System とは何ですか？

多くの定義がありますが、より多くの人に支持されているのはやはり Airbnb が提唱したものです：

“**Set of shared and integrated patterns and principles that define the overall design of a product**”

Design System は、製品全体の設計を定義する、共有され統合された一連の要素と原則によって定義されると指摘しています。

**これではまだ少し抽象的かもしれませんので、Design System がどのような問題を解決するのかという点から切り込んでみましょう：**

1.  **一貫性のないインターフェース体験**
    - 例えば、一つのウェブページに多くの種類のボタンがあり、すべて同じ機能を担っている場合があります。
    - ある送信ボタンは丸く、あるボタンは四角く、またあるボタンはボーダーなしのテキストのみだったりします。体系化されたインターフェース設計がないと、ユーザーは混乱し、画面がどうあるべきかを予測できなくなります。
2.  **車輪の再発明**
    - デザイナーやユーザーが混乱するだけでなく、フロントエンド開発者にとっても同様です。
    - 同じ Button なのに、なぜあちらは丸くてこちらは四角いのか。そのため、機能は同じでもスタイルが異なる Button を何度も重複して作成する必要が生じ、基礎設定に時間を費やし続けることになります。

### Design System はどのようにしてこれらの問題を解決してくれるのでしょうか？

定義にあるように、設計のための一連の原則を確立し、色、フォントの階層、間隔、サイズなど、設計における多くの単位を区分・規定し、これに基づいて各コンポーネントを設計し、システム全体のスタイルに至るようにします。

ルールがあるので、フロントエンドは開発時にこれらのルールを先に書いておくことができます。その後のコンポーネントやページの開発も、この書かれたルールに従うことができ、重複するコードを大幅に削減できます。後で統一して修正したり書き直したりする場合でも、一発で完了できます。

**さらに、次のような利点もあります：**

1.  開発プロセスの加速 → 重複コードの削減
2.  製品の拡張性の向上 → 仕様を統一した後、修正や拡張のためにコンポーネントを一つずつ修正する必要がなく、大元のルールを修正するだけで済みます。
3.  製品そのものへの集中 → コンポーネントのルール統一後、ページ上のビジネスロジックに集中でき、ウェブサイト全体の操作フローにおけるユーザー体験を向上させることができます。

### Atomic Design vs Design System

Atomic Design はより早く提唱され、コンポーネントがどのように組み立てられて完全なページになるかという設計思想を述べています。

その後派生した Design System は、ウェブページの中にルールを見出し、適用レベルをより広げ、コンポーネントやコンポーネントの組み立てで遭遇する共通のニーズを考え、これらのニーズをシステムレベルに引き上げ、ウェブサイト全体のスタイルや設定を先に定義できるようにします。それが使用される場所は、一つのコンポーネントのような小さなものから、ウェブページ全体のような大きなものまであります。

### Design System に欠点はありますか？

もちろんあります！しかし、それは欠点というよりは、主に使用シーンや文脈によります。

ソフトウェア開発のすべてはトレードオフです。原則、技術の進化と応用は主に状況次第です。どんなに完全なアーキテクチャやシステムでも、適さない状況はあります。そこで、Design System を使用する際に考慮すべきいくつかの状況を挙げておきます：

1.  **小規模プロジェクト、小規模チームには不向き**
    - チーム面では、人手不足の場合、Design System を設計する時間だけでプロジェクトが終わってしまうかもしれません。また、人数が少ない場合はコミュニケーションも比較的スムーズで、多くのことはその場で同期すれば済みます。
    - プロジェクト面では、プロジェクトが小さすぎるため、わざわざ Design System を作ると逆に制約になり、直接プロジェクトを完成させた方が早いです。
2.  **メンテナンスと製品イテレーションの考慮**
    - Design System は一連の原則、定義された要素です。それを使用するプロジェクトが増えるにつれて、使用シーンも多様化し複雑になります。したがって、このシステムは一度設計すれば 10 年使えるというものではなく、動的にバージョンを更新し続ける必要があります。一度作れば一生安泰ということはあり得ません。

---

## 要素紹介

異なる Design System 間では、定義する必要のある視覚要素の取捨選択があり、状況に応じて必要な要素を増減できます。

例えば、[Material Design](https://material.io/design) と [Shopify](https://polaris.shopify.com/design/design) の Design System に含まれる要素は少し異なります：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754RrTIjIaDOJ.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754RrTIjIaDOJ.png)

以下では、Material Design と Shopify Design を通して、Design System に実際に含まれるもの — Color System, Typography, Spacing, Icon, interaction states, and Motion を紹介します。
実際、カラーコード、フォントサイズ、間隔などは、ウェブページや UI コンポーネントが必要とする基本的な視覚要素であり、音やアニメーションはより高度な要素です。

### Color System - Palette

参考：[Material Design - The Color System](https://material.io/design/color/the-color-system.html#color-usage-and-palettes)

Color System はよく Palette（パレット）と名付けられます。

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754oVgXhFSrai.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754oVgXhFSrai.png)

色はウェブサイトにおいて非常に重要な要素であり、ブランドを素早く識別させる方法の一つです。

Material の管理方法は主に 3 つの役割を定義しています：

1.  メインカラーとサブカラー（Primary & Secondary）
2.  使用シーンに応じてメイン・サブカラーに異なるバリエーション（濃淡）を付与（variant）
3.  その他の UI カラー。例えば、背景、表面、エラー、タイポグラフィ、アイコンの色など。

同時に、テーマ（Theme）を使用して代替色（Alternative Colors）を設定し、様々な使用シーンをサポートすることもできます。

**ダークモード（Dark Mode）** をサポートするために使用できます。

上記の 3 つ目の役割「その他の UI カラー」は、Color System の中で最も複雑な部分です。なぜなら、「様々なシーンで使用する色の名前を定義する」、つまりカラーコードをセマンティック化（意味付け）する必要があるからです。

これはどういうことでしょうか？この画像で使用されている色付きブロックを例に説明しましょう：

![https://ithelp.ithome.com.tw/upload/images/20210922/201207543E6FLtp94Q.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207543E6FLtp94Q.png)

**Background**：ウェブページの背景色を指します。

**Surface**：様々な UI コンポーネントの背景色を指します。UI コンポーネントの背景色はそれらの表面のようなもので、システム内の UI コンポーネントは同じ背景色を共有し、背景と対比させます。メインコンテンツ、カード、ポップアップなどがそうで、Surface を使用することで、ユーザーはこれが背景とは異なるブロック、独立したコンポーネントであることを明確に知ることができます。

**Surface Subdued**：この命名は見解が分かれるところだと思いますが、同様に異なる領域のカラーコードを表すために使用されます。Surface ほど重要ではないがユーザーに気づかせる必要があり、かつ背景と同じ色にはできないシーン、例えばフォームの背景色などにこれを使用できます。

ここで強調しておきたいのは、命名のロジックは実際には各 Design System がどのように定義するかに依存するということです。上記で言及した Primary, Secondary, Background, Surface などは慣習的な命名方法ですが、その他のより詳細な UI カラーの定義は各システムの設定次第です。

皆さんにもう少し感じてもらうために、いくつかシーンを挙げておきます：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754RSDXC5EAZb.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754RSDXC5EAZb.png)

最後に、完全に定義された Color System は Figma 上では大体このようになります：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754x38BxV2qNS.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754x38BxV2qNS.png)

**（明日の Day 08 では、自分の Palette をウェブページで実装する方法について話します！）**

### Typography

参考：[Material Design - Typography](https://material.io/design/typography/the-type-system.html#type-scale)

Design System において、文字システムには Typography という専門用語があります。日本語では「タイポグラフィ」と訳され、配置を通じて文字を読みやすく、可読性を高め、美しくする技術を指します。

「組版」には、書体とフォントサイズの選択（h1~h6, ...）、行間、文字間隔の調整などが含まれます。

Typography は実際、Material Design ではこのような表になります：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754dIAvsTl03N.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754dIAvsTl03N.png)

基本的に**フォントファミリー（Font Family）** 全体が統一され、図のように Roboto になります。各フォントレベルは、**フォントの太さ（Font Weight）**、**サイズ（Font Size）**、**文字間隔（Letter Spacing）**、**行の高さ（Line Height）** を通じて違いを表現します。これらの属性は、Design System を使用する際に私たちがカスタマイズできるオプションです。

ウェブページ内の文字階層は大体図にある通りで、各階層に対応するシーンも直感的でしょう。

Material-Design では、**H1 ~ H6** は見出しに適用され、**Subtitle** は副題や小見出し、**Body** は長文のテキスト（p タグのようなもの）に適用され、**Caption** は写真の説明文、**Overline** は上線付きの文字を指します。

しかし実際には、各システムでどのように定義し使用するかは人それぞれです。例えば、私が以前参加したプロジェクトでは Subtitle の階層を定義せず、使用シーンを満たすために Input 1~3 を定義しました。

残りの実装については Day 09 で紹介します！

### Spacing 間隔

参考：[Shopify Polaris - Spacing](https://polaris.shopify.com/design/spacing#navigation)

間隔は基本的に私たちがよく知っているパディングとマージン（Padding & Margin）です。一貫した間隔は視覚的なバランスを生み出し、ユーザーがウェブページをより簡単に閲覧できるようにします。

主に要素と要素の間の距離を定義する必要があり、以下のようになります：
![https://ithelp.ithome.com.tw/upload/images/20210922/20120754SCpL7DOvhZ.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754SCpL7DOvhZ.png)!

![https://ithelp.ithome.com.tw/upload/images/20210922/201207549yaEDtSxxz.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207549yaEDtSxxz.png)

![https://ithelp.ithome.com.tw/upload/images/20210922/201207541cJHx6dNZY.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207541cJHx6dNZY.png)

最後に Typography と同様に、Spacing の階層表が生成されます。以下のようになります：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754eoRvQH3TCp.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754eoRvQH3TCp.png)

この表があれば、すべての要素間の距離は異なるレベルの spacing にすぎません。デザインは原稿に `spacing-1` とマークするだけで、エンジニアはそれが 4px だとわかります。エンジニア側も最初に CSS 変数を書いておけばよく、後で適用や修正をする際は変数を変えるだけで済みます。

ここで Tailwind が素晴らしいのは、すでに一連の Spacing をプリセットしてくれていることです。Tailwind を使えば、自分で多くの設定をすることなく痛みを伴わずに使用できます！
![https://ithelp.ithome.com.tw/upload/images/20210922/20120754xv7AD04KhA.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754xv7AD04KhA.png)
詳細は [Tailwind Spacing](https://tailwindcss.tw/docs/customizing-spacing) を参照

ただし、すべての Padding と Margin を Spacing で置き換えられるわけではないことに注意してください。使用時に統一して伸縮させたい距離のみが適しています。コンポーネント間の距離を固定したい場合などは、直接ハードコードすることができます。

しかし、Radio の中心の色付き領域と円枠の距離のように、コンポーネント内部の距離が固定されている場合は、Spacing を使用するのには適していません。ウェブページ全体の間隔が大きくなったときに、Radio 内部の空白も一緒に大きくなってボタン全体の見た目がおかしくなるのは望ましくないからです。

![https://ithelp.ithome.com.tw/upload/images/20210922/201207545YsOZNhQjH.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207545YsOZNhQjH.png)

もちろん、このような例外はシステム全体の中では少数ですので、「Spacing の主な使用シーンはコンポーネント間の距離を統一して調整しやすくすることにある」と覚えておけば OK です！

### Icons

参考：[Shopify Polaris - Icons](https://polaris.shopify.com/design/icons#navigation)

Icon も現代のウェブサイトにおいて非常に重要な要素です。一般的な操作、ファイル、デバイス、ディレクトリなどを補助的に表現するための視覚補助ツールであり、ウェブページの美観を高めるだけでなく、ユーザーがウェブページをより早く理解するのを助けます。

一般的な Icon は大体これらです：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754ikiSwPQU48.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754ikiSwPQU48.png)

しかし Icon には実は無限の種類があります。異なるウェブデザインに応じて、Icon も角丸の程度、中空か塗りつぶしかなど、対応するカスタマイズが必要です。Icon を見つけるのにおすすめのウェブサイトをいくつか紹介します：

1.  [iconic](https://iconic.app/)
2.  [flaticon](https://www.flaticon.com/)

Icon の実装のポイントについては Day 10 で紹介します。

### Interactive States

参考：[Shopify Polaris - Interaction States](https://polaris.shopify.com/design/interaction-states#navigation)

インタラクティブな状態、文字通りユーザーがコンポーネントに対して操作（マウス、タッチ、キーボードイベントなど）を行った後の様々な可能な状態です。現在のコンポーネントの状態をユーザーに知らせるための重要な要素でもあります。例えば、ボタンをクリックしたら押された（Pressed）状態になるべきですし、押せないものは Disabled を表示するなどです。

例えば、ボタンの状態表示は下図を参照できます：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754oznBn3nzLp.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754oznBn3nzLp.png)

Focused はその名の通り、焦点を意味します。この状態はページ全体の焦点 — 「現在操作しているコンポーネント」をユーザーに提示できます。同時に、アクセシビリティ機能（A11y）を実装する際の主要な状態でもあります。簡単に言えば、ウェブページで Tabs キーを押し続けている時は、焦点を切り替えているのです。

また、ウェブページでの hover, activated, selected の状態もデモします：

![https://ithelp.ithome.com.tw/upload/images/20210922/20120754Zk7qivo3zr.png](https://ithelp.ithome.com.tw/upload/images/20210922/20120754Zk7qivo3zr.png)

ウェブページ内のインタラクティブな UI コンポーネントには基本的にこれらの状態があります。同じウェブサイト内では、これらの状態の表現は一貫している必要があります。例えばエラーのカラーコードは、ユーザーを混乱させないようにすべて同じである必要があります。

また、状態は唯一ではなく積み重ねられるべきです。一つのコンポーネントで現在複数の状態が同時にトリガーされている場合、選択的に表示するのではなく、すべて表示すべきです。そうすることで、ユーザーは現在のコンポーネントで複数の状態がトリガーされていることを正しく認識でき、また特定の状態で作成した機能が正しくトリガーされないのを避けることができます。Focus の状態のように、上図の左下でも Focus と Selected の状態が重なった時は、単なる Selected とは異なっているのがわかります。

（実装については Day 21 - Button と Button の組み合わせで紹介します！）

### Motion / Transition

最後に紹介するのは、ウェブページコンポーネントの「アニメーション」です！
現代のウェブページはアニメーションを大量に使用してコンポーネントの即時フィードバックを作成し、より直感的なユーザーインターフェースを構築し、それによってより良いユーザー体験を実現しています。
タイトルに「アニメーション（Motion）」を使うのは実は少し大げさです。結局のところ、コンポーネントの実装においては過渡（Transition）に過ぎず、コンポーネント上の実装もすべて Transition と呼ばれます。

Transition は過渡や移行と訳せます。アニメーションの表現形式を指します。コンポーネントのアニメーション使用シーンは通常、開くか閉じるか、出現と消失だからです。Modal を開くときのように、無から有へのプロセスで拡大縮小や展開などのアニメーション効果が適用されるため、それは過渡または移行です。

そして Transition にはすでに多くの一般的なタイプがあります：

1.  Collapse：折りたたみ。UI コンポーネントを開くのは引き出しを開けるようなものです。
2.  Fade in/out：フェードイン・アウト。UI コンポーネントがゆっくりと出現・消失します。
3.  Slide：スライドイン。UI コンポーネントがある方向から滑り込んできます。
4.  Zoom in/out：ズームイン・アウト。UI コンポーネントを拡大または縮小させます。

他にも rotate（回転）、transform（変形）などを定義できますが、ここではこれくらいにしておきます！

ここではこれ以上動画を載せません。Material の [Demo](https://material.io/design/motion/speed.html#easing) や、[8 SIMPLE CSS3 TRANSITIONS THAT WILL WOW YOUR USERS](https://www.webdesignerdepot.com/2014/05/8-simple-css3-transitions-that-will-wow-your-users/) を組み合わせて、様々な Transition タイプを理解してください。

タイプについて議論した後、Transition には持続時間（Duration）とイージング（Easing）という 2 つの重要なパラメータがあります。どの過渡タイプであっても、視覚的な過渡効果を真に実現するには、これら 2 つのパラメータを定義する必要があります。

#### 持続時間 (Duration)

アニメーションの開始から終了までの時間です。アニメーションが影響を与える画面範囲に応じて調整されます。範囲が小さいほど持続時間は短くなり、通常はミリ秒で表されます。

#### イージング (Easing)

Transition の時間を定義した後、次に二次ベジェ曲線を調整して、過渡期間中に異なる加減速効果を実現します。

**二次ベジェ曲線とは？**
滑らかな曲線を作成するために使用されるモデルです。ウェブアニメーションにとっては知っておくべき関数です。しかし、この関数が何をしているかを本当に理解する必要はありません。大まかに「二次ベジェ曲線は 2 つの制御点を調整して決定される曲線であり、曲線が緩やかなところほど速度が遅い」と知っていれば十分です。皆さんは [cubic-bezier.com](http://cubic-bezier.com) で手動でパラメータを調整して感じてみてください。

#### 4 つの一般的なイージング効果：

![https://ithelp.ithome.com.tw/upload/images/20210922/201207542Vn4XjQbTo.png](https://ithelp.ithome.com.tw/upload/images/20210922/201207542Vn4XjQbTo.png)

**Standard Easing 標準**

- 加速するのではなく、より多くの時間をかけて「減速」することで、アニメーションの終了に焦点を当てます。
- 静止状態で開始し終了する要素は標準イージングを使用します。
- 急速に加速し、徐々に減速して、過渡の終了を強調します。

**Emphasized Easing 強調**

- 実際には Standard Easing に非常に似ていますが、それよりもアニメーションの終了を強調します。
- 通常、より定型化された速度感を伝えるために、より長い持続時間と組み合わされます。
- 急速に加速し、「非常にゆっくりと」減速して、過渡の終了を特に強調します。

**Decelerated easing 減速**

- コンポーネントが画面外から入ってくるときに適用されます。
- アニメーション開始時に速度が最も速く、終了時の静止状態まで減速します。

**Accelerated easing 加速**

- Decelerated easing と逆です。
- コンポーネントが画面を離れる状況で使用できます。
- アニメーションは静止状態から始まり、アニメーション終了まで徐々に加速します。

コンポーネントの実装では、通常、最初に Transition コンポーネントを基盤となるインターフェースとして実装し、その後、異なる Transition タイプに応じて各コンポーネント（Fade、Collapse など）を実装します。残りの実装の詳細は Day 11 で皆さんに紹介します！

## まとめ

Design System 設計に関する紹介はここまでです！

タイトルにもあるように、これはフロントエンドエンジニアが知っておくべき Design System です。私たちが実際に設計する必要はないかもしれませんが、これらの設計の基本要素を理解していれば、デザイナーとのコミュニケーションや自分で Side Project を行う際に大いに役立つはずです。デザイナーに少し技術を知っていてほしいと願うように、そうすれば設計されたものがそれほど非現実的にはならないでしょう。
そして昨日言ったように、Design System は、体系的な方法を使用して UI の不確実性を減らし、問題の範囲をより早く明確にし、縮小するのに役立ちます。問題が Design System の定義の問題なのか、UI コンポーネント自体の設計不良なのか、コンポーネントを組み立てる際に考慮不足のシナリオがあったのか、あるいは概念を誤って混同したのかなどを確認でき、デザイナーとのコミュニケーションに多大な追加コストを費やす必要がなくなります。

Design System を通じてウェブページ内の様々な基本要素を詳細に定義した後、数ピクセルの違いのために長時間調整するような状況も大幅に減らすことができ、フロントエンドエンジニアはより早く、より簡単にウェブページを Pixel Perfect（ウェブページのすべてのピクセルを UI 原稿と一致させる）にすることができ、ビジネスロジックやパフォーマンスの最適化などに対処する時間を増やすことができます。

References：

1.  [Do we need design system?](https://medium.com/gogolook-design/do-we-need-design-system-%E4%BB%80%E9%BA%BC%E6%98%AF%E8%A8%AD%E8%A8%88%E7%B3%BB%E7%B5%B1-%E6%88%91%E5%80%91%E9%9C%80%E8%A6%81%E4%BB%96%E4%BE%86%E5%81%9A%E4%BB%80%E9%BA%BC-bc4e62b43ba0)
2.  [Design System Practice](https://medium.com/as-a-product-designer/design-system-practice-f460a60c5169)
3.  [UI 使用者介面的設計系統(Design System)是什麼？](https://riven.medium.com/ui-%E4%BD%BF%E7%94%A8%E8%80%85%E4%BB%8B%E9%9D%A2%E7%9A%84%E8%A8%AD%E8%A8%88%E7%B3%BB%E7%B5%B1-design-system-%E6%98%AF%E4%BB%80%E9%BA%BC-3af06246ac9f)
