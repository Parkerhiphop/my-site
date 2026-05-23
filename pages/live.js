import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { PageSEO } from '@/components/SEO';
import liveEvents from '@/data/liveEvents';
import siteMetadata from '@/data/siteMetadata';

const copy = {
  'zh-TW': {
    title: '🎧 JPop 參戰紀錄',
    total: '總場次',
    years: '年份',
    japan: '日本',
    taiwan: '台灣',
    latest: '最近一場',
    emptyTitle: '還沒有紀錄',
    emptyDescription: '下一場 live 之後再回來補上。',
    country: {
      TW: 'Taiwan',
      JP: 'Japan',
    },
  },
  en: {
    title: '🎧 JPop Live Log',
    total: 'Shows',
    years: 'Years',
    japan: 'Japan',
    taiwan: 'Taiwan',
    latest: 'Latest',
    emptyTitle: 'No shows yet',
    emptyDescription: 'The next live night will go here.',
    country: {
      TW: 'Taiwan',
      JP: 'Japan',
    },
  },
  ja: {
    title: '🎧 JPop 参戦記録',
    total: '合計',
    years: '年数',
    japan: '日本',
    taiwan: '台湾',
    latest: '最新',
    emptyTitle: 'まだ記録がありません',
    emptyDescription: '次のライブのあとに追加します。',
    country: {
      TW: 'Taiwan',
      JP: 'Japan',
    },
  },
};

const venueTone = {
  TW: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300',
  JP: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300',
};

function eventTime(event) {
  return new Date(`${event.date}T00:00:00+09:00`).getTime();
}

function groupByYear(events) {
  return events
    .slice()
    .sort((a, b) => eventTime(b) - eventTime(a))
    .reduce((years, event) => {
      const year = event.date.slice(0, 4);
      if (!years[year]) years[year] = [];
      years[year].push(event);
      return years;
    }, {});
}

function formatDateRange(event) {
  const [, month, day] = event.date.split('-');
  return `${month}.${day}`;
}

function EventTitle({ event }) {
  return (
    <span>
      <span className="font-semibold text-gray-900 dark:text-gray-100">{event.artist}</span>
      {event.title && (
        <span className="text-gray-500 dark:text-gray-400">
          <span className="px-2 text-gray-300 dark:text-gray-600">/</span>
          {event.title}
        </span>
      )}
    </span>
  );
}

function venueLabel(event) {
  return event.venue ?? '';
}

export async function getStaticProps({ locales }) {
  return { props: { availableLocales: locales } };
}

export default function Live({ availableLocales }) {
  const { locale } = useRouter();
  const text = copy[locale] ?? copy['zh-TW'];

  const groupedEvents = useMemo(() => groupByYear(liveEvents), []);
  const years = Object.keys(groupedEvents).sort((a, b) => Number(b) - Number(a));
  const japanCount = liveEvents.filter((event) => event.country === 'JP').length;
  const taiwanCount = liveEvents.filter((event) => event.country === 'TW').length;
  const stats = [
    { label: text.total, value: liveEvents.length },
    { label: text.years, value: years.length },
    { label: text.taiwan, value: taiwanCount },
    { label: text.japan, value: japanCount },
  ];

  return (
    <>
      <PageSEO
        title={`${text.title} - ${siteMetadata.author}`}
        description={text.description}
        availableLocales={availableLocales}
      />
      <div className="space-y-12">
        <header className="border-b border-gray-200 pb-10 dark:border-gray-700 md:pt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
            {text.eyebrow}
          </p>
          <h1>{text.title}</h1>
          <dl className="mt-8 grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white px-4 py-5 dark:bg-gray-900">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {years.length ? (
          <div className="space-y-12">
            {years.map((year) => (
              <section key={year} className="grid gap-6 md:grid-cols-[7rem_minmax(0,1fr)]">
                <div>
                  <h2 className="sticky top-24 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {year}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {copy[locale].total} {groupedEvents[year].length}
                  </p>
                </div>
                <ol className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                  {groupedEvents[year].map((event, index) => (
                    <li
                      key={`${event.date}-${event.artist}-${index}`}
                      className="grid gap-3 py-4 sm:grid-cols-[4.5rem_minmax(0,1fr)_minmax(8rem,14rem)] sm:items-center"
                    >
                      <time
                        dateTime={event.date}
                        className="text-sm font-semibold tabular-nums text-gray-500 dark:text-gray-400"
                      >
                        {formatDateRange(event)}
                      </time>
                      <p className="min-w-0 text-lg leading-7">
                        <EventTitle event={event} />
                      </p>
                      {venueLabel(event) && (
                        <span
                          className={`w-fit max-w-full rounded-md border px-2.5 py-1 text-xs font-semibold leading-5 sm:justify-self-end ${
                            venueTone[event.country]
                          }`}
                        >
                          {venueLabel(event)}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {text.emptyTitle}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{text.emptyDescription}</p>
          </div>
        )}
      </div>
    </>
  );
}
