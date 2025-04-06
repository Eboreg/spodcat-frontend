import ENV from "podcast-frontend/config/environment";

export function timeString(time: number): string {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor((time / 60) % 60);
    const hours = Math.floor(time / 60 / 60);

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function elementIsChildOf(element: HTMLElement, other: HTMLElement) {
    let parent: HTMLElement | null = element;

    while (parent != null) {
        if (parent == other) return true;
        parent = parent?.parentElement;
    }
    return false;
}

export function coerceBetween(value: number, min: number, max: number) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export function makeAbsoluteUrl(url: string): string {
    const conditionalSlash = url.startsWith("/") ? "" : "/";

    if (url.match(/^https?:\/\/.*/)) return url;
    return ENV.APP.FRONTEND_HOST + conditionalSlash + url;
}

export function getRandomEntry<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)] as T;
}
