import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { stdin as input, stdout as output } from 'node:process';
import { Converter } from 'opencc-js';

const ROOT = process.cwd();
const DATABASE_DIR = path.join(ROOT, 'data', 'database');
const WORK_FORMS = ['anime', 'film', 'manga', 'novel', 'series'];
const SCORE_VALUES = new Set([1, 2, 3, 5]);
const REVIEW_STATUSES = new Set(['pending', 'approved', 'needs_fix']);
const DATE_PATTERN = /^\d{4}(\/\d{2})?$/;
const toTraditional = Converter({ from: 'cn', to: 'tw' });
const execFileAsync = promisify(execFile);

const command = process.argv[2];
const args = process.argv.slice(3);

function parseArgs(values) {
  const parsed = { _: [] };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith('--')) {
      parsed._.push(value);
      continue;
    }

    const [rawKey, inlineValue] = value.slice(2).split('=');
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    if (inlineValue !== undefined) {
      parsed[key] = inlineValue;
    } else if (values[index + 1] && !values[index + 1].startsWith('--')) {
      parsed[key] = values[index + 1];
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

const flags = parseArgs(args);
const nonInteractive = Boolean(flags.yes || flags.nonInteractive);

async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT' && fallback !== null) return fallback;
    throw error;
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function zhTw(value) {
  if (typeof value !== 'string') return value ?? null;
  return toTraditional(value).replace(/緋彈的亞裡亞/g, '緋彈的亞莉亞');
}

function localeObject(value, prefix) {
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ('zh' in value || 'ja' in value || 'en' in value)
  ) {
    return {
      zh: zhTw(value.zh ?? null),
      ja: value.ja ?? null,
      en: value.en ?? null,
    };
  }

  return {
    zh: zhTw(value?.[`${prefix}_zh`] ?? null),
    ja: value?.[`${prefix}_ja`] ?? null,
    en: value?.[`${prefix}_en`] ?? null,
  };
}

async function readIndexedJson(relativePath) {
  const { stdout } = await execFileAsync('git', ['show', `:${relativePath}`], {
    cwd: ROOT,
    maxBuffer: 1024 * 1024 * 20,
  });
  return JSON.parse(stdout);
}

