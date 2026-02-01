export const formatWIB = (isoString: string | null | undefined): string => {
  if (!isoString) return "-";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "Invalid Date";

  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formatted = formatter.format(date);

  return formatted.replace(":", ".") + " WIB";
};