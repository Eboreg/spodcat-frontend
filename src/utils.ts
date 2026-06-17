export const themes = ["primary", "secondary", "tertiary", "boring"] as const;

export type Theme = (typeof themes)[number];

export function coerceBetween(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function getCssValues(element: HTMLElement, key: string): string {
  const css = getComputedStyle(element);
  return `[${css.getPropertyValue(key)}, ${element.style.getPropertyValue(key)}]`;
}

export function getLocaleDateString(date: Date, locale?: string | null): string {
  if (locale !== undefined && locale !== null) return new Intl.DateTimeFormat(locale).format(date);
  return new Intl.DateTimeFormat().format(date);
}

export function getSeasonTheme(number: number): Theme {
  return themes[number % (themes.length - 1)]!;
}

export function makeAbsoluteUrl(url: string): string {
  if (url.match(/^https?:\/\/.*/)) return url;
  return new URL(url, import.meta.env.VITE_FRONTEND_HOST).toString();
}

export function timeFromString(time: string): number | null {
  if (!time.match(/^(?:\d{1,2}:)?(?:\d{1,2}:)?\d{1,2}$/)) return null;

  const parts = time.split(":");
  let seconds = 0;

  parts.forEach((part, idx) => {
    const partInt = parseInt(part);

    if (!isNaN(partInt)) {
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
