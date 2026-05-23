import fs from 'node:fs/promises';
import path from 'node:path';
import { Converter } from 'opencc-js';

const ROOT = process.cwd();
const DATABASE_DIR = path.join(ROOT, 'data', 'database');
const REVIEW_DIR = path.join(DATABASE_DIR, 'review');
const WIKIDATA_SPARQL = 'https://query.wikidata.org/sparql';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const BANGUMI_API = 'https://api.bgm.tv/v0/search/subjects';
const USER_AGENT = 'parkerchang-my-site/1.0 (database enrichment)';
const toTraditional = Converter({ from: 'cn', to: 'tw' });

const FILES = ['anime.json', 'film.json'];
const TITLE_LANG_PRIORITY = ['zh-tw', 'zh-hant', 'zh'];
const CREATOR_ROLES = [
  'Original Creator',
  'Original Story',
  'Story & Art',
  'Story',
  'Art',
  'Original Character Design',
];

const TITLE_OVERRIDES = {
  185736: {
    value: '正義使者 -我的英雄學院之非法英雄-',
    source: 'https://bgm.tv/subject/529995',
    confidence: 'medium',
    notes:
      'Bangumi Chinese title matched by manual review; converted to Traditional Chinese for zh-TW display.',
  },
  861: {
    value: '四月一日靈異事件簿',
    source: 'https://zh.wikipedia.org/wiki/%C3%97%C3%97%C3%97HOLiC',
    confidence: 'high',
    notes: 'Chinese Wikipedia title for xxxHOLiC.',
  },
  21798: {
    value: 'K SEVEN STORIES Episode1「R：B～BLAZE～」',
    source:
      'https://data.zhupiter.com/oddt/22331732/K-SEVEN-STORIES-Episode1-R-B-BLAZE-K-SEVEN-STORIES-Episode1-R-B-BLAZE/',
    confidence: 'medium',
    notes: 'Taiwan film rating data title matched by manual review.',
  },
};

