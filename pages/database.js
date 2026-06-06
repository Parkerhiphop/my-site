import { Fragment, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';
import anime from '@/data/database/anime.json';
import film from '@/data/database/film.json';
import manga from '@/data/database/manga.json';
import maps from '@/data/database/maps.json';
import databaseMetadata from '@/data/database/metadata.json';
import novel from '@/data/database/novel.json';
import publishers from '@/data/database/publishers.json';
import series from '@/data/database/series.json';

const workCollections = { anime, film, manga, novel, series };

const works = Object.entries(workCollections)
  .flatMap(([form, items]) =>
    items.map((work, index) => ({
      ...work,
      form,
      databaseId: `${form}-${work.key ?? 'untitled'}-${index}`,
    }))
  )
  .sort((a, b) => {
    const dateA = a.release_dates?.[0] ?? '';
    const dateB = b.release_dates?.[0] ?? '';
    return dateB.localeCompare(dateA);
  });

const forms = ['anime', 'film', 'manga', 'novel', 'series'];
const progressFilters = ['completed', 'ongoing', 'on_hold', 'dropped'];
const scoreFilters = ['5', '3', '2', '1', 'unrated'];
const formTone = {
  anime: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-900',
  film: 'bg-rose-100 text-rose-800 dark:bg-rose-200 dark:text-rose-900',
  manga: 'bg-amber-100 text-amber-900 dark:bg-amber-200 dark:text-amber-950',
  novel: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-200 dark:text-emerald-950',
  series: 'bg-sky-100 text-sky-800 dark:bg-sky-200 dark:text-sky-950',
};
const statusDotTone = {
  completed: 'bg-emerald-500',
  ongoing: 'bg-orange-400',
  on_hold: 'bg-gray-400',
  dropped: 'bg-red-500',
};
const initialFilters = {
  form: [],
  status: [],
  score: [],
  genre: [],
  releaseFrom: '',
  releaseTo: '',
  completedFrom: '',
  completedTo: '',
  search: '',
};
const uiText = {
  'zh-TW': {
    all: '全部',
    any: '不限',
    blank: '—',
    search: '搜尋作品',
    searchFields: '搜尋：名稱、創作者、出版／製作、形式、簡評',
    empty: '沒有符合條件的作品',
    sort: '排序',
    watchingNow: '正在看',
    ascending: '升冪',
    descending: '降冪',
    briefReview: '簡評',
    alsoWatched: '也有看',
    filterToggle: '篩選',
    clearSelection: '清除選取',
    clearSearch: '清除搜尋',
    itemCount: '目前收錄 {total} 筆資料',
    filteredItemCount: '顯示 {shown} / {total} 筆',
    lastUpdated: '最後更新 {date}',
    upcomingRelease: '預定',
    rangeStart: '起',
    rangeEnd: '迄',
    filters: {
      status: '進度',
      score: '評分',
      completedDate: '閱畢',
      genre: '類型',
      releaseRange: '發行/公開',
      completedRange: '閱畢',
    },
    columns: {
      title: '名稱',
      form: '形式',
      genre: '類型',
      creator: '創作者',
      publisher: '出版／製作',
      score: '評分',
      release: '發行/公開',
      completedDate: '閱畢',
      status: '進度',
      sortRelease: '發行/公開日',
      sortCompleted: '閱畢日',
    },
  },
  en: {
    all: 'All',
    any: 'Any',
    blank: '—',
    search: 'Search works',
    searchFields: 'Search: title, creator, publisher / studio, form, brief review',
    empty: 'No matching works',
    sort: 'Sort',
    watchingNow: 'Watching',
    ascending: 'Ascending',
    descending: 'Descending',
    briefReview: 'Brief review',
    alsoWatched: 'Also watched',
    filterToggle: 'Filters',
    clearSelection: 'Clear selection',
    clearSearch: 'Clear search',
    itemCount: '{total} entries collected',
    filteredItemCount: 'Showing {shown} / {total}',
    lastUpdated: 'Last updated {date}',
    upcomingRelease: 'Upcoming',
    rangeStart: 'From',
    rangeEnd: 'To',
    filters: {
      status: 'Progress',
      score: 'Score',
      completedDate: 'Completed',
      genre: 'Genre',
      releaseRange: 'Release',
      completedRange: 'Completed',
    },
    columns: {
      title: 'Title',
      form: 'Form',
      genre: 'Genre',
      creator: 'Creator',
      publisher: 'Publisher / Studio',
      score: 'Score',
      release: 'Release',
      completedDate: 'Completed',
      status: 'Progress',
      sortRelease: 'Release Time',
      sortCompleted: 'Completed Time',
    },
  },
  ja: {
    all: 'すべて',
    any: 'すべて',
    blank: '—',
    search: '作品を検索',
    searchFields: '検索：名称、作者、出版／制作、形式、短評',
    empty: '一致する作品はありません',
    sort: '並び替え',
    watchingNow: '視聴中',
    ascending: '昇順',
    descending: '降順',
    briefReview: '短評',
    alsoWatched: 'ほかに見たもの',
    filterToggle: '絞り込み',
    clearSelection: '選択を解除',
    clearSearch: '検索をクリア',
    itemCount: '現在 {total} 件収録',
    filteredItemCount: '{shown} / {total} 件を表示',
    lastUpdated: '最終更新 {date}',
    upcomingRelease: '予定',
    rangeStart: '開始',
    rangeEnd: '終了',
    filters: {
      status: '進捗',
      score: '評価',
      completedDate: '読了',
      genre: 'ジャンル',
      releaseRange: '発行/公開',
      completedRange: '読了',
    },
    columns: {
      title: '名称',
      form: '形式',
      genre: 'ジャンル',
      creator: '作者',
      publisher: '出版／制作',
      score: '評価',
      release: '発行/公開',
      completedDate: '読了',
      status: '進捗',
      sortRelease: '発行/公開日',
      sortCompleted: '読了日',
    },
  },
};

const localeKeyMap = {
  'zh-TW': 'zh',
  en: 'en',
  ja: 'ja',
};

function localeKey(locale) {
  return localeKeyMap[locale] ?? 'zh';
}

function localizedField(work, field, locale) {
  if (work[field] && typeof work[field] === 'object') {
    return work[field][localeKey(locale)] ?? null;
  }
  return work[`${field}_${localeKey(locale)}`] ?? null;
}

function mapLabel(group, value, locale) {
  if (!value) return null;
  if (typeof value === 'object') return value[localeKey(locale)] ?? null;
  if (group === 'publisher') return publishers[value]?.[localeKey(locale)] ?? null;
  return maps[group]?.[value]?.[localeKey(locale)] ?? null;
}

function workGenres(work) {
  return work.genres ?? work.genre ?? [];
}

function display(value, text) {
  return value === null || value === undefined || value === '' ? text.blank : value;
}

function formatCount(template, values) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replace(`{${key}}`, value.toLocaleString()),
    template
  );
}

