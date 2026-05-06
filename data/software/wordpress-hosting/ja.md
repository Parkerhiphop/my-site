---
title: 私がどのようにWordPressサイトを構築したか
date: '2025-04-13'
draft: false
summary: AWS EC2 と Easy Engine を使用して WordPress サイトを迅速にデプロイ（ドメインは Cloudflare で購入）。多少のプログラミング知識が必要ですが、安価で高速、自由度と拡張性も高いです！
tags: ['Software Development', 'WordPress', 'AWS', 'EC2', 'EasyEngine', 'Cloudflare']
---

> **注:** この記事は AI によって翻訳されています。もし不自然な表現や誤りがありましたら、メールやその他の手段でお知らせいただけると幸いです。フィードバックをいただけると助かります！

昨年、仕事でいくつかの大規模な WordPress サイトを扱いました。そこで学んだ WordPress 構築戦略を記録し、共有します。

このサイトも後で WordPress に変更する予定です。変更後、なぜ、そしてどのように変更したかをまた共有します。

![WordPress Logo](https://s.w.org/style/images/about/WordPress-logotype-standard.png)

## WordPress.com vs WordPress.org

まずは公式の 2 種類のプランについて触れます。エンジニアとして、私はずっと [WordPress.org](https://wordpress.org/) しか知りませんでした。少し前に友人から聞かれて初めて [WordPress.com](https://wordpress.com/) の存在を知りました。

WordPress.com は Automattic 社が提供する全方位型のホスティングサービスで、Web ページ上でクリックするだけでサイトを作成できます。しかし、その分自由度は極めて低く、テーマのカスタマイズは難しく、多くのプラグインが使えず、無料版は非常に機能が制限されているため、事実上課金が必要です。

WordPress.org はオープンソースの WordPress ソフトウェアをダウンロードできます。自分のニーズに合わせてデプロイでき、ほぼ制限はありません——プラグインのインストール、テーマの修正、または様々な魔法のようなカスタマイズが自由に行えます。ただし、サーバーの管理、更新、バックアップは自分で行う必要があります。

とはいえ、WordPress.org にも市場にはプロセスを簡素化する多くの統合ソリューションがあり、必ずしもエンジニアに依頼する必要はありません。また、WordPress.com を使っている人も、制限が多すぎて安くないため、遅かれ早かれ乗り換えることになるだろうという予感がします。

この記事でも WordPress.org を使用します。多少の技術知識が必要ですが、できるだけプロセスを明確に説明します。

## WordPress.org 市場のホスティングプラン

ここで紹介するものは使用したことはありませんが、価格といくつかの予備的な観察を分析してみます。

### 1. 従来のレンタルサーバー（例：[BlueHost](https://www.bluehost.com/)）

基本料金は月額 2.95 ドル（約 460 円）で、すぐにサイトを立ち上げることができ、その中で直接ドメインを購入することもできます。

しかし、WordPress.com と同様の問題に遭遇します。サーバーに問題がある場合の調整が難しく、問題があればカスタマーサポートに連絡する必要があり、メンテナンスもしやすくありません。

### 2. クラウドプラットフォームホスティング

#### AWS Lightsail

[公式チュートリアル](https://aws.amazon.com/tw/getting-started/hands-on/launch-a-wordpress-website/)

AWS 上でクリックするだけで構築できます。基本プランは月額 3.5 ドル（約 550 円）です。

私も AWS を使用していますが、EC2 を自分で構築しています。これについては後述します。

#### Google Cloud Platform

[Google Cloud で WordPress を使用する](https://cloud.google.com/wordpress?hl=zh-TW)

GCP にも WordPress デプロイの統合ソリューションがありますが、超高額で、月額 13.17 ドル（約 2000 円）から始まり、設定も AWS Lightsail ほど簡単ではありません。

## 私が選んだ Tech Stack

私は最終的に [AWS EC2](https://aws.amazon.com/tw/ec2/) でのデプロイ、[Easy Engine](https://easyengine.io/) での管理、そして [Cloudflare](https://www.cloudflare.com/zh-tw/) でのドメイン登録と DNS 管理を採用しました。

EasyEngine は直接ダウンロードでき、Cloudflare もまずは無料プランを使用できます。AWS EC2 は基本的に無料プランを使用しますが、ディスク容量のために EC2 に関連付けられた EBS を 16 GiB にアップグレードする必要があるため、月額 1.28 ドル（約 200 円）の費用がかかります。

[AWS EBS の計算方法](https://aws.amazon.com/ebs/pricing/)によると、16 GiB の gp3 ボリュームの場合：

- ストレージ料金：0.08/GB-月 × 16 GB = 1.28/月
- IOPS 料金：0（含まれる 3,000 IOPS を使用）
- スループット料金：0（含まれる 125 MB/s を使用）
  月額合計コスト：$1.28（米ドル）

自分で管理する必要がありますが、費用は直接節約できます。このようなウェブサイト構築のサーバー費用や管理費は家賃や管理費に相当するので、毎月の費用はもちろん低い方が良いです。

## 構築手順

### 1. ドメイン登録と DNS 設定

以前は GoDaddy でドメインを登録（購入）していましたが、現在は [Cloudflare](https://www.cloudflare.com/zh-tw/) の方が管理しやすく安価なのでこちらを使用しています（私のドメインは GoDaddy で買うと年間約 1600 台湾ドルですが、Cloudflare に移管すると年間 900 台湾ドルで済みます）。

まず Cloudflare の管理画面にログインして、登録したいドメインを探します。

![ドメイン登録](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.45.37@2x-1024x772.png)

次にアカウントのホームページに行くと、登録したばかりのドメインが表示されます。

![アカウントホームページ](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.49.00@2x-1024x524.png)

最後に、先ほど EC2 Connect ページにもあった Public IP を貼り付けて A レコードを設定すれば完了です。

名前には `@` を使用してドメイン全体を指定します。文字列を書けばサブドメインに誘導できます。

ドメイン名が your-domain.com だと仮定すると、A レコードは以下のように設定できます：

- `@` ：ec2_ip を your-domain.com に接続
- test：ec2_ip を test.your-domain.com に接続

![DNS レコード](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.50.22@2x-1024x602.png)

### 2. AWS EC2 インスタンスの作成

AWS にログイン後、EC2 ページに入り、EC2 インスタンス（Instance）を作成します。

![AWS EC2 インスタンス作成ページ](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.03.53@2x-1024x423.png)

#### 2-1. OS として Ubuntu を選択

![Ubuntu OS を選択](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.04.51@2x-1024x660.png)

#### 2-2. Key Pair の場所で Key Pair を作成または選択

![Key Pair 作成](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.05.17@2x-1024x179.png)

作成すると、鍵ファイル `$ssh_key.pem` が生成され、ダウンロードできます。

ローカルで ssh 接続する際に必要になります。

#### 2-3. Network 設定

EC2 のセキュリティグループで SSH、HTTP（80）、HTTPS（443）のポートを開放します。下の図の 3 つの Allow ボタンです。

![EC2 セキュリティグループ設定、SSH、HTTP、HTTPS ポート開放を表示](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.07.33@2x-1024x600.png)

#### 2-4. ディスク容量の調整

後で EasyEngine をインストールするため、少なくとも 5GB のディスク容量が必要なので、16 GiB にアップグレードする必要があります。

EC2 作成ページのこのブロックで設定できます：

![EC2 ディスク容量設定ブロック](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.08.57@2x-1024x393.png)

もし私のように最初に 8GiB を選んで `EasyEngine update requires minimum 5GB disk space to run` に遭遇した場合、EC2 のダッシュボードで現在のインスタンスに対応する Volume を見つけ、modify を押せば変更できます。

![EC2 Volume 修正ページ](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-16.53.53@2x-2048x601.png)

アップグレード後、EC2 の ubuntu に SSH 接続してこのコマンド `sudo resize2fs /dev/xvda1` を実行します（`df -h` を実行して容量を確認できます）。

### 3. Easy Engine と WordPress のインストール

[EasyEngine](https://easyengine.io/) のサブタイトルは Easy WordPress on Nginx です。その名の通り、Docker ベースの WordPress 環境を提供し、Web サーバーとして nginx を使用します。

まずは EC2 Instance ページで Connect を見つけます：

![EC2 インスタンス接続ページ](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.33.54@2x-1024x484.png)

中に入ったら下の一行を直接コピーしますが、自分の ssh key pem を保存している場所でこのコマンドを実行することを忘れないでください。

![SSH 接続コマンド](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.31.57@2x-1024x362.png)

私のように ssh フォルダの下に pem を保存している場合、ターミナルを開いてコマンドを入力して接続するとこのようになります：

![EC2 ターミナルへの接続成功](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.39.08@2x-1024x808.png)

**上の画像の `brew install easyengine` は Mac 用です。消し忘れました。EC2 ubuntu は 1 行目だけでインストールできます。**

EasyEngine が `ee site create example.com --wp` を実行する際、ドメイン（例：example.com）を通じてバーチャルホストを設定するため、使用可能なドメインが必要です。最初の手順で Domain と DNS 設定を済ませておくのがベストです。`http://<EC2_IP>/wp-admin` を直接打っても Nginx はデフォルトページか 404 を返します。

```
# Linux に EasyEngine をインストール
wget -qO ee rt.cx/ee4 && sudo bash ee

# WordPress で example.com にサイトを作成
sudo ee site create example.com --wp
```

このような画面が表示されれば、WordPress の作成は完了です！

![WordPress 作成ログ](https://wp.parkerchang.life/wp-content/uploads/2025/04/CleanShot-2025-04-13-at-12.40.53@2x-892x1024.png)

## 構築プロセスのクイックレビュー

1. Cloudflare でドメインを登録（例：your-domain.com）

2. EC2 インスタンスを作成：

   - Ubuntu システムを使用
   - 16GiB のストレージ容量を確保
   - HTTP と HTTPS ポートを開放し、SSH キーペアを設定

3. SSH 経由で EC2 に接続し、Easy Engine をインストール

4. `ee site create your-domain.com --wp` を使用して WordPress サイトを作成

5. Cloudflare DNS でドメインを EC2 の公開 IP に向ける（A レコードを設定）

6. 完了！これで your-domain.com と your-domain.com/wp-admin に直接接続できます

## 結びに

個人的にこの WordPress デプロイの組み合わせは非常に使いやすいと感じています。大規模なトラフィックも各方面の調整で対応できます。

ディスクのアップグレードなどのサーバー管理は EC2 で、WordPress の管理は easy engine CLI で、ドメイン関連の管理は Cloudflare で行えます。

トラフィックが増えてきたら、Cloudflare のキャッシュをオンにし、次に easy engine 内の nginx キャッシュをオンにすることで、徐々にサービスをアップグレードできます。

この記事では WordPress の構築についてのみ触れましたが、構築に成功した後も、WordPress テーマの調整や様々なプラグインのインストールなどが必要です。これについてはまた時間があるときに共有します。

### 独り言

一年半ぶりに技術記事を書くのは結構疲れましたが、Heptabase にたくさんのメモが眠っているのはもったいないと思うので、整理して少しずつ出していこうと思います。復習にもなりますし。

今回 WordPress について書くにあたり、一般向けにするかエンジニア向けにするか、どこまで説明するか迷いました。この記事はエンジニアには説明しすぎかもしれませんが、一般の人が読んでも不明瞭かもしれません。でも、メモを公開するという初志貫徹でとりあえずこれで良しとしましょう！その後、徐々にペースを掴んでいきます。

最近、エンジニアではない友人から構築方法を聞かれましたが、彼がこれを読んでもたぶんこの方法は採用しない気がします XD。

AI の登場後、技術ブログの意義についても考えていますが、私自身まだ記事を読むので、書いて公開することには意味があるはずです。

また、メモとして記録するということは、通常、私がその時 AI で直接問題を解決できず、プロセスの中でキーワードを記録したり検索したりする必要があったことを意味します。このプロセス全体において、AI は回答の途中で幻覚を見始めたり、文脈を失ったりしやすいのです（パッケージについて聞くと、AI は存在しないパッケージをよく幻覚で作り出します）。

多くの知識が記事や本という形で整理されていれば、吸収効率はずっと速くなります。最近 Java を学んでいますが、AI で学習する際は間違って覚えるのが怖いです。しかし、AI が時々私の知らないキーワードを出してくれるので、そのキーワードを通じて他の人が書いた完全な文脈のある記事を調べることができます。そうして良葛格（Liang GeGe）が書いた Java シリーズの記事を見つけました。そのようなよく書かれた記事を読む学習効率は、AI に適当に質問するよりずっと良いです。
