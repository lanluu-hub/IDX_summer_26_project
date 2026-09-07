export function formatDate(dateIsoStr) {
  const dateObj = new Date(dateIsoStr);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long", // "Saturday"
    year: "numeric", // "2026"
    month: "long", // "June"
    day: "numeric", // "20"
  }).format(dateObj);

  return formattedDate;
}
