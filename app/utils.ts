declare global {
    interface HTMLElement {
        isChildOf(other: HTMLElement): boolean;
    }
}

export function timeString(time: number): string {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor((time / 60) % 60);
    const hours = Math.floor(time / 60 / 60);

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

HTMLElement.prototype.isChildOf = function (other: HTMLElement) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self: HTMLElement | null = this;

    while (self != null) {
        if (self == other) return true;
        self = self?.parentElement;
    }
    return false;
};

export function coerceBetween(value: number, min: number, max: number) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}
