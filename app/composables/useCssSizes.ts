export type BorderRadiusSize = "0" | "sm" | "md" | "lg" | "xl" | "100";
export type BorderWidthSize = "0" | "xs" | "sm" | "md" | "lg";
export type FontSize = "xs" | "sm" | "md" | "lg";

export type CssSizeProps = {
  borderRadius?: BorderRadiusSize;
  borderWidth?: BorderWidthSize;
  fontSize?: FontSize;
};

export default function useCssSizes(props: MaybeRefOrGetter<CssSizeProps>) {
  const borderRadiusClass = computed(() => {
    const size = toValue(props).borderRadius;
    return size ? `border-radius-${size}` : undefined;
  });

  const borderWidthClass = computed(() => {
    const size = toValue(props).borderWidth;
    return size ? `border-${size}` : undefined;
  });

  const fontSizeClass = computed(() => {
    const size = toValue(props).fontSize;
    return size ? `font-size-${size}` : undefined;
  });

  const sizeClasses = computed(() => {
    const classes: string[] = [];
    const { borderRadius, borderWidth, fontSize } = toValue(props);

    if (borderRadius) classes.push(`border-radius-${borderRadius}`);
    if (borderWidth) classes.push(`border-${borderWidth}`);
    if (fontSize) classes.push(`font-size-${fontSize}`);

    return classes;
  });

  return { borderRadiusClass, borderWidthClass, fontSizeClass, sizeClasses };
}
