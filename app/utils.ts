import ENV from "spodcat/config/environment";

export class NotFoundError extends Error {}

export function coerceBetween(value: number, min: number, max: number) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export function elementIsChildOf(element: HTMLElement, other: HTMLElement) {
    let parent: HTMLElement | null = element;

    while (parent != null) {
        if (parent == other) return true;
        parent = parent?.parentElement;
    }
    return false;
}

export function getRandomEntry<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)] as T;
}

export function makeAbsoluteUrl(url: string): string {
    const conditionalSlash = url.startsWith("/") ? "" : "/";

    if (url.match(/^https?:\/\/.*/)) return url;
    return ENV.APP.FRONTEND_HOST + conditionalSlash + url;
}

export function ping(...urlParts: string[]) {
    navigator.sendBeacon(urljoin(ENV.APP.BACKEND_HOST, ENV.APP.API_URL_NAMESPACE, ...urlParts, "ping"));
}

export function timeFromString(time: string): number | null {
    if (!time.match(/^(?:\d{1,2}:)?(?:\d{1,2}:)?\d{1,2}$/)) return null;

    const parts = time.split(":");
    let seconds = 0;

    parts.forEach((part, idx) => {
        const partInt = parseInt(part);

        if (!isNaN(partInt)) {
            if (parts.length - idx == 3) seconds += partInt * 60 * 60;
            else if (parts.length - idx == 2) seconds += partInt * 60;
            else if (parts.length - idx == 1) seconds += partInt;
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

export function trimString(s: string, maxLen: number) {
    if (s.length <= maxLen) return s;

    const words = s.match(/(\s+\S+)|(^\S+)/g) || [];
    let result = "";

    for (const word of words) {
        if (result.length + word.length > maxLen - 2) break;
        result += word;
    }
    return result + " …";
}

export function urljoin(...parts: string[]) {
    let url = "";

    for (let part of parts) {
        while (part.startsWith("/")) part = part.substring(1);
        if (part) {
            url += part;
            if (!url.endsWith("/")) url += "/";
        }
    }

    return url;
}