const PUBLISHER_OVERRIDES = {
  '8_bit': {
    zh: '8bit',
    ja: 'エイトビット',
    en: 'Eight Bit',
    source: 'https://www.wikidata.org/wiki/Q5363761',
  },
  a_1_pictures: {
    zh: 'A-1 Pictures',
    ja: 'A-1 Pictures',
    en: 'A-1 Pictures',
    source: 'https://www.wikidata.org/wiki/Q211082',
  },
  actas: {
    zh: 'Actas',
    ja: 'アクタス',
    en: 'Actas',
    source: 'https://www.wikidata.org/wiki/Q4675769',
  },
  ajiado: {
    zh: '亞細亞堂',
    ja: '亜細亜堂',
    en: 'Ajia-do Animation Works',
    source: 'https://www.wikidata.org/wiki/Q4699910',
  },
  aniplex: {
    zh: 'Aniplex',
    ja: 'アニプレックス',
    en: 'Aniplex',
    source: 'https://www.wikidata.org/wiki/Q638985',
  },
  asatsu_dk: {
    zh: 'ADK',
    ja: 'アサツー ディ・ケイ',
    en: 'Asatsu-DK',
    source: 'https://www.wikidata.org/wiki/Q722732',
  },
  avex_pictures: {
    zh: 'Avex Pictures',
    ja: 'エイベックス・ピクチャーズ',
    en: 'Avex Pictures',
    source: 'https://www.wikidata.org/wiki/Q17222604',
  },
  bandai_namco_pictures: {
    zh: '萬代南夢宮影像製作',
    ja: 'バンダイナムコピクチャーズ',
    en: 'Bandai Namco Pictures',
    source: 'https://www.wikidata.org/wiki/Q20004287',
  },
  bandai_visual: {
    zh: '萬代影視',
    ja: 'バンダイビジュアル',
    en: 'Bandai Visual',
    source: 'https://www.wikidata.org/wiki/Q806302',
  },
  bones: { zh: 'BONES', ja: 'ボンズ', en: 'Bones', source: 'https://www.wikidata.org/wiki/Q8877' },
  brain_s_base: {
    zh: "Brain's Base",
    ja: 'ブレインズ・ベース',
    en: "Brain's Base",
    source: 'https://www.wikidata.org/wiki/Q4954856',
  },
  bridge: {
    zh: 'Bridge',
    ja: 'ブリッジ',
    en: 'Bridge',
    source: 'https://www.wikidata.org/wiki/Q4965596',
  },
  cloverworks: {
    zh: 'CloverWorks',
    ja: 'CloverWorks',
    en: 'CloverWorks',
    source: 'https://www.wikidata.org/wiki/Q5129537',
  },
  comix_wave: {
    zh: 'CoMix Wave Films',
    ja: 'コミックス・ウェーブ・フィルム',
    en: 'CoMix Wave Films',
    source: 'https://www.wikidata.org/wiki/Q2994196',
  },
  crunchyroll: {
    zh: 'Crunchyroll',
    ja: 'クランチロール',
    en: 'Crunchyroll',
    source: 'https://www.wikidata.org/wiki/Q207128',
  },
  david_production: {
    zh: 'david production',
    ja: 'デイヴィッドプロダクション',
    en: 'David Production',
    source: 'https://www.wikidata.org/wiki/Q5234213',
  },
  doga_kobo: {
    zh: '動畫工房',
    ja: '動画工房',
    en: 'Doga Kobo',
    source: 'https://www.wikidata.org/wiki/Q5288007',
  },
  funimation: {
    zh: 'Funimation',
    ja: 'ファニメーション',
    en: 'Funimation',
    source: 'https://www.wikidata.org/wiki/Q1381953',
  },
  gainax: {
    zh: 'GAINAX',
    ja: 'ガイナックス',
    en: 'Gainax',
    source: 'https://www.wikidata.org/wiki/Q501905',
  },
  genco: {
    zh: 'GENCO',
    ja: 'ジェンコ',
    en: 'Genco',
    source: 'https://www.wikidata.org/wiki/Q3101016',
  },
  gonzo: {
    zh: 'GONZO',
    ja: 'ゴンゾ',
    en: 'Gonzo',
    source: 'https://www.wikidata.org/wiki/Q1526027',
  },
  j_c_staff: {
    zh: 'J.C.STAFF',
    ja: 'J.C.STAFF',
    en: 'J.C.Staff',
    source: 'https://www.wikidata.org/wiki/Q1131282',
  },
  kadokawa: {
    zh: 'KADOKAWA',
    ja: 'KADOKAWA',
    en: 'Kadokawa Corporation',
    source: 'https://www.wikidata.org/wiki/Q11336076',
  },
  kinema_citrus: {
    zh: 'Kinema Citrus',
    ja: 'キネマシトラス',
    en: 'Kinema Citrus',
    source: 'https://www.wikidata.org/wiki/Q6411590',
  },
  kodansha: {
    zh: '講談社',
    ja: '講談社',
    en: 'Kodansha',
    source: 'https://www.wikidata.org/wiki/Q483454',
  },
  kyoto_animation: {
    zh: '京都動畫',
    ja: '京都アニメーション',
    en: 'Kyoto Animation',
    source: 'https://www.wikidata.org/wiki/Q132359',
  },
  lantis: {
    zh: 'Lantis',
    ja: 'ランティス',
    en: 'Lantis',
    source: 'https://www.wikidata.org/wiki/Q849523',
  },
  lerche: {
    zh: 'Lerche',
    ja: 'ラルケ',
    en: 'Lerche',
    source: 'https://www.wikidata.org/wiki/Q6530242',
  },
  lidenfilms: {
    zh: 'LIDENFILMS',
    ja: 'ライデンフィルム',
    en: 'Liden Films',
    source: 'https://www.wikidata.org/wiki/Q6544073',
  },
  madhouse: {
    zh: 'MADHOUSE',
    ja: 'マッドハウス',
    en: 'Madhouse',
    source: 'https://www.wikidata.org/wiki/Q843586',
  },
  manglobe: {
    zh: 'Manglobe',
    ja: 'マングローブ',
    en: 'Manglobe',
    source: 'https://www.wikidata.org/wiki/Q2479446',
  },
  mappa: {
    zh: 'MAPPA',
    ja: 'MAPPA',
    en: 'MAPPA',
    source: 'https://www.wikidata.org/wiki/Q6754576',
  },
  netflix: {
    zh: 'Netflix',
    ja: 'Netflix',
    en: 'Netflix',
    source: 'https://www.wikidata.org/wiki/Q907311',
  },
  nippon_animation: {
    zh: '日本動畫公司',
    ja: '日本アニメーション',
    en: 'Nippon Animation',
    source: 'https://www.wikidata.org/wiki/Q1418144',
  },
  orange: {
    zh: 'Orange',
    ja: 'オレンジ',
    en: 'Orange',
    source: 'https://www.wikidata.org/wiki/Q17033710',
  },
  p_a_works: {
    zh: 'P.A.WORKS',
    ja: 'ピーエーワークス',
    en: 'P.A. Works',
    source: 'https://www.wikidata.org/wiki/Q2836934',
  },
  polygon_pictures: {
    zh: 'Polygon Pictures',
    ja: 'ポリゴン・ピクチュアズ',
    en: 'Polygon Pictures',
    source: 'https://www.wikidata.org/wiki/Q1706176',
  },
  production_i_g: {
    zh: 'Production I.G',
    ja: 'Production I.G',
    en: 'Production I.G',
    source: 'https://www.wikidata.org/wiki/Q922635',
  },
  science_saru: {
    zh: 'Science SARU',
    ja: 'サイエンスSARU',
    en: 'Science Saru',
    source: 'https://www.wikidata.org/wiki/Q16900669',
  },
  sentai_filmworks: {
    zh: 'Sentai Filmworks',
    ja: 'Sentai Filmworks',
    en: 'Sentai Filmworks',
    source: 'https://www.wikidata.org/wiki/Q7452412',
  },
  shaft: {
    zh: 'SHAFT',
    ja: 'シャフト',
    en: 'Shaft',
    source: 'https://www.wikidata.org/wiki/Q1337121',
  },
  shogakukan_shueisha_productions: {
    zh: '小學館集英社製作',
    ja: '小学館集英社プロダクション',
    en: 'Shogakukan-Shueisha Productions',
    source: 'https://www.wikidata.org/wiki/Q7500023',
  },
  shouchiku: {
    zh: '松竹',
    ja: '松竹',
    en: 'Shochiku',
    source: 'https://www.wikidata.org/wiki/Q260756',
  },
  shueisha: {
    zh: '集英社',
    ja: '集英社',
    en: 'Shueisha',
    source: 'https://www.wikidata.org/wiki/Q320784',
  },
  silver_link: {
    zh: 'SILVER LINK.',
    ja: 'SILVER LINK.',
    en: 'Silver Link',
    source: 'https://www.wikidata.org/wiki/Q7517076',
  },
  square_enix: {
    zh: '史克威爾艾尼克斯',
    ja: 'スクウェア・エニックス',
    en: 'Square Enix',
    source: 'https://www.wikidata.org/wiki/Q207784',
  },
  studio_4_c: {
    zh: 'STUDIO 4°C',
    ja: 'STUDIO 4℃',
    en: 'Studio 4°C',
    source: 'https://www.wikidata.org/wiki/Q2383054',
  },
  studio_chizu: {
    zh: '地圖工作室',
    ja: 'スタジオ地図',
    en: 'Studio Chizu',
    source: 'https://www.wikidata.org/wiki/Q7622922',
  },
  studio_deen: {
    zh: 'Studio DEEN',
    ja: 'スタジオディーン',
    en: 'Studio Deen',
    source: 'https://www.wikidata.org/wiki/Q2749098',
  },
  studio_ghibli: {
    zh: '吉卜力工作室',
    ja: 'スタジオジブリ',
    en: 'Studio Ghibli',
    source: 'https://www.wikidata.org/wiki/Q186898',
  },
  studio_hibari: {
    zh: '雲雀工作室',
    ja: 'スタジオ雲雀',
    en: 'Studio Hibari',
    source: 'https://www.wikidata.org/wiki/Q7623019',
  },
  studio_pierrot: {
    zh: 'Studio Pierrot',
    ja: 'ぴえろ',
    en: 'Pierrot',
    source: 'https://www.wikidata.org/wiki/Q1143112',
  },
  sunrise: {
    zh: '日昇動畫',
    ja: 'サンライズ',
    en: 'Sunrise',
    source: 'https://www.wikidata.org/wiki/Q166886',
  },
  tatsunoko_production: {
    zh: '龍之子製作',
    ja: 'タツノコプロ',
    en: 'Tatsunoko Production',
    source: 'https://www.wikidata.org/wiki/Q1076136',
  },
  tms_entertainment: {
    zh: 'TMS娛樂',
    ja: 'トムス・エンタテインメント',
    en: 'TMS Entertainment',
    source: 'https://www.wikidata.org/wiki/Q1068938',
  },
  toei_animation: {
    zh: '東映動畫',
    ja: '東映アニメーション',
    en: 'Toei Animation',
    source: 'https://www.wikidata.org/wiki/Q129011',
  },
  toho: { zh: '東寶', ja: '東宝', en: 'Toho', source: 'https://www.wikidata.org/wiki/Q208127' },
  trigger: {
    zh: 'TRIGGER',
    ja: 'TRIGGER',
    en: 'Trigger',
    source: 'https://www.wikidata.org/wiki/Q654813',
  },
  tv_asahi: {
    zh: '朝日電視台',
    ja: 'テレビ朝日',
    en: 'TV Asahi',
    source: 'https://www.wikidata.org/wiki/Q908850',
  },
  tv_tokyo: {
    zh: '東京電視台',
    ja: 'テレビ東京',
    en: 'TV Tokyo',
    source: 'https://www.wikidata.org/wiki/Q752964',
  },
  ufotable: {
    zh: 'ufotable',
    ja: 'ユーフォーテーブル',
    en: 'Ufotable',
    source: 'https://www.wikidata.org/wiki/Q1138352',
  },
  white_fox: {
    zh: 'WHITE FOX',
    ja: 'WHITE FOX',
    en: 'White Fox',
    source: 'https://www.wikidata.org/wiki/Q2364414',
  },
  wit_studio: {
    zh: 'WIT STUDIO',
    ja: 'ウィットスタジオ',
    en: 'Wit Studio',
    source: 'https://www.wikidata.org/wiki/Q8020378',
  },
  xebec: {
    zh: 'XEBEC',
    ja: 'ジーベック',
    en: 'Xebec',
    source: 'https://www.wikidata.org/wiki/Q1664150',
  },
};

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function escapeSparqlString(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function publisherKey(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function getJson(url, params) {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`${url}?${searchParams.toString()}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`${url} failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function querySparql(query) {
  return getJson(WIKIDATA_SPARQL, { format: 'json', query });
}

function bestLabelFromBinding(binding, prefix = '') {
  for (const lang of TITLE_LANG_PRIORITY) {
    const key = `${prefix}${lang.replace(/-/g, '')}`;
    if (binding[key]?.value) return { value: binding[key].value, lang };
  }
  return null;
}

async function fetchTitleLabels(anilistIds) {
  const labels = new Map();

  for (const ids of chunk(anilistIds, 80)) {
    const values = ids.map((id) => `"${escapeSparqlString(id)}"`).join(' ');
    const query = `
SELECT ?anilist ?item ?zhtw ?zhhant ?zh WHERE {
  VALUES ?anilist { ${values} }
  ?item wdt:P8729 ?anilist.
  OPTIONAL { ?item rdfs:label ?zhtw FILTER(LANG(?zhtw) = "zh-tw") }
  OPTIONAL { ?item rdfs:label ?zhhant FILTER(LANG(?zhhant) = "zh-hant") }
  OPTIONAL { ?item rdfs:label ?zh FILTER(LANG(?zh) = "zh") }
}`;
    const result = await querySparql(query);
    for (const binding of result.results.bindings) {
      const label = bestLabelFromBinding(binding);
      if (label) {
        labels.set(binding.anilist.value, {
          value: label.value,
          lang: label.lang,
          source: binding.item.value.replace(
            'http://www.wikidata.org/entity/',
            'https://www.wikidata.org/wiki/'
          ),
        });
      }
    }
  }

  return labels;
}

async function fetchCreatorLabels(names) {
  const labels = new Map();

  for (const group of chunk(names, 60)) {
    const values = group
      .flatMap((name) => [`"${escapeSparqlString(name)}"@ja`, `"${escapeSparqlString(name)}"@en`])
      .join(' ');
    const query = `
SELECT ?jaName ?person ?zhtw ?zhhant ?zh WHERE {
  VALUES ?jaName { ${values} }
  ?person rdfs:label ?jaName.
  VALUES ?class { wd:Q5 wd:Q43229 wd:Q4830453 }
  ?person wdt:P31/wdt:P279* ?class.
  OPTIONAL { ?person rdfs:label ?zhtw FILTER(LANG(?zhtw) = "zh-tw") }
  OPTIONAL { ?person rdfs:label ?zhhant FILTER(LANG(?zhhant) = "zh-hant") }
  OPTIONAL { ?person rdfs:label ?zh FILTER(LANG(?zh) = "zh") }
}`;
    const result = await querySparql(query);
    for (const binding of result.results.bindings) {
      const label = bestLabelFromBinding(binding);
      if (label) {
        labels.set(binding.jaName.value, {
          value: label.value,
          lang: label.lang,
          source: binding.person.value.replace(
            'http://www.wikidata.org/entity/',
            'https://www.wikidata.org/wiki/'
          ),
        });
      }
    }
  }

  return labels;
}

async function fetchBangumiTitle(work) {
  const subject = await fetchBangumiSubject(work);
  if (!subject?.name_cn) return null;
  return {
    value: subject.name_cn,
    source: `https://bgm.tv/subject/${subject.id}`,
  };
}

async function fetchBangumiSubject(work) {
  const response = await fetch(`${BANGUMI_API}?limit=5`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({
      keyword: work.title_ja,
      filter: { type: [2] },
    }),
  });

  if (!response.ok) return null;
  const result = await response.json();
  const matches = result.data ?? [];
  return (
    matches.find((item) => item.name === work.title_ja) ??
    matches.find((item) => item.name_cn === work.title_zh) ??
    matches[0] ??
    null
  );
}

function infoboxValue(subject, keys) {
  const item = subject?.infobox?.find((entry) => keys.includes(entry.key));
  if (!item) return null;
  if (typeof item.value === 'string') return item.value;
  if (Array.isArray(item.value))
    return item.value
      .map((value) => value.v)
      .filter(Boolean)
      .join('、');
  return null;
}

function cleanCreator(value) {
  if (!value) return null;
  return value
    .replace(/^『?「?[^」』]+[」』]?\s*/u, '')
    .replace(/（.*?）/gu, '')
    .replace(/\(.*?\)/gu, '')
    .replace(/(集英社|講談社|小学館|ジャンプ コミックス刊|連載|刊).*$/u, '')
    .replace(/[;；].*$/u, '')
    .trim();
}

function zhTw(value) {
  if (!value) return value;
  return toTraditional(value).replace(/緋彈的亞裡亞/g, '緋彈的亞莉亞');
}

function labelValue(labels, languageCodes) {
  for (const languageCode of languageCodes) {
    if (labels?.[languageCode]?.value) return labels[languageCode].value;
  }
  return null;
}

async function fetchPublisherFromWikidata(name) {
  const search = await getJson(WIKIDATA_API, {
    action: 'wbsearchentities',
    format: 'json',
    language: 'en',
    uselang: 'en',
    type: 'item',
    limit: '1',
    search: `${name} anime studio`,
  });
  const id = search.search?.[0]?.id;
  if (!id) return null;

  const entityResult = await getJson(WIKIDATA_API, {
    action: 'wbgetentities',
    format: 'json',
    props: 'labels',
    languages: 'zh-tw|zh-hant|zh|ja|en',
    ids: id,
  });
  const labels = entityResult.entities?.[id]?.labels;
  if (!labels) return null;

  return {
    zh: zhTw(labelValue(labels, ['zh-tw', 'zh-hant', 'zh']) ?? name),
    ja: labelValue(labels, ['ja']) ?? name,
    en: labelValue(labels, ['en']) ?? name,
    source: `https://www.wikidata.org/wiki/${id}`,
    confidence: labelValue(labels, ['zh-tw', 'zh-hant', 'zh']) ? 'high' : 'medium',
  };
}

function firstCreatorFromRaw(media) {
  const edge = media?.staff?.edges?.find((item) => CREATOR_ROLES.includes(item.role?.trim()));
  if (!edge) return null;
  return {
    ja: edge.node?.name?.nativeName ?? null,
    en: edge.node?.name?.full ?? null,
  };
}

function buildRawMediaMap(rawFiles) {
  const media = new Map();
  for (const raw of rawFiles) {
    const entries = raw.data.MediaListCollection.lists.flatMap((list) => list.entries);
    for (const entry of entries) {
      media.set(entry.media.id, entry.media);
    }
  }
  return media;
}

function reviewEntry({ file, id, anilistId, field, value, confidence, sources, notes }) {
  return {
    file,
    id,
    anilist_id: anilistId,
    field,
    value,
    confidence,
    sources,
    notes,
  };
}

async function main() {
  const rawMedia = buildRawMediaMap([
    await readJson(path.join(ROOT, 'cache', 'raw_anime.json')),
    await readJson(path.join(ROOT, 'cache', 'raw_manga.json')),
  ]);
  const collections = await Promise.all(
    FILES.map(async (file) => ({
      file,
      items: await readJson(path.join(DATABASE_DIR, file)),
    }))
  );
  const allWorks = collections.flatMap(({ file, items }) => items.map((item) => ({ file, item })));
  const anilistIds = allWorks.map(({ item }) => String(item.anilist_id)).filter(Boolean);

  const creatorJaNames = [
    ...new Set(
      allWorks
        .flatMap(({ item }) => {
          const rawCreator = firstCreatorFromRaw(rawMedia.get(item.anilist_id));
          return [item.creator_ja ?? rawCreator?.ja, item.creator_en ?? rawCreator?.en];
        })
        .filter(Boolean)
    ),
  ];

  const publisherNames = new Map();
  for (const { item } of allWorks) {
    const raw = rawMedia.get(item.anilist_id);
    const firstStudioName = raw?.studios?.nodes?.[0]?.name ?? null;
    if (item.publisher && firstStudioName) {
      publisherNames.set(item.publisher, firstStudioName);
    }
  }

  const titleLabels = await fetchTitleLabels(anilistIds);
  const creatorLabels = await fetchCreatorLabels(creatorJaNames);
  const publisherLabels = new Map();

  for (const [key, name] of publisherNames) {
    if (PUBLISHER_OVERRIDES[key]) {
      publisherLabels.set(key, { ...PUBLISHER_OVERRIDES[key], confidence: 'high' });
      continue;
    }
    const fromWikidata = await fetchPublisherFromWikidata(name).catch(() => null);
    publisherLabels.set(
      key,
      fromWikidata ?? {
        zh: name,
        ja: name,
        en: name,
        source: 'AniList',
        confidence: 'low',
      }
    );
  }

  const review = [];

  for (const { file, items } of collections) {
    for (const item of items) {
      item.creator_zh = null;

      const titleLabel = titleLabels.get(String(item.anilist_id));
      const titleOverride = TITLE_OVERRIDES[item.anilist_id];
      if (!item.title_zh && titleOverride) {
        item.title_zh = zhTw(titleOverride.value);
        review.push(
          reviewEntry({
            file,
            id: item.id,
            anilistId: item.anilist_id,
            field: 'title_zh',
            value: item.title_zh,
            confidence: titleOverride.confidence,
            sources: [titleOverride.source],
            notes: titleOverride.notes,
          })
        );
      } else if (!item.title_zh && titleLabel) {
        item.title_zh = zhTw(titleLabel.value);
        review.push(
          reviewEntry({
            file,
            id: item.id,
            anilistId: item.anilist_id,
            field: 'title_zh',
            value: item.title_zh,
            confidence: 'high',
            sources: [titleLabel.source],
            notes: `Wikidata ${titleLabel.lang} label matched by AniList ID.`,
          })
        );
      } else if (!item.title_zh) {
        const bangumiTitle = await fetchBangumiTitle(item).catch(() => null);
        if (bangumiTitle) {
          item.title_zh = zhTw(bangumiTitle.value);
          review.push(
            reviewEntry({
              file,
              id: item.id,
              anilistId: item.anilist_id,
              field: 'title_zh',
              value: item.title_zh,
              confidence: 'medium',
              sources: [bangumiTitle.source],
              notes:
                'Bangumi name_cn matched from Japanese title search after no Wikidata Chinese label was found.',
            })
          );
        } else {
          review.push(
            reviewEntry({
              file,
              id: item.id,
              anilistId: item.anilist_id,
              field: 'title_zh',
              value: null,
              confidence: 'missing',
              sources: [],
              notes:
                'No Wikidata Traditional Chinese/Chinese label or Bangumi Chinese title found.',
            })
          );
        }
      }

      const rawCreator = firstCreatorFromRaw(rawMedia.get(item.anilist_id));
      const creatorJa = item.creator_ja ?? rawCreator?.ja ?? null;
      const creatorEn = item.creator_en ?? rawCreator?.en ?? null;
      const creatorLabel =
        (creatorJa ? creatorLabels.get(creatorJa) : null) ??
        (creatorEn ? creatorLabels.get(creatorEn) : null);
      if (!item.creator_zh && creatorLabel) {
        item.creator_zh = zhTw(creatorLabel.value);
        review.push(
          reviewEntry({
            file,
            id: item.id,
            anilistId: item.anilist_id,
            field: 'creator_zh',
            value: item.creator_zh,
            confidence: 'high',
            sources: [creatorLabel.source],
            notes: `Wikidata ${creatorLabel.lang} label matched by Japanese creator name "${creatorJa}".`,
          })
        );
      } else if (!item.creator_zh) {
        const fallbackCreator = creatorJa ?? creatorEn;
        if (fallbackCreator) {
          item.creator_zh = zhTw(fallbackCreator);
          review.push(
            reviewEntry({
              file,
              id: item.id,
              anilistId: item.anilist_id,
              field: 'creator_zh',
              value: item.creator_zh,
              confidence: 'low',
              sources: ['AniList'],
              notes:
                'No Wikidata Chinese label found; preserved the available AniList creator name for manual review.',
            })
          );
        } else {
          const subject = await fetchBangumiSubject(item).catch(() => null);
          const bangumiCreator = cleanCreator(infoboxValue(subject, ['原作', '原案']));
          if (bangumiCreator) {
            item.creator_zh = zhTw(bangumiCreator);
            review.push(
              reviewEntry({
                file,
                id: item.id,
                anilistId: item.anilist_id,
                field: 'creator_zh',
                value: item.creator_zh,
                confidence: 'medium',
                sources: [`https://bgm.tv/subject/${subject.id}`],
                notes: 'Creator/original work credit extracted from Bangumi infobox.',
              })
            );
          } else {
            review.push(
              reviewEntry({
                file,
                id: item.id,
                anilistId: item.anilist_id,
                field: 'creator_zh',
                value: null,
                confidence: 'missing',
                sources: [],
                notes: 'No creator name available to verify.',
              })
            );
          }
        }
      }

      if (typeof item.publisher === 'string') {
        const publisher = publisherLabels.get(item.publisher);
        if (publisher) {
          item.publisher = {
            zh: zhTw(publisher.zh),
            ja: publisher.ja,
            en: publisher.en,
          };
          review.push(
            reviewEntry({
              file,
              id: item.id,
              anilistId: item.anilist_id,
              field: 'publisher',
              value: item.publisher,
              confidence: publisher.confidence,
              sources: [publisher.source],
              notes:
                publisher.source === 'AniList'
                  ? 'Publisher name preserved from AniList because no reliable Wikidata label was found.'
                  : `Publisher slug "${publisherKey(
                      publisher.en
                    )}" enriched from Wikidata/manual Wikidata mapping.`,
            })
          );
        }
      }
    }

    await writeJson(path.join(DATABASE_DIR, file), items);
  }

  await writeJson(path.join(REVIEW_DIR, 'anime-film-zh-fill.review.json'), review);

  const summary = {
    title_zh_filled: allWorks.filter(({ item }) => item.title_zh).length,
    creator_zh_filled: allWorks.filter(({ item }) => item.creator_zh).length,
    publisher_objects: allWorks.filter(
      ({ item }) => item.publisher && typeof item.publisher === 'object'
    ).length,
    review_items: review.length,
    missing_title_zh: allWorks.filter(({ item }) => !item.title_zh).length,
    missing_creator_zh: allWorks.filter(({ item }) => !item.creator_zh).length,
  };
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
