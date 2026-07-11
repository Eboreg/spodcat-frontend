export function getLocaleDateString(date: Date | string, locale?: string | null): string {
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleDateString(locale ?? undefined, { dateStyle: "short" });
}

export function timeFromString(time: string): number | null {
  if (!/^(?:\d{1,2}:)?(?:\d{1,2}:)?\d{1,2}$/.test(time)) return null;

  const parts = time.split(":");
  let seconds = 0;

  parts.forEach((part, idx) => {
    const partInt = parseInt(part);

    if (!Number.isNaN(partInt)) {
      if (parts.length - idx === 3) seconds += partInt * 60 * 60;
      else if (parts.length - idx === 2) seconds += partInt * 60;
      else if (parts.length - idx === 1) seconds += partInt;
    }
  });

  return seconds;
}

export function timeToString(time: number): string {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor(time / 60 / 60);

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