function sortableMonth(value) {
  if (!value) return null;
  const [year, month = '00'] = value.split('/');
  return Number(`${year}${month.padStart(2, '0')}`);
}

function dateYear(value) {
  return value?.split('/')?.[0] ?? null;
}

function sortableYear(value) {
  const year = dateYear(value);
  return year ? Number(year) : null;
}

function formatYearDate(value, text) {
  return display(dateYear(value), text);
}

function formatYearList(values, text) {
  const years = [...new Set((values ?? []).map(dateYear).filter(Boolean))];
  return display(years.join(', '), text);
}

function currentMonth() {
  const today = new Date();
  return Number(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`);
}

function latestReleaseDate(work) {
  return work.release_dates?.at(-1) ?? null;
}

function futureReleaseDates(work) {
  const now = currentMonth();
  return (work.release_dates ?? []).filter((date) => {
    const month = sortableMonth(date);
    return month !== null && month > now;
  });
}

function nextReleaseDate(work) {
  return futureReleaseDates(work).sort((a, b) => sortableMonth(a) - sortableMonth(b))[0] ?? null;
}

function inRange(value, from, to) {
  if (!from && !to) return true;
  const current = sortableYear(value);
  if (!current) return false;
  const min = from ? sortableYear(from) : null;
  const max = to ? sortableYear(to) : null;
  return (min === null || current >= min) && (max === null || current <= max);
}

function anyDateInRange(values, from, to) {
  if (!from && !to) return true;
  return values.some((value) => inRange(value, from, to));
}

function dateOptions(values) {
  return [...new Set(values.map(dateYear).filter(Boolean))].sort((a, b) => Number(a) - Number(b));
}

function rangeEndOptions(options, fromValue) {
  if (!fromValue) return options;
  return options.filter((option) => Number(option) >= Number(fromValue));
}

function compareNullable(a, b, direction) {
  const isBlankA = a === null || a === undefined;
  const isBlankB = b === null || b === undefined;
  if (isBlankA && isBlankB) return 0;
  if (isBlankA) return 1;
  if (isBlankB) return -1;
  return direction === 'asc' ? a - b : b - a;
}

function parseStatusQuery(statusQuery) {
  const statusValue = Array.isArray(statusQuery) ? statusQuery.join(',') : statusQuery;
  if (!statusValue) return [];
  return statusValue
    .split(',')
    .map((status) => status.trim())
    .filter((status) => progressFilters.includes(status));
}

function equalArray(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function reviewHref(work) {
  if (!work.has_article && !work.link) return null;
  if (work.link) return work.link;
  return `/review/${work.key ?? work.link}`;
}

function scoreKey(score) {
  const normalizedScore = Number(score);
  return ['5', '3', '2', '1'].includes(String(normalizedScore))
    ? String(normalizedScore)
    : 'unrated';
}

function compactScoreLabel(locale) {
  const scoreLabels = {
    'zh-TW': '神',
    ja: '神',
    en: 'GOAT',
  };

  return scoreLabels[locale] ?? scoreLabels.en;
}

function renderScore(score, locale, text) {
  const key = scoreKey(score);

  if (key === '5') {
    return (
      <span className="inline-flex rounded-full bg-amber-300 px-2.5 py-1 text-xs font-bold leading-none text-amber-950 shadow-sm shadow-amber-900/10">
        {compactScoreLabel(locale)}
      </span>
    );
  }

  if (['3', '2', '1'].includes(key)) {
    return (
      <span className="inline-flex tracking-[0.08em]" aria-label={mapLabel('score', key, locale)}>
        {Array.from({ length: Number(key) }).map((_, index) => (
          <span key={index} className="text-amber-400">
            ★
          </span>
        ))}
      </span>
    );
  }

  return text.blank;
}

export async function getStaticProps({ locale, locales }) {
  return { props: { locale, availableLocales: locales } };
}

export default function Works({ locale, availableLocales }) {
  const { t } = useTranslation();
  const router = useRouter();
  const text = uiText[locale] ?? uiText['zh-TW'];
  const [expandedId, setExpandedId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState({ key: 'release', direction: 'desc' });
  const [filters, setFilters] = useState(initialFilters);

  const genres = useMemo(() => Object.keys(maps.genre), []);
  const releaseDateOptions = useMemo(
    () => dateOptions(works.flatMap((work) => work.release_dates ?? [])),
    []
  );
  const completedDateOptions = useMemo(
    () => dateOptions(works.map((work) => work.my_completed_date)),
    []
  );
  const relatedFormsByKey = useMemo(() => {
    const relatedMap = new Map();
    for (const work of works) {
      if (!work.key) continue;
      if (!relatedMap.has(work.key)) relatedMap.set(work.key, new Set());
      relatedMap.get(work.key).add(work.form);
    }
    return relatedMap;
  }, []);
  const totalCount = works.length;
  const isWatchingNowActive = filters.status.length === 1 && filters.status[0] === 'ongoing';
  const activeFilterCount = [
    filters.form.length,
    filters.status.length,
    filters.score.length,
    filters.genre.length,
    filters.releaseFrom || filters.releaseTo ? 1 : 0,
    filters.completedFrom || filters.completedTo ? 1 : 0,
    filters.search.trim() ? 1 : 0,
  ].reduce((total, count) => total + count, 0);

  const filteredWorks = useMemo(() => {
    const filtered = works.filter((work) => {
      const title = localizedField(work, 'title', locale);
      const creator = localizedField(work, 'creator', locale);
      const searchableText = [
        title,
        creator,
        work.key,
        work.note,
        mapLabel('form', work.form, locale),
        mapLabel('publisher', work.publisher, locale),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = searchableText.includes(filters.search.trim().toLowerCase());
      const matchesForm = !filters.form.length || filters.form.includes(work.form);
      const matchesStatus = !filters.status.length || filters.status.includes(work.my_status);
      const matchesScore = !filters.score.length || filters.score.includes(scoreKey(work.my_score));
      const matchesGenre =
        !filters.genre.length || filters.genre.every((genre) => workGenres(work).includes(genre));
      const matchesReleaseRange = anyDateInRange(
        work.release_dates ?? [],
        filters.releaseFrom,
        filters.releaseTo
      );
      const matchesCompletedRange = inRange(
        work.my_completed_date,
        filters.completedFrom,
        filters.completedTo
      );

      return (
        matchesSearch &&
        matchesForm &&
        matchesStatus &&
        matchesScore &&
        matchesGenre &&
        matchesReleaseRange &&
        matchesCompletedRange
      );
    });

    return filtered.sort((a, b) => {
      if (sort.key === 'release') {
        return compareNullable(
          sortableMonth(latestReleaseDate(a)),
          sortableMonth(latestReleaseDate(b)),
          sort.direction
        );
      }
      if (sort.key === 'completed') {
        return compareNullable(
          sortableMonth(a.my_completed_date),
          sortableMonth(b.my_completed_date),
          sort.direction
        );
      }
      return 0;
    });
  }, [filters, locale, sort]);

  useEffect(() => {
    if (!router.isReady) return;
    const statusFromQuery = parseStatusQuery(router.query.status);
    setFilters((current) =>
      equalArray(current.status, statusFromQuery)
        ? current
        : { ...current, status: statusFromQuery }
    );
  }, [router.isReady, router.query.status]);

  function updateStatusQuery(statuses) {
    if (!router.isReady) return;

    const nextQuery = { ...router.query };
    if (statuses.length) {
      nextQuery.status = statuses.join(',');
    } else {
      delete nextQuery.status;
    }

    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
      scroll: false,
    });
  }

  function updateFilter(key, value) {
    setExpandedId(null);
    setFilters((current) => {
      const next = { ...current, [key]: value };
      if (key === 'releaseFrom' && next.releaseTo && Number(next.releaseTo) < Number(value)) {
        next.releaseTo = '';
      }
      if (key === 'completedFrom' && next.completedTo && Number(next.completedTo) < Number(value)) {
        next.completedTo = '';
      }
      return next;
    });
  }

  function toggleArrayFilter(key, value) {
    setExpandedId(null);
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((currentValue) => currentValue !== value)
        : [...current[key], value],
    }));
  }

  function updateStatusFilter(statuses) {
    setExpandedId(null);
    setFilters((current) => ({ ...current, status: statuses }));
    updateStatusQuery(statuses);
  }

  function clearFilterSelection() {
    setExpandedId(null);
    setFilters(initialFilters);
    updateStatusQuery([]);
  }

  function clearSearch() {
    setExpandedId(null);
    setFilters((current) => ({ ...current, search: '' }));
  }

  function toggleStatus(status) {
    updateStatusFilter(
      filters.status.includes(status)
        ? filters.status.filter((currentValue) => currentValue !== status)
        : [...filters.status, status]
    );
  }

  function toggleWatchingNow() {
    updateStatusFilter(isWatchingNowActive ? [] : ['ongoing']);
  }

  function toggleExpanded(rowId, isExpanded) {
    setExpandedId(isExpanded ? null : rowId);
  }

  function handleExpandableKeyDown(event, rowId, isExpanded) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleExpanded(rowId, isExpanded);
  }

  function updateSort(key) {
    setExpandedId(null);
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }));
  }

  function renderSortButton(key, label) {
    const isActive = sort.key === key;

    return (
      <button
        type="button"
        onClick={() => updateSort(key)}
        className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
          isActive
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-500 dark:border-gray-800 dark:text-gray-300'
        }`}
      >
        {label}
        <span className="ml-2 text-xs">{isActive && sort.direction === 'asc' ? '↑' : '↓'}</span>
      </button>
    );
  }

  function renderPillButton(option, isActive, onClick, activeTone = null) {
    const inactiveClass =
      'border-gray-300 bg-transparent text-gray-800 hover:border-primary-400 hover:text-primary-500 dark:border-gray-700 dark:text-gray-100';
    const activeClass = activeTone
      ? `${activeTone} border-transparent ring-1 ring-primary-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-950`
      : 'border-primary-500 bg-primary-500 text-white';

    return (
      <button
        key={option.value}
        type="button"
        onClick={onClick}
        aria-label={
          option.ariaLabel ?? (typeof option.label === 'string' ? option.label : undefined)
        }
        className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
          isActive ? activeClass : inactiveClass
        }`}
      >
        {option.label}
      </button>
    );
  }

  function renderDateRange(label, fromValue, fromKey, toValue, toKey, options) {
    return (
      <fieldset className="min-w-0 rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2 dark:border-gray-800 dark:bg-gray-900/40">
        <legend className="px-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          {label}
        </legend>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <label className="min-w-0">
            <span className="sr-only">{text.rangeStart}</span>
            <select
              value={fromValue}
              onChange={(event) => updateFilter(fromKey, event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-normal text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            >
              <option value="">{text.rangeStart}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <span className="text-gray-400">→</span>
          <label className="min-w-0">
            <span className="sr-only">{text.rangeEnd}</span>
            <select
              value={toValue}
              onChange={(event) => updateFilter(toKey, event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-normal text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            >
              <option value="">{text.rangeEnd}</option>
              {rangeEndOptions(options, fromValue).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>
    );
  }

  function renderChevron(isExpanded, className = 'h-7 w-7') {
    return (
      <span
        className={`flex ${className} shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition group-hover:border-primary-400 group-hover:text-primary-500 dark:border-gray-700 dark:text-gray-400 ${
          isExpanded ? 'border-primary-400 text-primary-500' : ''
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none">
          <path
            d={isExpanded ? 'M4.5 7.5 10 12.5l5.5-5' : 'M7.5 4.5 12.5 10l-5 5.5'}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </span>
    );
  }

  function renderFormBadge(work, form) {
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
          formTone[work.form] ?? 'bg-gray-100 text-gray-800'
        }`}
      >
        {display(form, text)}
      </span>
    );
  }

  function renderGenreTags(work) {
    const genres = workGenres(work);

    return genres.length ? (
      <div className="flex flex-wrap gap-1.5">
        {genres.map((genre) => (
          <span
            key={genre}
            className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300"
          >
            {display(mapLabel('genre', genre, locale), text)}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-gray-500 dark:text-gray-400">{text.blank}</span>
    );
  }

  function renderRelatedForms(work) {
    const relatedForms = [...(relatedFormsByKey.get(work.key) ?? [])].filter(
      (form) => form !== work.form
    );

    if (!relatedForms.length) return null;

    return (
      <div className="flex flex-wrap gap-1.5">
        {relatedForms.map((form) => (
          <span
            key={form}
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              formTone[form] ?? 'bg-gray-100 text-gray-800'
            }`}
          >
            {display(mapLabel('form', form, locale), text)}
          </span>
        ))}
      </div>
    );
  }

  function renderWorkTitle(title, href, className, style = undefined) {
    const label = display(title, text);

    if (!href) {
      return (
        <span className={`${className} text-gray-900 dark:text-gray-100`} style={style}>
          {label}
        </span>
      );
    }

    return (
      <Link
        href={href}
        className={`${className} text-primary-500 hover:text-primary-600`}
        style={style}
        onClick={(event) => event.stopPropagation()}
      >
        {label}
      </Link>
    );
  }

  function renderWorkDetails(work, publisher, status) {
    const upcomingDate = nextReleaseDate(work);
    const relatedForms = renderRelatedForms(work);

    return (
      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {[
          [text.columns.publisher, display(publisher, text)],
          ...(relatedForms ? [[text.alsoWatched, relatedForms]] : []),
          [
            text.columns.release,
            <span className="inline-flex flex-wrap items-center gap-2" key="release">
              <span>{formatYearList(work.release_dates, text)}</span>
              {upcomingDate && (
                <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
                  {text.upcomingRelease} {formatYearDate(upcomingDate, text)}
                </span>
              )}
            </span>,
          ],
          [
            text.columns.status,
            <span className="inline-flex items-center gap-2" key="status">
              <span
                className={`h-2 w-2 rounded-full ${statusDotTone[work.my_status] ?? 'bg-gray-400'}`}
              />
              {display(status, text)}
            </span>,
          ],
          [text.columns.completedDate, formatYearDate(work.my_completed_date, text)],
          [text.briefReview, display(work.note, text)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  function renderScoreHeader() {
    return (
      <span className="relative inline-flex items-center gap-1.5">
        {text.columns.score}
        <span className="group relative inline-flex">
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[11px] font-bold text-gray-500 transition hover:border-primary-400 hover:text-primary-500 focus:border-primary-400 focus:text-primary-500 focus:outline-none dark:border-gray-700 dark:text-gray-400"
            aria-label={`${text.columns.score} ${text.filterToggle}`}
          >
            ?
          </button>
          <span className="pointer-events-none absolute right-0 top-7 z-20 hidden w-56 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg group-hover:block group-focus-within:block dark:border-gray-800 dark:bg-gray-950">
            <span className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">
              {text.columns.score}
            </span>
            <span className="space-y-2">
              {scoreFilters.map((score) => (
                <span key={score} className="flex items-center justify-between gap-3">
                  <span className="text-gray-900 dark:text-gray-100">
                    {score === 'unrated' ? text.blank : renderScore(score, locale, text)}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {display(mapLabel('score', score, locale), text)}
                  </span>
                </span>
              ))}
            </span>
          </span>
        </span>
      </span>
    );
  }

  function renderScoreLegend() {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 dark:border-gray-800 dark:bg-gray-900/60">
        <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
          {text.columns.score}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          {scoreFilters.map((score) => (
            <span key={score} className="inline-flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {score === 'unrated' ? text.blank : renderScore(score, locale, text)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {display(mapLabel('score', score, locale), text)}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageSEO
        title={`${t('headerNavLinks:database')} - ${siteMetadata.author}`}
        description={t('headerNavLinks:database-description')}
        availableLocales={availableLocales}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-4 pb-8 md:pt-6">
          <h1>
            {siteMetadata.iconMap.database} {t('headerNavLinks:database')}
          </h1>
          <h2 className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {t('headerNavLinks:database-description')}
          </h2>
          <div
            className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-200"
            aria-live="polite"
          >
            <span>{formatCount(text.itemCount, { total: totalCount })}</span>
            <span className="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 sm:inline-block" />
            <span className="text-gray-500 dark:text-gray-400">
              {formatCount(text.filteredItemCount, {
                shown: filteredWorks.length,
                total: totalCount,
              })}
            </span>
            <span className="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 sm:inline-block" />
            <span className="text-gray-500 dark:text-gray-400">
              {formatCount(text.lastUpdated, { date: databaseMetadata.lastUpdated })}
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="group flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:border-primary-400 hover:text-primary-500 dark:border-gray-800 dark:text-gray-100"
              aria-expanded={filtersOpen}
            >
              <span>{text.filterToggle}</span>
              <span className="inline-flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
                {renderChevron(filtersOpen, 'h-6 w-6')}
              </span>
            </button>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilterSelection}
                className="shrink-0 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary-400 hover:text-primary-500 dark:border-gray-800 dark:text-gray-200"
              >
                {text.clearSelection}
              </button>
            )}
          </div>
          <div className={filtersOpen ? 'space-y-3' : 'hidden'}>
            <div className="-m-1 flex flex-wrap gap-2 p-1">
              {[
                { value: 'all', label: text.all },
                ...forms.map((form) => ({
                  value: form,
                  label: display(mapLabel('form', form, locale), text),
                })),
              ].map((option) =>
                renderPillButton(
                  option,
                  option.value === 'all'
                    ? !filters.form.length
                    : filters.form.includes(option.value),
                  () =>
                    option.value === 'all'
                      ? updateFilter('form', [])
                      : toggleArrayFilter('form', option.value),
                  option.value === 'all' ? null : formTone[option.value]
                )
              )}
            </div>
            <div className="-m-1 flex flex-wrap items-center gap-2 p-1">
              <span className="mr-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                {text.filters.status}
              </span>
              {[
                { value: 'all', label: text.any },
                ...progressFilters.map((status) => ({
                  value: status,
                  label: display(mapLabel('status', status, locale), text),
                })),
              ].map((option) =>
                renderPillButton(
                  option,
                  option.value === 'all'
                    ? !filters.status.length
                    : filters.status.includes(option.value),
                  () =>
                    option.value === 'all' ? updateStatusFilter([]) : toggleStatus(option.value)
                )
              )}
            </div>
            <div className="-m-1 flex flex-wrap items-center gap-2 p-1">
              <span className="mr-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                {text.filters.score}
              </span>
              {[
                { value: 'all', label: text.any },
                ...scoreFilters.map((score) => ({
                  value: score,
                  label: score === 'unrated' ? text.blank : renderScore(score, locale, text),
                  ariaLabel: display(mapLabel('score', score, locale), text),
                })),
              ].map((option) =>
                renderPillButton(
                  option,
                  option.value === 'all'
                    ? !filters.score.length
                    : filters.score.includes(option.value),
                  () =>
                    option.value === 'all'
                      ? updateFilter('score', [])
                      : toggleArrayFilter('score', option.value)
                )
              )}
            </div>
            <div className="-m-1 flex flex-wrap items-center gap-2 p-1">
              <span className="mr-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                {text.filters.genre}
              </span>
              {[
                { value: 'all', label: text.any },
                ...genres.map((genre) => ({
                  value: genre,
                  label: display(mapLabel('genre', genre, locale), text),
                })),
              ].map((option) =>
                renderPillButton(
                  option,
                  option.value === 'all'
                    ? !filters.genre.length
                    : filters.genre.includes(option.value),
                  () =>
                    option.value === 'all'
                      ? updateFilter('genre', [])
                      : toggleArrayFilter('genre', option.value)
                )
              )}
            </div>
          </div>
          <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {text.searchFields}
            <span className="relative">
              <input
                aria-label={text.search}
                type="text"
                value={filters.search}
                onChange={(event) => updateFilter('search', event.target.value)}
                placeholder={text.search}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm font-normal text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label={text.clearSearch}
                  className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-sm font-bold text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700 focus:outline-none dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus:bg-gray-800 dark:focus:text-gray-200"
                >
                  X
                </button>
              )}
            </span>
          </label>
          <div className={`${filtersOpen ? 'grid' : 'hidden'} gap-3 md:grid-cols-2 lg:grid-cols-4`}>
            <div className="md:col-span-2">
              {renderDateRange(
                text.filters.releaseRange,
                filters.releaseFrom,
                'releaseFrom',
                filters.releaseTo,
                'releaseTo',
                releaseDateOptions
              )}
            </div>
            <div className="md:col-span-2">
              {renderDateRange(
                text.filters.completedRange,
                filters.completedFrom,
                'completedFrom',
                filters.completedTo,
                'completedTo',
                completedDateOptions
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                {text.sort}
              </span>
              {renderSortButton('release', text.columns.sortRelease)}
              {renderSortButton('completed', text.columns.sortCompleted)}
            </div>
            <button
              type="button"
              onClick={toggleWatchingNow}
              className={`ml-auto inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                isWatchingNowActive
                  ? 'border-orange-400 bg-orange-400 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-500 dark:border-gray-800 dark:text-gray-300'
              }`}
              aria-pressed={isWatchingNowActive}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isWatchingNowActive ? 'bg-white' : 'bg-orange-400'
                }`}
              />
              {text.watchingNow}
            </button>
          </div>
        </div>
        <div className="py-6">
          <div className="space-y-3 md:hidden">
            {renderScoreLegend()}
            {filteredWorks.map((work) => {
              const rowId = work.databaseId;
              const isExpanded = expandedId === rowId;
              const title = localizedField(work, 'title', locale);
              const creator = localizedField(work, 'creator', locale);
              const form = mapLabel('form', work.form, locale);
              const publisher = mapLabel('publisher', work.publisher, locale);
              const status = mapLabel('status', work.my_status, locale);
              const href = reviewHref(work);

              return (
                <div
                  key={rowId}
                  className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleExpanded(rowId, isExpanded)}
                    onKeyDown={(event) => handleExpandableKeyDown(event, rowId, isExpanded)}
                    className="group w-full px-3 py-3 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-2">
                      {renderChevron(isExpanded)}
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          {renderWorkTitle(
                            title,
                            href,
                            'min-w-0 overflow-hidden text-base font-semibold leading-snug',
                            {
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }
                          )}
                          <span className="shrink-0 pt-0.5">
                            {renderScore(work.my_score, locale, text)}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {renderFormBadge(work, form)}
                          {renderGenreTags(work)}
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {display(creator, text)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-900/70">
                      {renderWorkDetails(work, publisher, status)}
                    </div>
                  )}
                </div>
              );
            })}
            {!filteredWorks.length && (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">{text.empty}</div>
            )}
          </div>
          <table className="hidden w-full table-fixed border-collapse text-left text-base md:table">
            <thead className="border-b border-gray-300 text-sm font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300">
              <tr>
                <th className="w-[29%] py-3 pr-3">{text.columns.title}</th>
                <th className="w-[13%] py-3 pr-3">{text.columns.form}</th>
                <th className="w-[28%] py-3 pr-3">{text.columns.genre}</th>
                <th className="w-[20%] py-3 pr-3">{text.columns.creator}</th>
                <th className="w-[10%] py-3">{renderScoreHeader()}</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorks.map((work) => {
                const rowId = work.databaseId;
                const isExpanded = expandedId === rowId;
                const title = localizedField(work, 'title', locale);
                const creator = localizedField(work, 'creator', locale);
                const form = mapLabel('form', work.form, locale);
                const publisher = mapLabel('publisher', work.publisher, locale);
                const status = mapLabel('status', work.my_status, locale);
                const href = reviewHref(work);

                return (
                  <Fragment key={rowId}>
                    <tr
                      onClick={() => toggleExpanded(rowId, isExpanded)}
                      className="group cursor-pointer border-b border-gray-200 align-top transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                    >
                      <td className="py-5 pr-3 font-semibold text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          {renderChevron(isExpanded)}
                          {renderWorkTitle(title, href, 'min-w-0 break-words')}
                        </div>
                      </td>
                      <td className="py-5 pr-3">{renderFormBadge(work, form)}</td>
                      <td className="py-5 pr-3">{renderGenreTags(work)}</td>
                      <td className="py-5 pr-3 text-gray-700 dark:text-gray-300">
                        {display(creator, text)}
                      </td>
                      <td className="py-5">{renderScore(work.my_score, locale, text)}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-gray-300 dark:border-gray-700">
                        <td colSpan={5} className="bg-gray-50 px-4 py-4 dark:bg-gray-900/70">
                          {renderWorkDetails(work, publisher, status)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {!filteredWorks.length && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 dark:text-gray-400">
                    {text.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
