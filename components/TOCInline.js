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
const TOCInline = ({ toc, fromHeading = 1, toHeading = 6, asDisclosure = false, exclude = '' }) => {
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
      className="sticky top-3 max-h-[300px] md:max-h-[500px] rounded overflow-auto scrollbar-hide px-1 py-1 my-8 dark:prose-dark bg-gray-100 dark:bg-gray-800 cursor-pointer"
    >
      <summary className="sticky top-0 m-0 pt-2 pb-2 pl-5 h-8 md:h-auto text-[1rem] leading-4 md:text-xl font-bold bg-gray-100 dark:bg-gray-800">
        目錄
      </summary>
      <div>
        <div className="mb-0 pb-5 text-base leading-8 text-primary-500">
          {filteredToc.map((heading) => (
            <div
              key={heading.value}
              className={`${
                hierarchy[heading.depth]
              } border-l-primary-500 border-l pl-2 my-2 overflow-hidden whitespace-nowrap text-ellipsis`}
            >
              <a href={heading.url}>{heading.value}</a>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
};

export default TOCInline;
