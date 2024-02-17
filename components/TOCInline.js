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

  const hierachy = {
    1: 'ml-0',
    2: 'ml-4',
    3: 'ml-8',
    4: 'ml-12',
    5: 'ml-16',
    6: 'ml-20',
  };

  const tocList = (
    <div className="mb-0 pb-5 leading-8">
      {filteredToc.map((heading) => (
        <div key={heading.value} className={`${hierachy[heading.depth]}`}>
          <a href={heading.url}>{heading.value}</a>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {asDisclosure ? (
        <details
          open
          className="prose my-8 px-1 py-1 rounded dark:prose-dark bg-gray-100 dark:bg-gray-800 cursor-pointer"
        >
          <summary className="ml-6 pt-2 pb-2 text-xl font-bold">Table of Contents</summary>
          <div className="ml-6">{tocList}</div>
        </details>
      ) : (
        tocList
      )}
    </>
  );
};

export default TOCInline;
