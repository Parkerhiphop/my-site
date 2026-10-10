// Editorial milestones, checked against the linked commits. Keep this list curated
// rather than generating it from every content edit during a site build.
const changelog = [
  {
    date: '2026-10-09',
    commit: 'eecd39a',
    href: '/resource',
    text: {
      'zh-TW': ['新增資源頁', '整理值得持續閱讀的資訊來源。'],
      en: ['Added Resources', 'A growing list of information sources worth returning to.'],
      ja: ['リソースページを追加', '継続して読みたい情報源をまとめました。'],
    },
  },
  {
    date: '2026-10-07',
    commit: '985f5ab',
    href: '/timeline',
    text: {
      'zh-TW': ['新增文章時間軸', '把散落在各分類的文章依年份串起來。'],
      en: ['Added the article timeline', 'Posts across categories can now be explored by year.'],
      ja: [
        '記事のタイムラインを追加',
        'カテゴリーをまたいで、記事を年ごとにたどれるようにしました。',
      ],
    },
  },
  {
    date: '2026-10-04',
    commit: '8fbe243',
    href: '/stream',
    text: {
      'zh-TW': ['隨筆回來了', '重新開放 Stream，讓短一點的念頭也有地方安放。'],
      en: ['Stream returned', 'Brought back a home for shorter thoughts.'],
      ja: ['雑記が復活', '短い考えを書き留める場所を再び作りました。'],
    },
  },
  {
    date: '2026-10-03',
    commit: 'dec37d8',
    href: '/database',
    text: {
      'zh-TW': ['資料庫加入網漫', '新增 Webtoon 分類，重新整理部分作品資料。'],
      en: [
        'Added webtoons to the database',
        'Introduced a webtoon collection and reorganized some records.',
      ],
      ja: [
        '作品データベースにウェブトゥーンを追加',
        'ウェブトゥーンの分類を作り、一部の作品情報を整理しました。',
      ],
    },
  },
  {
    date: '2026-10-03',
    commit: 'ea1152d',
    text: {
      'zh-TW': ['導覽列固定在畫面頂端', '往下閱讀時仍能快速切換網站頁面。'],
      en: ['Made the header sticky', 'Navigation stays within reach while reading.'],
      ja: ['ヘッダーを固定', 'スクロール中もページを移動しやすくしました。'],
    },
  },
  {
    date: '2026-10-03',
    commit: '6d23293',
    href: 'https://dev.parkerchang.life',
    text: {
      'zh-TW': ['軟體文章搬往開發部落格', '把軟體內容從這個網站移出，留在獨立的開發部落格。'],
      en: [
        'Moved software writing to a dev blog',
        'Software posts left this site for a separate development blog.',
      ],
      ja: [
        'ソフトウェアの記事を開発ブログへ移動',
        '技術記事をこのサイトから独立した開発ブログに移しました。',
      ],
    },
  },
  {
    date: '2026-09-28',
    commit: '04714b3',
    text: {
      'zh-TW': ['多語標題連結更穩定', '切換語言後仍能對應到文章裡同一個段落。'],
      en: [
        'Stabilized multilingual heading links',
        'Language switching can keep readers at the matching section of an article.',
      ],
      ja: [
        '多言語の見出しリンクを安定化',
        '言語を切り替えても、対応する段落へ移動しやすくしました。',
      ],
    },
  },
  {
    date: '2026-09-17',
    commit: '26dacd8',
    href: '/database',
    text: {
      'zh-TW': ['資料庫顯示已選篩選條件', '篩選按鈕直接列出目前條件，查找作品時更容易掌握結果。'],
      en: [
        'Made active database filters visible',
        'The filter control now summarizes the selected conditions.',
      ],
      ja: ['適用中の絞り込みを表示', 'フィルターのボタンに現在の条件を表示するようにしました。'],
    },
  },
  {
    date: '2026-09-12',
    commit: '1d20c4e',
    text: {
      'zh-TW': ['重新整理全站字體排版', '調整標題、內文與文章頁的字級和間距。'],
      en: [
        'Reworked site typography',
        'Adjusted headings, body text and spacing across article layouts.',
      ],
      ja: [
        'サイト全体の文字組みを見直し',
        '見出しや本文、記事ページの文字サイズと余白を調整しました。',
      ],
    },
  },
  {
    date: '2026-08-04',
    commit: '950f0b9',
    href: '/database',
    text: {
      'zh-TW': ['資料庫加入「想看」清單', '新增待看作品篩選，也擴充出版社資料。'],
      en: [
        'Added a Want to Watch list',
        'Introduced a planned works filter and expanded publisher data.',
      ],
      ja: ['「観たい」リストを追加', 'これから見る作品の絞り込みと出版社の情報を追加しました。'],
    },
  },
  {
    date: '2026-08-01',
    commit: '8c454d7',
    href: '/live',
    text: {
      'zh-TW': ['擴充 Live 紀錄', '補上更多演出，並整理場地資料。'],
      en: ['Expanded the Live log', 'Added more shows and cleaned up venue references.'],
      ja: ['ライブの記録を拡充', '公演を追加し、会場の情報を整理しました。'],
    },
  },
  {
    date: '2026-05-24',
    commit: 'c47564f',
    href: '/about',
    text: {
      'zh-TW': ['改寫關於頁', '重新整理自我介紹，讓這個網站背後的人更清楚。'],
      en: ['Refreshed About', 'Reworked the introduction to the person behind the site.'],
      ja: ['自己紹介を更新', 'このサイトを書いている人の紹介を整理しました。'],
    },
  },
  {
    date: '2026-05-24',
    commit: 'b7e5eac',
    text: {
      'zh-TW': ['移除小說獨立分類', '重新整理文章分類與導覽連結。'],
      en: ['Removed the separate Novel section', 'Simplified the categories and navigation links.'],
      ja: ['小説の独立カテゴリーを終了', '記事の分類とナビゲーションを整理しました。'],
    },
  },
  {
    date: '2026-05-24',
    commit: '1d4bd61',
    text: {
      'zh-TW': ['更新網站配色', '調整首頁與贊助區塊的色彩和元件樣式。'],
      en: [
        'Updated the site colors',
        'Refined colors and components on the home page and support section.',
      ],
      ja: ['サイトの配色を更新', 'ホームと支援セクションの色や表示を調整しました。'],
    },
  },
  {
    date: '2026-05-23',
    commit: 'b626f40',
    href: '/',
    text: {
      'zh-TW': ['首頁大改版', '加入精選內容與網站捷徑，重新安排首頁的閱讀動線。'],
      en: [
        'Redesigned the home page',
        'Added featured picks and shortcuts, with a new path through the site.',
      ],
      ja: ['ホームページを大幅に改修', 'おすすめ記事とサイト内の近道を加え、導線を見直しました。'],
    },
  },
  {
    date: '2026-05-23',
    commit: 'b27489c',
    href: '/live',
    text: {
      'zh-TW': ['新增 Live 紀錄', '為看過的現場演出留下一份清單。'],
      en: ['Added the Live log', 'A place to keep track of shows I have attended.'],
      ja: ['ライブの記録を追加', '足を運んだ公演を一覧に残せるようにしました。'],
    },
  },
  {
    date: '2026-05-23',
    commit: '33621f6',
    href: '/guestbook',
    text: {
      'zh-TW': ['新增簽名板', '訪客可以簽到、分享網站，也可以留下想說的話。'],
      en: ['Added the Guestbook', 'Visitors can sign in, share their sites or leave a note.'],
      ja: [
        'ゲストブックを追加',
        '訪問者が記帳し、自分のサイトやメッセージを残せるようにしました。',
      ],
    },
  },
  {
    date: '2026-05-23',
    commit: '33621f6',
    text: {
      'zh-TW': ['加入贊助區塊與文章評論', '在文章與關於頁加入支持入口，文章重新開放留言。'],
      en: [
        'Added support and post comments',
        'Introduced support links and reopened comments on posts.',
      ],
      ja: ['支援と記事コメントを追加', '支援へのリンクを設け、記事へのコメントを再開しました。'],
    },
  },
  {
    date: '2026-05-23',
    commit: '942628b',
    href: '/database',
    text: {
      'zh-TW': ['作品資料庫擴充', '把看過的作品拆成結構化清單，加入更完整的篩選與資料。'],
      en: [
        'Expanded the works database',
        'Organized watched and read works into structured collections with richer filters.',
      ],
      ja: ['作品データベースを拡充', '見たり読んだりした作品を整理し、絞り込みを充実させました。'],
    },
  },
  {
    date: '2026-05-23',
    commit: 'ea20d27',
    text: {
      'zh-TW': ['Stream 暫時下線', '在網站分類調整時，先移除了舊的隨筆頁。'],
      en: ['Stream temporarily retired', 'Removed the old Stream page during a category cleanup.'],
      ja: ['雑記を一時的に終了', 'カテゴリー整理に伴い、以前の雑記ページを取り下げました。'],
    },
  },
  {
    date: '2026-05-23',
    commit: '114d516',
    href: '/review',
    text: {
      'zh-TW': ['感想文章搬到 Review', '重新整理作品感想與讀書筆記的分類。'],
      en: ['Moved reflections into Review', 'Reorganized reviews of works and reading notes.'],
      ja: ['感想記事を Review に移動', '作品の感想と読書メモの分類を整理しました。'],
    },
  },
  {
    date: '2026-05-07',
    commit: 'b9a8f1a',
    href: '/now',
    text: {
      'zh-TW': ['新增 NOW 頁', '集中記錄目前所在的位置、近況與正在做的事。'],
      en: ['Added the Now page', 'A place for my current location, activities and projects.'],
      ja: ['NOW ページを追加', '現在の居場所や近況、取り組んでいることをまとめました。'],
    },
  },
  {
    date: '2026-05-07',
    commit: 'b9a8f1a',
    href: '/random',
    text: {
      'zh-TW': ['新增 Random', '隨機挑出一篇文章，提供另一種逛網站的方式。'],
      en: [
        'Added Random',
        'A different way to explore the site, one randomly chosen post at a time.',
      ],
      ja: ['ランダム記事を追加', '記事を一つランダムに選んで読めるようにしました。'],
    },
  },
  {
    date: '2026-05-07',
    commit: 'b9a8f1a',
    href: '/database',
    text: {
      'zh-TW': ['作品清單初登場', '開始整理讀過與看過的作品，成為後來作品資料庫的起點。'],
      en: [
        'Started the works list',
        'Began collecting watched and read works, the starting point of the later database.',
      ],
      ja: [
        '作品リストを公開',
        '見たり読んだりした作品をまとめ始め、後のデータベースの土台になりました。',
      ],
    },
  },
  {
    date: '2026-05-07',
    commit: 'b9a8f1a',
    text: {
      'zh-TW': ['補回軟體文章', '再次把軟體分類與舊文章放進網站導覽。'],
      en: [
        'Restored software posts',
        'Brought software writing and its category back into site navigation.',
      ],
      ja: ['技術記事を再公開', 'ソフトウェアの分類と以前の記事をナビゲーションに戻しました。'],
    },
  },
  {
    date: '2026-04-30',
    commit: '408b4a8',
    text: {
      'zh-TW': ['文章圖片加入說明文字', '讓封面圖片可以附上圖說。'],
      en: ['Added cover captions', 'Post cover images can now include a caption.'],
      ja: [
        '記事のカバー画像に説明文を追加',
        'カバー画像にキャプションを付けられるようにしました。',
      ],
    },
  },
  {
    date: '2026-02-23',
    commit: '488e77c',
    text: {
      'zh-TW': ['啟用語言偵測', '網站會依瀏覽器語言選擇初次進入的版本。'],
      en: [
        'Enabled locale detection',
        'The site can choose an initial language from the browser settings.',
      ],
      ja: ['言語の自動判定を有効化', 'ブラウザーの設定に応じて、最初に表示する言語を選びます。'],
    },
  },
  {
    date: '2026-02-09',
    commit: '7aa178d',
    text: {
      'zh-TW': ['調整手機版語言切換', '手機選單移除語言切換入口；網站仍維持三語內容。'],
      en: [
        'Adjusted mobile language switching',
        'Removed the language switch from the mobile menu; the site still has three-language content.',
      ],
      ja: [
        'モバイルの言語切り替えを調整',
        'モバイルメニューから切り替えを外しましたが、三言語のコンテンツは続いています。',
      ],
    },
  },
  {
    date: '2026-02-07',
    commit: 'd82beb7',
    text: {
      'zh-TW': ['擴充三語文章', '為大量既有文章補上英文與日文版本。'],
      en: [
        'Expanded multilingual writing',
        'Added English and Japanese versions of many existing posts.',
      ],
      ja: ['三言語の記事を拡充', '既存の記事に英語版と日本語版を多数追加しました。'],
    },
  },
  {
    date: '2026-02-07',
    commit: 'd82beb7',
    text: {
      'zh-TW': ['移除舊標籤系統', '精簡分類方式，改以文章類別作為主要入口。'],
      en: ['Removed the old tag system', 'Simplified browsing around article categories.'],
      ja: ['旧タグ機能を終了', '記事カテゴリーを中心とした探し方に整理しました。'],
    },
  },
  {
    date: '2025-11-20',
    commit: 'e82a9df',
    text: {
      'zh-TW': ['文章標題可直接連結', '可以複製小標題的網址，分享文章中的特定段落。'],
      en: [
        'Added links to article headings',
        'Individual sections can be linked and shared directly.',
      ],
      ja: ['記事の見出しにリンクを追加', '特定の段落の URL をコピーして共有できるようにしました。'],
    },
  },
  {
    date: '2025-01-05',
    commit: '1fc8a55',
    text: {
      'zh-TW': ['文章加入 Substack 嵌入內容', '讓文章可以呈現 Substack 的內容。'],
      en: ['Added Substack embeds', 'Posts gained support for embedded Substack content.'],
      ja: [
        'Substack の埋め込みに対応',
        '記事内に Substack のコンテンツを表示できるようにしました。',
      ],
    },
  },
  {
    date: '2024-09-25',
    commit: '8c2b7da',
    text: {
      'zh-TW': ['文章目錄固定顯示', '閱讀長文時，目錄可以隨捲動保持在視線內。'],
      en: [
        'Made the table of contents sticky',
        'Long posts keep their section list within reach while scrolling.',
      ],
      ja: ['記事の目次を固定', '長い記事でもスクロール中に目次を参照できるようにしました。'],
    },
  },
  {
    date: '2024-09-17',
    commit: '037d0fc',
    text: {
      'zh-TW': ['日常改名為 Stream', '把短篇日常內容整理成隨筆分類。'],
      en: ['Daily became Stream', 'Reframed shorter everyday posts as Stream.'],
      ja: ['日常を雑記へ変更', '短い日常の文章を雑記としてまとめました。'],
    },
  },
  {
    date: '2024-09-16',
    commit: '64b00c9',
    text: {
      'zh-TW': ['RSS 提供文章內容', '重新整理訂閱檔，讓閱讀器能取得文章內容。'],
      en: [
        'Added post content to RSS',
        'Reworked the feed so readers can receive article content.',
      ],
      ja: ['RSS に記事本文を追加', 'フィードを見直し、リーダーで記事を読めるようにしました。'],
    },
  },
  {
    date: '2024-09-15',
    commit: 'ee5b4cc',
    text: {
      'zh-TW': ['網站第二版', '文章從單一部落格拆成生活、閱讀、感想與軟體等分類，也重做導覽。'],
      en: [
        'Site version two',
        'Split the blog into categories such as life, reading, reviews and software, and rebuilt navigation.',
      ],
      ja: [
        'サイトの第2版',
        'ブログを生活・読書・感想・ソフトウェアなどに分け、ナビゲーションを作り直しました。',
      ],
    },
  },
  {
    date: '2024-06-17',
    commit: '2c344ae',
    text: {
      'zh-TW': ['調整配色與圖示', '為當時的版面換上新的色彩與圖示。'],
      en: [
        'Updated colors and icons',
        'Refreshed the visual palette and icons of the earlier layout.',
      ],
      ja: ['配色とアイコンを調整', '当時のレイアウトの色とアイコンを更新しました。'],
    },
  },
  {
    date: '2023-10-29',
    commit: '245b8f7',
    text: {
      'zh-TW': ['加入文章分享圖片', '為文章建立專屬的社群分享預覽圖。'],
      en: ['Added social preview images', 'Posts gained their own images for link previews.'],
      ja: ['記事の共有画像を追加', 'リンクを共有したときの記事別プレビュー画像を作りました。'],
    },
  },
  {
    date: '2023-07-16',
    commit: 'acf98a4',
    text: {
      'zh-TW': ['文章加入目錄', '長文開始提供段落導覽。'],
      en: ['Added tables of contents', 'Long posts gained section navigation.'],
      ja: ['記事に目次を追加', '長い記事を章ごとにたどれるようにしました。'],
    },
  },
  {
    date: '2023-06-01',
    commit: 'cb955e6',
    text: {
      'zh-TW': ['建立三語入口', '初版就規劃了繁體中文、英文與日文的語言選項。'],
      en: [
        'Introduced three-language navigation',
        'The first version offered Traditional Chinese, English and Japanese language options.',
      ],
      ja: ['三言語の入口を用意', '初期版から繁体字中国語・英語・日本語の選択肢を設けました。'],
    },
  },
  {
    date: '2023-05-29',
    commit: '8bf0c70',
    text: {
      'zh-TW': ['網站開始', '第一個可運作的版本上線。'],
      en: ['The site began', 'The first working version took shape.'],
      ja: ['サイトの始まり', '最初に動く形ができました。'],
    },
  },
];

export default changelog;
