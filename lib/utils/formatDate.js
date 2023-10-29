const formatDate = (date, locale, hasYear = true) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (!hasYear) {
    delete options.year;
  }

  const now = new Date(date)
    .toLocaleDateString(locale, options)
    .split(' ') // needed to be congruent with en (uperCamelCase)
    .map((e) => e[0].toUpperCase() + e.substring(1))
    .join(' ');

  return now;
};

export default formatDate;
