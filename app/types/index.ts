export interface Image {
  url: string;
  width?: string | number;
  height?: string | number;
}

export interface Offsets {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface RelativePosition {
  x: RelativePositionX;
  y: RelativePositionY;
}

export type RelativePositionX = "left" | "right" | "center";

export type RelativePositionY = "top" | "bottom" | "center";
