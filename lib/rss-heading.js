// Keep the Markdown authoring annotation out of feed headings as well.
module.exports = function renderHeading({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const annotation = text.match(/\s+\{#([a-z0-9]+(?:-[a-z0-9]+)*)\}$/);
  const id = annotation ? ` id="${annotation[1]}"` : '';
  const title = annotation ? text.slice(0, annotation.index) : text;
  return `<h${depth}${id}>${title}</h${depth}>\n`;
};
