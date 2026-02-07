---
title: Googleサードパーティログインの実装（Vue / Express）
date: '2022-10-23'
draft: false
summary: Vue と Express を使用して Google ログインを連携する小さな例
tags: ['Software Development', 'Web Development', 'Vue', 'Express', 'Google OAuth']
---

> **注:** この記事は AI によって翻訳されています。もし不自然な表現や誤りがありましたら、メールやその他の手段でお知らせいただけると幸いです。フィードバックをいただけると助かります！

## はじめに

最近、会社でサードパーティログインを連携する必要がありました。初めてのことだったので、かなりの落とし穴にはまりました。また、Google がまた改訂したようで、ネットで見つけた多くの記事はすでに使えなくなっていたため、連携のプロセスを共有し記録することにしました。

基本的に、[Google Sign-in JavaScript library](https://github.com/google/google-api-javascript-client) を使って連携している場合、Google はすでに非推奨（[deprecated](https://developers.google.com/identity/sign-in/web/reference)）にしており、2023/03/31 には完全に廃止され、ダウンロードや使用ができなくなる予定です。ですので、以前に[このプロセス](https://developers.google.com/identity/sign-in/web/reference)に従って実装した方は、急いでリファクタリングしてください！

> この記事では、Vue3 と Express を使用して简易的な Google サードパーティログインを実装する手順を案内します！

（新しい Sign In With Google ボタンを使用するほか、新しい Google One Tap 機能もあります）

私は Google 純正のライブラリのみを使用しており、他人がラップしたものは使用していないため、React の場合でも構文を少し変えれば使用できます！

現在、Google ログインの連携はますます簡単になっています。他人がラップしたライブラリを使用して結合度を高めることはお勧めしません。私の会社でも最近、以前使用していたライブラリがメンテナンスされなくなったため、再実装することになったからです。

## 概要

連携プロセスは 4 つのステップに分かれます：

1.  Google Cloud で OAuth Consent Screen と Credentials を設定する
2.  フロントエンド：初期化 ＆ Google Button の表示
3.  フロントエンド：ユーザーが同意を押した後、Google Credential をバックエンドに POST し、返ってきた Authorization Token を持って正常にログインし、User Data を取得します！
4.  バックエンド：POST の Route で Google Credential を受け取った後、Google Auth Library で検証し、Google User Data を取得します。これらの User Data を DB に保存するか、対応する Authorization Token と User Data をフロントエンドに返します。

このステップを読んだだけではまだ疑問があると思いますので、以下で手取り足取り実装していきます！

### 一、Google Cloud 設定

1.  [Google Cloud](https://console.cloud.google.com/apis) で Google Login を使用したいプロジェクトを選択または新規作成します (img)

![](https://cdn-images-1.medium.com/max/800/1*U7RXhmA7apJa7uAgr5kRwg.png)

2.  次に OAuth 同意画面（ OAuth Consent Screen ）の場所に移動します

![](https://cdn-images-1.medium.com/max/800/1*ylYSIsJBIm_c4oE-3YmhYA.png)

3.  App を登録し、手順に従ってフィールドに入力するだけです！

![](https://cdn-images-1.medium.com/max/800/1*VRMef2aHjtekX6yw9ekMkA.png)

Scopes は、App が許可されたユーザーのどのデータにアクセスすることを許可するかです。基本的なものは、画像の `auth/userInfo.email` や `auth/userInfo.profile` のようなものです (img)

![](https://cdn-images-1.medium.com/max/800/1*hkZLtL311mJOvGjF2hdQcQ.png)

Test User は、テスト時にログインを許可するアカウントです。

![](https://cdn-images-1.medium.com/max/800/1*ehTtRiKqgW25y44nfJoc0w.png)

4.  OAuth Consent Screen の APP を作成したら、認証情報（Credential）を設定します。

左側の 認証情報 または Credential をクリックし、上の CREATE CREDENTIALS をクリックします。

![](https://cdn-images-1.medium.com/max/800/1*ew9PwDoWfFg1LoH277GXBA.png)

5.  Authorized JavaScript origins と Authorized redirect URIs を設定します。

Authorized JavaScript origins：フロントエンドのドメインを指します
Authorized redirect URIs：ユーザーが同意を押した後、バックエンドのどの URI に POST Request を送信して Google Credential を受け取るかを指します。

この後のデモでは、フロントエンドは `http://localhost:5173` になり、バックエンドは `http://localhost:3000/verify-token` を使用して POST Request を受け取ります。ドメインに関しては、ローカルテスト時には特別に `http://localhost` を追加する必要があることに注意してください。また、Google は IP をソースとして許可していないため、`127.0.0.1` などは使用できません。

（そして正式リリース後は、正式なドメインと URI に変更することを忘れないでくださいね）

![](https://cdn-images-1.medium.com/max/800/1*vO99i3FUkkfSp97qysHojw.png)

6.  作成が完了すると、リストに Client ID が表示されます。後でこれを使用します！

（Client とは、Google にとって私たちが Client であり、Google は私たちが証明書とユーザーデータを取得する Server です）

![](https://cdn-images-1.medium.com/max/800/1*sCw3rHXoSxJ7oq0uvarN8Q.png)

> おめでとうございます、Google Cloud の設定が正常に完了しました。

Client ID を取得し、フロントエンド Origin とバックエンド URI を承認したので、次はそれぞれフロントエンドとバックエンドを実装していきましょう！

### 二、フロントエンド：初期化 ＆ Google Button / On Tap Login の表示

基本的にはこのプロセスに従います：[Display the Sign in with Google Button](https://developers.google.com/identity/gsi/web/guides/display-button)。以下でも一通り説明します！

入口の index.html で google library script を読み込みます

```html
// index.html

<body>
  <script src=”https://accounts.google.com/gsi/client" async defer></script>
  <div id="app" />
</body>
```

この時 window に google オブジェクトが登録され、以降の操作はこのオブジェクトを使用します！

ブラウザで直接 window.google をログ出力して、何が入っているか見てみましょう

![](https://cdn-images-1.medium.com/max/800/1*e-PjDrm2kjrRNGsgAmY6kw.png)

1.  初期化設定は `window.google.accounts.id.initialize` を直接呼び出します

    - Client ID：Credentials からコピーするだけです
    - callback：ユーザーが Google のログイン画面で同意を押した後にトリガーされる Callback Function です
    - Cancel On Tap Outside：Tap エリア外をクリックして Tap Login Model を閉じられるかどうか
    - Context： `signin | signout | login`

2.  Button のレンダリングは `window.google.accounts.id.renderButton` を使用します

3.  On Tap Login の表示は `window.google.accounts.id.prompt()` を呼び出します

```js
onMounted(() => {
  window.onload = () => {
    if (CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID, // required
        callback: onLogin, // invoke while user login in the popup
        cancel_on_tap_outside: true, // optional
        context: 'signin', // optional
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleButton'),
        { theme: 'outline', size: 'large' } // customization attributes
      );

      window.google.accounts.id.prompt(); // show one-tap popup
    } else {
      console.error("client_id doesn't exist!");
    }
  };
});
```

### 三、フロントエンド：ユーザー同意後に Token を取得してログイン

このステップは、上記の `initialize` 時に渡す callback を実装することです。

そしてこれは、ユーザーが Google のログイン画面でログインした後に実行される関数でもあります。

したがって、ここで独自のログインロジックを実装します。以下のようになります：

```js
const onLogin = (res) => {
  const axiosOptions = {
    headers: { 'Access-Control-Allow-Origin': CLIENT_URL },
  };
  axios
    .post(`${API_URL}/verify-token`, res, axiosOptions)
    .then((res) => {
      console.log('res', res);
      userData.value = res.data;
    })
    .catch((error) => {
      console.log('error', error);
    });
};
```

callback は Google からの response（ onLogin の `res`）を受け取り、response 内にはこれらのデータが含まれています。その中の `credential` をバックエンドに送って検証を行います。

```json
{
  "clientId": "123456789.apps.googleusercontent.com",
  "credential": "",
  "select_by": "btn" // or 'user'
}
```

> フロントエンドの処理はこれで終了です！

簡単に復習すると、`gsi client` を導入し、window 下に `google` オブジェクトを作成しました。次に google オブジェクトが提供する `initialize`、`renderButton` を使用して Google Button を初期化およびレンダリングしました。独自のログインロジック `onLogin` 関数は `initialize` 時に `callback` に渡し、ユーザーログイン後に呼び出されるようにしました。

### 四、バックエンド：受信、検証、User Data (および Authorization Token) の返却

上で見たように、onLogin は `/verify-token` にバックエンドへ POST します。次に、この Route で Google User Data を検証して取得します。

基本的には [Google の例](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token) に従い、CORS を処理することを忘れないでください！

これで、サードパーティ連携は完了です！

> 次に、バックエンドはフロントエンドにログインが成功したことを知らせるだけです。

ここでは単純に User Data をフロントエンドに返します。

会社のプロジェクトでは、一般的な登録やログインと同様に、データを DB に保存するか、Authorization Token と User Data を取得してフロントエンドに渡す方法を採用しています。

```js
const cors = require('cors');
app.use(cors());
const CLIENT_ID = 'YOUR CLIENT ID';
/** Handle the POST request from onLogin callback in frontend */
app.post('/verify-token', (req, res) => {
  // use google-auth-library to verify token
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client(CLIENT_ID);
  async function verify() {
    // get credential from google
    const token = req.body.credential;
    console.log('token from credential', token);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // You can store user data in DB and return Authorization Token here.
    res.json({
      email: payload.email,
      email_verified: payload.email_verified,
      picture: payload.picture,
      name: payload.name,
    });
  }
  verify().catch(console.error);
});
```

## デモ

以下に提供する Repo を実行すると、このようになります：

![](https://cdn-images-1.medium.com/max/800/1*ZWMMJvk3tpZrNFnvYojxuQ.png)

初期ログイン画面

![](https://cdn-images-1.medium.com/max/800/1*jOQkAVvJ1VldfqVoYKBlSQ.png)

ユーザーログイン後

### Frontend: [Vue Sign In With Google](https://github.com/Parkerhiphop/Vue-Sign-In-With-Google)

- clone した後 `npm install` + `npm run dev` で port:5173 で実行されます。これはまさに Google Cloud — Credentials で設定した Authorized JavaScript origins です
- 自分で開発する際は、自分の Port に変更することを忘れずに。リリース後も正式なドメインに変更してくださいね！

### Backend: [Express Sign In With Google](https://github.com/Parkerhiphop/Express-Sign-In-With-Google)

- clone した後 `npm install` + `npm run start` で port:3000 で実行されます。これはまさに Google Cloud — Credentials で設定した Authorized redirect URIs です

### 結びに

サードパーティ連携のために大量のドキュメントを読み、手探りで作業しました。書き終わって数日しか経っていないのに、記事を書こうとしたら細かい部分を少し忘れていましたが、記事にまとめるとずっと明確になりました！

この記事が Google ログイン連携が必要なすべての人に役立つことを願っています！

次は Facebook ログインの連携を続けるつもりです。Facebook や Twitter と比較して、Google の実装は本当に、本当に、とても親切だと言わざるを得ません。
