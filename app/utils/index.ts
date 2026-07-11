import type { MaybeRefOrGetterDeep } from "~/types";

export * from "./locale";
export { default as ping } from "./ping";
export * from "./time";

export function coerceBetween(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function extractImageUrlsFromMarkdown(description: string): string[] {
  return [...description.matchAll(/!\[.*?\]\((?<url>.*?)\)/g)].map((m) => m.groups!.url!);
}

export function modulo(n: number, d: number): number {
  // "%" in Javascript is a remainder operator, not modulo!
  // eslint-disable-next-line style/max-len
  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#description
  return ((n % d) + d) % d;
}

export function toValueDeep<T>(source: MaybeRefOrGetterDeep<T>): T {
  const entries = Object.entries(toValue(source)).map(([k, v]) => [k, isRef(v) ? toValue(v) : v]);
  return Object.fromEntries(entries);
}