function publisherKeyFromName(name) {
  return String(name ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function titleCaseKey(key) {
  return String(key)
    .split('_')
    .filter(Boolean)
    .map((part) => {
      if (part.length <= 2) return part.toUpperCase();
      return `${part[0].toUpperCase()}${part.slice(1)}`;
    })
    .join(' ');
}

function workKeyFromTitle(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function normalizeScore(value) {
  if (value === null || value === undefined || value === '') return null;
  const score = Number(value);
  if (!SCORE_VALUES.has(score)) return null;
  return score;
}

function normalizeBoolean(value) {
  return value === true;
}

function existingArticlePath(form, key) {
  return path.join(ROOT, 'data', 'review', key, 'zh-TW.md');
}

async function articleExists(form, key) {
  try {
    await fs.access(existingArticlePath(form, key));
    return true;
  } catch {
    return false;
  }
}

async function loadMaps() {
  return readJson(path.join(DATABASE_DIR, 'maps.json'));
}

async function loadPublishers() {
  return readJson(path.join(DATABASE_DIR, 'publishers.json'), {});
}

async function loadWorks() {
  const collections = {};
  for (const form of WORK_FORMS) {
    collections[form] = await readJson(path.join(DATABASE_DIR, `${form}.json`), []);
  }
  return collections;
}

async function writeWorks(collections) {
  for (const form of WORK_FORMS) {
    await writeJson(path.join(DATABASE_DIR, `${form}.json`), collections[form] ?? []);
  }
}

function flattenWorks(collections) {
  return WORK_FORMS.flatMap((form) => (collections[form] ?? []).map((work) => ({ form, work })));
}

function matchForm(value) {
  if (!value) return null;
  if (!WORK_FORMS.includes(value)) {
    throw new Error(`Unknown form "${value}". Expected one of: ${WORK_FORMS.join(', ')}`);
  }
  return value;
}

function matchesReviewFilters(work, form, options) {
  if (options.form && form !== options.form) return false;
  if (options.status && work.my_status !== options.status) return false;
  return work.my_score === null || work.my_score === undefined;
}

function findWork(collections, form, key) {
  const items = collections[form] ?? [];
  const index = items.findIndex((work) => work.key === key);
  if (index === -1) return null;
  return { items, index, work: items[index] };
}

function uniqueWorkKey(collections, preferredKey, form) {
  const allKeys = new Set(
    flattenWorks(collections)
      .map(({ work }) => work.key)
      .filter(Boolean)
  );
  const fallback = `${form}-${allKeys.size + 1}`;
  const baseKey = workKeyFromTitle(preferredKey) || fallback;
  let key = baseKey;
  let suffix = 2;
  while (allKeys.has(key)) {
    key = `${baseKey}-${suffix}`;
    suffix += 1;
  }
  return key;
}

async function ask(rl, question, defaultValue = null) {
  if (nonInteractive) return defaultValue;
  const suffix = defaultValue === null || defaultValue === undefined ? '' : ` (${defaultValue})`;
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  return answer || defaultValue;
}

async function confirm(rl, question, defaultValue = false) {
  if (nonInteractive) return defaultValue;
  const answer = (await rl.question(`${question} [y/N]: `)).trim().toLowerCase();
  return answer === 'y' || answer === 'yes';
}

function parseNullable(value) {
  if (value === null || value === undefined || value === '') return null;
  if (value === 'null' || value === 'x') return null;
  return value;
}

function parseDateList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseGenreList(value) {
  return parseDateList(value);
}

function parseScoreInput(value) {
  if (!value || value === 'null' || value === 'x') return null;
  const score = Number(value);
  if (!SCORE_VALUES.has(score)) {
    throw new Error('score must be null, 1, 2, 3, or 5.');
  }
  return score;
}

function parseBooleanInput(value) {
  if (value === true) return true;
  if (!value) return false;
  return ['true', 'yes', 'y', '1'].includes(String(value).toLowerCase());
}

function sortableMonth(value) {
  if (!value) return null;
  const [year, month = '00'] = String(value).split('/');
  return Number(`${year}${month.padStart(2, '0')}`);
}

function currentMonth() {
  const today = new Date();
  return Number(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`);
}

function futureReleaseDates(work) {
  const now = currentMonth();
  return (work.release_dates ?? []).filter((date) => {
    const month = sortableMonth(date);
    return month !== null && month > now;
  });
}

function summarizeWork(work, form) {
  const futureDates = futureReleaseDates(work);
  const futureSummary = futureDates.length ? `\nupcoming: ${futureDates.join(', ')}` : '';
  return `[${form}] ${work.key}\nzh: ${work.title?.zh ?? '-'}\nja: ${work.title?.ja ?? '-'}\nen: ${
    work.title?.en ?? '-'
  }\nrelease: ${(work.release_dates ?? []).join(', ') || '-'}${futureSummary}\nscore: ${
    work.my_score ?? 'null'
  }\nstatus: ${work.my_status ?? '-'}`;
}

function sortedObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
}

function collectPublisherLabels(collections) {
  const publishers = {};
  for (const { work } of flattenWorks(collections)) {
    if (!work.publisher) continue;
    if (typeof work.publisher === 'string') {
      if (!publishers[work.publisher]) {
        const fallback = titleCaseKey(work.publisher);
        publishers[work.publisher] = { zh: fallback, ja: fallback, en: fallback };
      }
      continue;
    }

    if (typeof work.publisher === 'object') {
      const key = publisherKeyFromName(work.publisher.en ?? work.publisher.ja ?? work.publisher.zh);
      if (!key) continue;
      publishers[key] = {
        zh: zhTw(work.publisher.zh ?? work.publisher.en ?? key),
        ja: work.publisher.ja ?? work.publisher.en ?? key,
        en: work.publisher.en ?? work.publisher.ja ?? key,
      };
    }
  }
  return publishers;
}

function normalizePublisher(work, publishers) {
  if (!work.publisher) return null;
  if (typeof work.publisher === 'string') return work.publisher;

  const key = publisherKeyFromName(work.publisher.en ?? work.publisher.ja ?? work.publisher.zh);
  if (key && !publishers[key]) {
    publishers[key] = {
      zh: zhTw(work.publisher.zh ?? work.publisher.en ?? key),
      ja: work.publisher.ja ?? work.publisher.en ?? key,
      en: work.publisher.en ?? work.publisher.ja ?? key,
    };
  }
  return key || null;
}

function normalizeWork(work, form, usedKeys, publishers, index) {
  const title = localeObject(work.title ? work.title : work, 'title');
  const creator = localeObject(work.creator ? work.creator : work, 'creator');
  const oldLink = typeof work.link === 'string' && work.link.trim() ? work.link.trim() : null;
  const baseKey =
    work.key ??
    oldLink ??
    workKeyFromTitle(title.en) ??
    workKeyFromTitle(title.ja) ??
    workKeyFromTitle(title.zh) ??
    `${form}-${index + 1}`;
  let key = baseKey;
  let suffix = 2;
  while (usedKeys.has(key)) {
    key = `${baseKey}-${suffix}`;
    suffix += 1;
  }
  usedKeys.add(key);

  return {
    key,
    title,
    creator,
    form: work.form ?? form,
    genres: work.genres ?? work.genre ?? [],
    publisher: normalizePublisher(work, publishers),
    release_dates: work.release_dates ?? [],
    my_completed_date: work.my_completed_date ?? null,
    my_status: work.my_status ?? 'completed',
    my_score: normalizeScore(work.my_score),
    note: work.note ?? null,
    has_article: normalizeBoolean(work.has_article) || Boolean(oldLink),
    data_review: {
      title_zh: work.data_review?.title_zh ?? 'pending',
    },
  };
}

function isMigratedCollection(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (work) =>
        work &&
        typeof work === 'object' &&
        typeof work.key === 'string' &&
        work.title &&
        typeof work.title === 'object' &&
        !Object.prototype.hasOwnProperty.call(work, 'title_zh') &&
        !Object.prototype.hasOwnProperty.call(work, 'anilist_id')
    )
  );
}

async function migrate() {
  const collections = {};
  for (const form of WORK_FORMS) {
    const relativePath = `data/database/${form}.json`;
    const current = await readJson(path.join(ROOT, relativePath), []);
    const indexed = await readIndexedJson(relativePath).catch(() => null);
    collections[form] = isMigratedCollection(current)
      ? current
      : Array.isArray(indexed)
      ? indexed
      : current;

    for (let index = 0; index < collections[form].length; index += 1) {
      const currentScore = current[index]?.my_score;
      if (SCORE_VALUES.has(currentScore)) collections[form][index].my_score = currentScore;
      if (current[index]?.note) collections[form][index].note = current[index].note;
      if (typeof current[index]?.has_article === 'boolean') {
        collections[form][index].has_article = current[index].has_article;
      }
    }
  }
  const publishers = {
    ...(await loadPublishers()),
    ...collectPublisherLabels(collections),
  };
  const migrated = {};

  for (const form of WORK_FORMS) {
    const usedKeys = new Set();
    migrated[form] = (collections[form] ?? []).map((work, index) =>
      normalizeWork(work, form, usedKeys, publishers, index)
    );
  }

  await writeWorks(migrated);
  await writeJson(path.join(DATABASE_DIR, 'publishers.json'), sortedObject(publishers));
  console.log('Migrated database files and extracted publishers.json.');
}

function validateDate(value, field, context, errors) {
  if (value === null || value === undefined) return;
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    errors.push(`${context}: ${field} must be null or YYYY/MM.`);
  }
}

async function validate({ silent = false } = {}) {
  const collections = await loadWorks();
  const maps = await loadMaps();
  const publishers = await loadPublishers();
  const errors = [];
  const warnings = [];

  for (const form of WORK_FORMS) {
    const seenKeys = new Set();
    const works = collections[form] ?? [];
    if (!Array.isArray(works)) {
      errors.push(`${form}.json must contain an array.`);
      continue;
    }

    works.forEach((work, index) => {
      const context = `${form}[${index}]${work.key ? ` (${work.key})` : ''}`;
      for (const oldKey of [
        'id',
        'anilist_id',
        'title_zh',
        'title_ja',
        'title_en',
        'creator_zh',
        'creator_ja',
        'creator_en',
        'genre',
        'link',
      ]) {
        if (Object.prototype.hasOwnProperty.call(work, oldKey)) {
          errors.push(`${context}: old field "${oldKey}" should be migrated.`);
        }
      }

      if (!work.key || typeof work.key !== 'string') {
        errors.push(`${context}: key is required.`);
      } else if (seenKeys.has(work.key)) {
        errors.push(`${context}: duplicate key "${work.key}" within ${form}.`);
      } else {
        seenKeys.add(work.key);
      }

      if (!work.title || typeof work.title !== 'object') {
        errors.push(`${context}: title object is required.`);
      }
      if (!work.title?.zh) warnings.push(`${context}: title.zh is empty and should be reviewed.`);
      if (!work.title?.ja && !work.title?.en) {
        errors.push(`${context}: at least one of title.ja/title.en is required.`);
      }
      if (!work.creator || typeof work.creator !== 'object') {
        errors.push(`${context}: creator object is required.`);
      }
      if (work.form !== form) errors.push(`${context}: form must be "${form}".`);
      if (!Array.isArray(work.genres)) errors.push(`${context}: genres must be an array.`);
      for (const genre of work.genres ?? []) {
        if (!maps.genre?.[genre]) errors.push(`${context}: unknown genre "${genre}".`);
      }
      if (work.publisher !== null && work.publisher !== undefined && !publishers[work.publisher]) {
        errors.push(`${context}: unknown publisher "${work.publisher}".`);
      }
      if (!maps.status?.[work.my_status])
        errors.push(`${context}: unknown my_status "${work.my_status}".`);
      if (work.my_score !== null && !SCORE_VALUES.has(work.my_score)) {
        errors.push(`${context}: my_score must be null, 1, 2, 3, or 5.`);
      }
      if (typeof work.has_article !== 'boolean')
        errors.push(`${context}: has_article must be boolean.`);
      if (typeof work.note !== 'string' && work.note !== null) {
        errors.push(`${context}: note must be null or a string.`);
      }
      if (!REVIEW_STATUSES.has(work.data_review?.title_zh)) {
        errors.push(`${context}: data_review.title_zh must be pending, approved, or needs_fix.`);
      }
      for (const date of work.release_dates ?? [])
        validateDate(date, 'release_dates[]', context, errors);
      validateDate(work.my_completed_date, 'my_completed_date', context, errors);
      if (work.has_article) {
        warnings.push(
          `${context}: has_article=true expects ${existingArticlePath(form, work.key)}.`
        );
      }
    });
  }

  if (!silent) {
    for (const error of errors) console.error(`ERROR ${error}`);
    if (flags.verbose) {
      for (const warning of warnings) console.warn(`WARN ${warning}`);
    } else if (warnings.length) {
      console.warn(
        `WARN ${warnings.length} item(s) need attention. Run with --verbose to list them.`
      );
    }
    console.log(
      errors.length ? `Validation failed with ${errors.length} error(s).` : 'Validation passed.'
    );
  }

  return { errors, warnings };
}

async function review() {
  const options = {
    form: matchForm(flags.form),
    status: flags.status,
  };
  const collections = await loadWorks();
  const rl = readline.createInterface({ input, output });
  let shouldQuit = false;

  try {
    for (const form of WORK_FORMS) {
      if (shouldQuit) break;
      for (const work of collections[form] ?? []) {
        if (shouldQuit) break;
        if (!matchesReviewFilters(work, form, options)) continue;

        console.log(`\n${summarizeWork(work, form)}\nnote: ${work.note ?? 'null'}`);
        const scoreAnswer = (
          await rl.question('Score? [1 / 2 / 3 / 5 / s skip / q quit]: ')
        ).trim();
        if (scoreAnswer === 'q') {
          await writeWorks(collections);
          shouldQuit = true;
          break;
        }
        if (scoreAnswer === 's' || scoreAnswer === '') continue;

        const nextScore = Number(scoreAnswer);
        if (!SCORE_VALUES.has(nextScore)) {
          console.log('Skipped invalid score. Valid scores are 1, 2, 3, 5.');
          continue;
        }
        work.my_score = nextScore;

        const noteAnswer = await rl.question('Note? [text / s skip / x clear / q quit]: ');
        if (noteAnswer === 'q') {
          await writeWorks(collections);
          shouldQuit = true;
          break;
        }
        if (noteAnswer !== 's' && noteAnswer !== '') {
          work.note = noteAnswer === 'x' ? null : noteAnswer;
        }

        await writeWorks(collections);
      }
    }
  } finally {
    rl.close();
  }
}

async function find() {
  const rawQuery = flags._.join(' ').trim();
  const query = rawQuery.toLowerCase();
  const traditionalQuery = zhTw(rawQuery).toLowerCase();
  if (!query) throw new Error('Usage: pnpm database find <query>');
  const collections = await loadWorks();
  for (const { form, work } of flattenWorks(collections)) {
    const haystack = [
      work.key,
      work.title?.zh,
      work.title?.ja,
      work.title?.en,
      work.creator?.zh,
      work.creator?.ja,
      work.creator?.en,
      work.note,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (haystack.includes(query) || haystack.includes(traditionalQuery)) {
      console.log(`${form}\t${work.key}\t${work.title?.zh ?? ''}\t${work.title?.en ?? ''}`);
    }
  }
}

async function edit() {
  const [formArg, key] = flags._;
  const form = matchForm(formArg);
  if (!form || !key)
    throw new Error('Usage: pnpm database edit <form> <key> [--score 3] [--note "..."]');
  const collections = await loadWorks();
  const found = findWork(collections, form, key);
  if (!found) throw new Error(`Could not find ${form}/${key}.`);
  const { work } = found;

  if (flags.score !== undefined) {
    if (flags.score === 'null' || flags.score === 'x') {
      work.my_score = null;
    } else {
      const score = Number(flags.score);
      if (!SCORE_VALUES.has(score)) throw new Error('score must be null, 1, 2, 3, or 5.');
      work.my_score = score;
    }
  }
  if (flags.note !== undefined) work.note = flags.note === 'null' ? null : String(flags.note);
  if (flags.hasArticle !== undefined)
    work.has_article = flags.hasArticle === true || flags.hasArticle === 'true';
  if (flags.status !== undefined) work.my_status = flags.status;
  if (flags.completed !== undefined)
    work.my_completed_date = flags.completed === 'null' ? null : flags.completed;
  if (flags.titleZh !== undefined) {
    work.title.zh = zhTw(String(flags.titleZh));
    work.data_review = { ...(work.data_review ?? {}), title_zh: 'approved' };
  }

  await writeWorks(collections);
  console.log(`Updated ${form}/${key}.`);
}

async function add() {
  const form = matchForm(flags._[0]);
  if (!form) throw new Error('Usage: pnpm database add <form>');

  const collections = await loadWorks();
  const maps = await loadMaps();
  const publishers = await loadPublishers();
  const rl = readline.createInterface({ input, output });

  try {
    const titleEn = await ask(rl, 'title.en', flags.titleEn ?? null);
    const titleJa = await ask(rl, 'title.ja', flags.titleJa ?? null);
    const titleZhRaw = await ask(rl, 'title.zh', flags.titleZh ?? null);
    const keyDefault = uniqueWorkKey(
      collections,
      flags.key ?? titleEn ?? titleJa ?? titleZhRaw,
      form
    );
    const key = workKeyFromTitle(await ask(rl, 'key', keyDefault));
    if (flattenWorks(collections).some(({ work }) => work.key === key)) {
      throw new Error(`key "${key}" already exists.`);
    }

    const creatorZhRaw = await ask(rl, 'creator.zh', flags.creatorZh ?? null);
    const creatorJa = await ask(rl, 'creator.ja', flags.creatorJa ?? null);
    const creatorEn = await ask(rl, 'creator.en', flags.creatorEn ?? null);
    const genreHint = Object.keys(maps.genre ?? {}).join(', ');
    const genres = parseGenreList(
      await ask(rl, `genres comma-separated [${genreHint}]`, flags.genres ?? null)
    );
    const unknownGenres = genres.filter((genre) => !maps.genre?.[genre]);
    if (unknownGenres.length) throw new Error(`Unknown genre(s): ${unknownGenres.join(', ')}`);

    let publisher = await ask(rl, 'publisher key (empty for null)', flags.publisher ?? null);
    publisher = publisher || null;
    if (publisher && !publishers[publisher]) {
      const shouldAddPublisher = await confirm(
        rl,
        `Publisher "${publisher}" does not exist. Add it`,
        Boolean(flags.addPublisher)
      );
      if (!shouldAddPublisher) throw new Error(`Unknown publisher "${publisher}".`);
      publishers[publisher] = {
        zh: zhTw(
          (await ask(rl, 'publisher.zh', titleCaseKey(publisher))) ?? titleCaseKey(publisher)
        ),
        ja: (await ask(rl, 'publisher.ja', titleCaseKey(publisher))) ?? titleCaseKey(publisher),
        en: (await ask(rl, 'publisher.en', titleCaseKey(publisher))) ?? titleCaseKey(publisher),
      };
      await writeJson(path.join(DATABASE_DIR, 'publishers.json'), sortedObject(publishers));
    }

    const releaseDates = parseDateList(
      await ask(rl, 'release_dates comma-separated', flags.releaseDates ?? null)
    );
    const score = parseScoreInput(await ask(rl, 'my_score [null/1/2/3/5]', flags.score ?? null));
    const titleReviewed = await confirm(rl, 'Approve title.zh now', Boolean(flags.approveTitle));
    const work = {
      key,
      title: {
        zh: zhTw(titleZhRaw),
        ja: titleJa,
        en: titleEn,
      },
      creator: {
        zh: zhTw(creatorZhRaw),
        ja: creatorJa,
        en: creatorEn,
      },
      form,
      genres,
      publisher,
      release_dates: releaseDates,
      my_completed_date: parseNullable(await ask(rl, 'my_completed_date', flags.completed ?? null)),
      my_status: (await ask(rl, 'my_status', flags.status ?? 'completed')) ?? 'completed',
      my_score: score,
      note: parseNullable(await ask(rl, 'note', flags.note ?? null)),
      has_article: parseBooleanInput(await ask(rl, 'has_article', flags.hasArticle ?? false)),
      data_review: {
        title_zh: titleReviewed ? 'approved' : 'pending',
      },
    };

    collections[form].unshift(work);
    await writeWorks(collections);
    const result = await validate({ silent: true });
    if (result.errors.length) {
      throw new Error(
        `Added ${form}/${key}, but validation found ${result.errors.length} error(s).`
      );
    }
    console.log(`Added ${form}/${key}.`);
  } finally {
    rl.close();
  }
}

async function deleteWork() {
  const [formArg, key] = flags._;
  const form = matchForm(formArg);
  if (!form || !key) throw new Error('Usage: pnpm database delete <form> <key>');
  const collections = await loadWorks();
  const found = findWork(collections, form, key);
  if (!found) throw new Error(`Could not find ${form}/${key}.`);

  console.log(`\n${summarizeWork(found.work, form)}`);
  const rl = readline.createInterface({ input, output });
  try {
    const answer = await rl.question('Type DELETE to confirm: ');
    if (answer !== 'DELETE') {
      console.log('Delete cancelled.');
      return;
    }
  } finally {
    rl.close();
  }

  found.items.splice(found.index, 1);
  await writeWorks(collections);
  console.log(`Deleted ${form}/${key}.`);
}

async function note() {
  const options = {
    form: matchForm(flags.form),
    all: Boolean(flags.all),
  };
  const collections = await loadWorks();
  const rl = readline.createInterface({ input, output });
  let shouldQuit = false;

  try {
    for (const form of WORK_FORMS) {
      if (shouldQuit) break;
      if (options.form && options.form !== form) continue;
      for (const work of collections[form] ?? []) {
        if (shouldQuit) break;
        if (!options.all && work.note) continue;
        console.log(`\n${summarizeWork(work, form)}\nnote: ${work.note ?? 'null'}`);
        const answer = await rl.question('Note? [text / s skip / x clear / q quit]: ');
        if (answer === 'q') {
          shouldQuit = true;
          await writeWorks(collections);
          break;
        }
        if (answer === 's' || answer === '') {
          continue;
        }
        work.note = answer === 'x' ? null : answer;
        await writeWorks(collections);
      }
    }
  } finally {
    rl.close();
  }
}

async function main() {
  if (command === 'migrate') return migrate();
  if (command === 'validate') {
    const result = await validate();
    if (result.errors.length) process.exitCode = 1;
    return;
  }
  if (command === 'review') return review();
  if (command === 'find') return find();
  if (command === 'edit') return edit();
  if (command === 'add') return add();
  if (command === 'delete') return deleteWork();
  if (command === 'note') return note();

  console.log(`Usage:
  pnpm database migrate
  pnpm database validate
  pnpm database review [--form anime] [--status completed]
  pnpm database find <query>
  pnpm database edit <form> <key> [--score 1|2|3|5|null] [--note "..."] [--has-article true] [--title-zh "..."]
  pnpm database add <form>
  pnpm database delete <form> <key>
  pnpm database note [--form anime] [--all]`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
