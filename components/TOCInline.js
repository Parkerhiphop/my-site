/**
 * @typedef TocHeading
 * @prop {string} value
 * @prop {number} depth
 * @prop {string} url
 */

/**
 * Generates an inline table of contents
 * Exclude titles matching this string (new RegExp('^(' + string + ')$', 'i')).
 * If an array is passed the array gets joined with a pipe (new RegExp('^(' + array.join('|') + ')$', 'i')).
 *
 * @param {{
 *  toc: TocHeading[],
 *  fromHeading?: number,
 *  toHeading?: number,
 *  asDisclosure?: boolean,
 *  exclude?: string|string[]
 * }} props
 *
 */
const TOCInline = ({
  toc,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
  title = '目錄',
}) => {
  const re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i');

  const filteredToc = toc.filter(
    (heading) =>
      heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
  );

  const hierarchy = {
    1: 'ml-0',
    2: 'ml-4',
    3: 'ml-8',
    4: 'ml-12',
    5: 'ml-16',
    6: 'ml-20',
  };

  if (!filteredToc.length) return <></>;

  return (
    <details
      open
      className="mb-10 rounded-lg border border-primary-100 bg-primary-50/60 px-4 py-3 text-left dark:border-primary-900/70 dark:bg-primary-950/20"
    >
      <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide text-primary-700 marker:text-primary-500 dark:text-primary-300">
        {title}
      </summary>
      <div className="mt-3 border-t border-primary-100 pt-3 dark:border-primary-900/70">
        <div className="mb-0 space-y-1 text-sm leading-7 text-primary-700 dark:text-primary-300 md:text-base">
          {filteredToc.map((heading) => (
            <div
              key={heading.value}
              className={`${
                hierarchy[heading.depth]
              } overflow-hidden text-ellipsis border-l border-primary-200 pl-3 dark:border-primary-800`}
            >
              <a
                className="no-underline hover:text-primary-900 dark:hover:text-primary-100"
                href={heading.url}
              >
                {heading.value}
              </a>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
};

export default TOCInline;
