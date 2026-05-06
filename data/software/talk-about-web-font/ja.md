---
title: Webフォントについて語る — デザイン、ファイル形式、そしてフロントエンドの読み込み
date: '2021-10-28'
draft: false
summary: フォントデザインのプロセス（非専門家版）、フォントファイルの種類、Webページでのフォント使用方法について紹介します。
tags: ['Software Development', 'Web Development', 'CSS', 'Font', 'Design']
---

> **注:** この記事は AI によって翻訳されています。もし不自然な表現や誤りがありましたら、メールやその他の手段でお知らせいただけると幸いです。フィードバックをいただけると助かります！

以前、[設事未深](https://www.instagram.com/designnotdeep/) のフォント大補帖（フォント集）が配布され、フォント受け取りブームが起きました。スライド、ポスター、SNS 投稿以外に、Web ページでどのようにフォントが使われているか考えたことはありますか？

![typewritter](https://cdn-images-1.medium.com/max/800/0*OEf5PYLRWXCaS_Op)

photo by [David Klein](https://unsplash.com/@diklein) on [Unsplash](https://unsplash.com/)

以前、[設事未深](https://www.instagram.com/designnotdeep/) のフォント大補帖がブームを巻き起こしました。スライド、ポスター、SNS 投稿以外に、Web ページでどのようにフォントが使われているか考えたことはありますか？

そこで今日は、Web ページでのフォント使用に関する知識と技術的な詳細を共有します。前半は一般的な知識で、後半は Web ページでのフォント使用に関する技術的な話が多くなります。フロントエンドエンジニアでない方は、適宜読み飛ばしてください！

**この記事を通じて、以下のことをお伝えします 👇**

1.  フォントの誕生（非専門家版）
2.  フォントファイルの種類
3.  Web ページでのフォント使用方法

## フォントデザインのプロセス

紹介に入る前に、フォントがどのようにデザインされるのか非常に気になったので、デザイナーの友人にフォントデザインについていくつか質問しました。ここでプロセスの概要を簡単に紹介します。

繁体字中国語の場合、まずいくつかの決まった文字を作ります。これらの文字を作れば、漢字の画数の法則を大体カバーできます。例えば「永」はすべての異なる画数を含んでおり、「鷹」は横棒が多い場合のテストになるなどです。

![](https://cdn-images-1.medium.com/max/800/0*Yn16A9M8O252zZw9.jpg)

[https://www.easyatm.com.tw/wiki/%E6%B0%B8%E5%AD%97%E5%85%AB%E6%B3%95](https://www.easyatm.com.tw/wiki/%E6%B0%B8%E5%AD%97%E5%85%AB%E6%B3%95)

次に、[**Glyphs**](https://glyphsapp.com/) や [**FontForge**](https://fontforge.org/en-US/) などのソフトウェアを使用して詳細を調整します。ほとんどの漢字を作り終えたら、並べて一貫性を確認し、最後は一気に残りの漢字を作り上げます。

### Web ページの繁体字中国語は何文字デザインする必要があるのか？

漢字の総量については、教育部の[異体字字典](https://dict.variants.moe.edu.tw/variants/rbt/home.do)に 10 万字以上収録されていますが、Google Font が提供する[Noto Sans TC](https://richer.tw/google_font_info/noto-serif-tc-cut)ファイルを見ると、Web ページで読み込む必要がある文字数は約 1 万 5 千字程度です。

非専門的なプロセス紹介を終えたところで、デザインの詳細についてはここで誤った情報を広めないようにします。興味のある方は [justfont blog](https://blog.justfont.com/) をご覧ください。フォントに関する素晴らしい記事がたくさんあります。

## フォントは一般的にどのようなファイル形式で保存されるのか？

当初、コンピュータの文字はビットマップ形式で表示されていました。この段階では印刷文字と比べて大きな差があり、フォントがデザインされても、その美しさをコンピュータ上で完全に表現するのは困難でした。

しかし、1984 年に Adobe が PostScript を発表した後、コンピュータはベクター版の文字を表示できるようになり、印刷文字とほぼ変わらない効果が得られるようになりました。これにより、コンピュータ上で様々なフォントを応用する可能性が開かれました。

ビットマップとベクター画像の違い 👇

![](https://cdn-images-1.medium.com/max/800/0*oABgV6XVSdJyuDPP.png)

[https://digitalmediaandvisualarts.blogspot.com/2016/10/raster-vs-vector.html](https://digitalmediaandvisualarts.blogspot.com/2016/10/raster-vs-vector.html)

その後、主要なソフトウェア企業が競ってフォント形式を開発しました。歴史に興味がある方は [フォーマット戦争：あなたが使っているフォントファイルは、巨人たちの戦争の産物です](https://blog.justfont.com/2017/07/opentype-wars/) をご覧ください。ここでは、戦争後のこれら 7 つのフォントファイル形式を順に紹介します。ttc 以外はすべて Web ページで読み込み可能なフォントです。

### 1. `.ttf` (TrueType Font)

- 1989 年、Adobe が PostScript の企業秘密を公開することを拒否したため、Apple と MicroSoft が協力して新しいフォント形式 TrueType (.ttf)を開発しました。
- 最も古く、最も広く使用されている形式です。インターネットでダウンロードされるフォントのほとんどは ttf 形式です。

### 2. `.otf` (OpenType Font)

- 1997 年、MicroSoft と Adobe が OpenType (.otf)を開発しました。これは TrueType の拡張であり、Unicode もサポートしています。
- 2005 年に ISO 標準として採用され、Open Font Format (off)と呼ばれています。

### 3. `.ttc` (TrueType Collection)

- 1989 年にリリースされました。TTF または.OTF の集合体であり、主に同じフォントタイプのファイルを統合するためのものです。例えば、Noto シリーズはファイルサイズを減らすために ttc ファイルにまとめることができます。
- **Web ページでは直接読み込むことはできません。中の特定の ttf または otf ファイルを個別に読み込む必要があります。**

### 4. `.eot`

- フォントを長く扱っている人は見たことがあるかもしれません。主に IE で使用されていた形式ですが、IE と共に歴史になろうとしています。

### 5. `.woff` (Web Open Font Format)

- 2010 年に Mozilla、Type Supply、LettError、その他の組織が共同開発した[「Web オープンフォント形式」](https://developer.mozilla.org/zh-TW/docs/Web/Guide/WOFF)。
- woff 形式のフォントファイルは圧縮されており、ttf や otf に比べてブラウザの読み込み負荷を大幅に軽減し、読み込み速度も向上します。
- 現在の Web フォントの主流の一つです。

### 6. `.woff2`

- woff の 2.0 であり、主により徹底的に圧縮されています。同じフォントで woff より約 20%〜30%小さくなります。
- 現在の開発では、woff2 形式の使用を優先的に検討し、サポート状況に応じて処理することができます。

### 7. `.svg` (Scalable Vector Graphics)

- コンピュータのフォントにおける大きな進化の一つは、ビットマップからベクター画像への進化でした。そのため、純粋なベクター画像形式でフォントを表現することも当然可能です。
- svg の主な用途はアイコンフォント（icon font）であり、画像の使用率を減らし、アイコンを文字のようにサイズ、太さ、色を調整できるようにするために使用されます。

## Web ページでフォントを読み込む方法は？

Web ページでフォントを読み込む際、主に CSS のリソースとして読み込まれ、**font-face** プロパティを使用して読み込まれます。

### font-face

> 外部フォントファイルをインポートし、関連する CSS プロパティをカスタマイズします。

ここでは [MDN](https://developer.mozilla.org/zh-TW/docs/Web/CSS/@font-face) の例を直接使用して、基本的な構文を説明します 👇

実際に使用すると、このようになります 👇

[MDN Demo](https://media.prod.mdn.mozit.cloud/attachments/2012/07/09/2469/ca10cbddcc6c17a120ada25291da053c/webfont-sample.html)

**_font-face の使用について少し感覚がつかめたところで、詳細な使用方法を説明します 👇_**

### **font-family**

> font-face の名前を定義します。元のフォントファイルと同じである必要はありません。その後、font-family でこの名前を使用するだけで、フォントフェイスのプロパティセット全体を使用できます。

font-face 内ではなく、通常の font-family では、カンマで予備のフォント（fallback fonts）を連結でき、順序に従ってフォントが使用されます。

### src

> url で読み込む外部フォントファイルのパスを指定し、local でローカルのフォントを使用します。

以下の例では、まずユーザーのコンピュータ内の Helvetica Neue Bold フォントを使用し、2 つの Local フォントがない場合にのみ、追加で MgOpenModernaBold.ttf フォントをダウンロードします。

```css
@font-face {
  font-family: MyHelvetica;
  src: local('Helvetica Neue Bold'), local('HelveticaNeue-Bold'), url(MgOpenModernaBold.ttf);
  font-weight: bold;
}
```

複数のフォントを読み込めるだけでなく、**format**を使用して複数のフォント形式を読み込み、ブラウザのサポート問題に対処することもできます。

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('myfont.woff2') format('woff2'), url('myfont.woff') format('woff');
}
```

### unicode-range

> 指定された Unicode 範囲に基づいてブラウザにフォントをダウンロードさせることができます。

unicode は上で「万国コード（Unicode）」として言及しましたが、その名の通り、各国のテキストデータ形式が統一されておらず正常に表示できない問題を解決するために登場しました。基本的にはすべての文字にコードを定義し、異なる言語やプラットフォームが unicode を通じてテキストを正常に表示できるようにします。

- [Unicode エンコーディング変換ツール](https://www.ifreesite.com/unicode-ascii-ansi.htm) で実際の変換結果を確認できます！

使用時には、主に以下の 2 つの効果を達成したいと思います 👇

1.  現在のページで必要な部分のみをダウンロードし、読み込みサイズを減らして読み込み速度を向上させる
2.  複合フォントを作成する。単語や文章の中に複数のフォントが含まれる場合があります

[GTW](https://blog.gtwang.org/web-development/css-font-face/#comments) の例を借りて説明します：

```css
/* 予備フォント - サイズ：4.5MB */
@font-face {
  font-family: DroidSans;
  src: url(DroidSansFallback.woff); /* Unicode範囲指定なし、デフォルトですべての範囲をカバー */
}

/* 日本語 - サイズ： 1.2MB */
@font-face {
  font-family: DroidSans;
  src: url(DroidSansJapanese.woff);
  unicode-range: U+3000-9FFF, U+ff??;
}

/* 英語フォントやいくつかの記号など - サイズ： 190KB */
@font-face {
  font-family: DroidSans;
  src: url(DroidSans.woff);
  unicode-range: U+000-5FF, U+1e00-1fff, U+2000-2300;
}
```

### font-display

> 主にフォント読み込み中に Web ページがブロックされた際、どのようにフォントを表示・置換するかという戦略を指定します。通常、Web ページのブロック時間を短縮してパフォーマンスを最適化することを目的としています。

**以下の戦略が選べます 👇**

#### auto

ブラウザのデフォルト値に従います。通常は block です。

#### block

フォントの読み込みが完了するまでテキストを一時的に隠し、読み込み完了後にすぐに置換します。

しかし実際には、この期間中ブラウザは見えないプレースホルダー（placeholder）を読み込んでその場所を占有します（画面上では空白になります）。フォントの読み込みが完了すると、すぐにプレースホルダーと置き換わります。この効果には **FOIT (flash of Invisible Text)** という専門用語があり、見えないテキストが一瞬表示されることを指します。

![](https://cdn-images-1.medium.com/max/800/0*vLZs0W5YqME4acCw.png)

[https://www.w3cplus.com/css/font-display-masses.html](https://www.w3cplus.com/css/font-display-masses.html)

#### swap

フォントの読み込みが完了するまで、ブラウザは予備フォントを使用してテキストを表示します（予備フォントは font-family で定義）。フォントの読み込みが完了すると、同様にすぐに置換されます。

この効果の専門用語は **FOUT (flash of Unstyled Text)** です。FOIT と比較して、カスタマイズされたスタイルのないテキストが一瞬表示されることを指します。基本的に正常な表示を保証する swap は、ほとんどの場合において非常に有用です。

![](https://cdn-images-1.medium.com/max/800/0*D0fpzSC_xcgLxcKr.png)

[https://www.w3cplus.com/css/font-display-masses.html](https://www.w3cplus.com/css/font-display-masses.html)

#### fallback

auto と swap の中間で、非常に短い時間（約 100 ミリ秒）テキストを隠します。フォントがまだ読み込まれていない場合は、予備のフォントを先に表示します。フォントが読み込まれた後は、同様に置換されます。

#### optional

読み込み時の処理は fallback と同じですが、ブラウザがカスタムフォントを使用するかどうかを独自に判断します。ブラウザが読み込み速度が遅すぎると判断した場合、カスタムフォントを直接破棄します。

---

その他の一般的でわかりやすいフォントプロパティについては、ここでは一つ一つ詳述しません。[MDN — font](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) に非常に完全な例がありますので、そちらを参照してください！

実は Google Font のオープンソースフォントや、現在の Web 使用における繁体字フォントのいくつかの困難についても紹介し続けたいと思っていましたが、今日の長さは十分だと思うので、次回の記事に残しておきます！

今日の内容について質問、提案、または議論したいことがあれば、ぜひコメントで教えてください！

---

最後に、気に入ったら拍手をお願いします。最大 50 回まで拍手できます。役に立ったと思う程度に応じて拍手してください。これは私が調整するための根拠にもなります 🙌

## References

- [https://blog.justfont.com/2017/07/opentype-wars/](https://blog.justfont.com/2017/07/opentype-wars/)
- [https://www.mindscmyk.com/2021/02/26/テーマ知識｜ 3 つの一般的なフォント：ttf-otf-ttc-拡張子の違い？/](https://www.mindscmyk.com/2021/02/26/%E4%B8%BB%E9%A1%8C%E7%9F%A5%E8%AD%98)
- [https://developer.mozilla.org/zh-TW/docs/Web/Guide/WOFF](https://developer.mozilla.org/zh-TW/docs/Web/Guide/WOFF)
- [https://www.twblogs.net/a/5d3f76babd9eee5174229d3f](https://www.twblogs.net/a/5d3f76babd9eee5174229d3f)
- [https://tools.wingzero.tw/article/sn/91](https://tools.wingzero.tw/article/sn/91)
- [https://css-tricks.com/snippets/css/using-font-face/](https://css-tricks.com/snippets/css/using-font-face/)
- [https://www.w3cplus.com/css/font-display-masses.html](https://www.w3cplus.com/css/font-display-masses.html)
