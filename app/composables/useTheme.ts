import type { Theme, ThemeColor, ThemedProps } from "~/types";

export default function useTheme(props: MaybeRefOrGetter<ThemedProps>) {
  function unrefProps(): ThemedProps {
    return toValue(props);
  }

  function ensureThemeObject(theme?: ThemeColor | Theme): Theme | undefined {
    if (typeof theme === "string") return { ...defaults.value, color: theme };
    if (theme !== undefined) return { ...defaults.value, ...theme };
    return undefined;
  }

  function themeToClasses(prefix: string, theme?: Theme): string[] {
    const classes = [];

    if (theme?.color) classes.push(`${prefix}-${theme.color}`);
    if (theme?.colorVariant) classes.push(`${prefix}-${theme.colorVariant}`);
    if (theme?.accentedOnActive) classes.push(`${prefix}-accented-on-active`);
    if (theme?.mutedOnDisabled) classes.push(`${prefix}-muted-on-disabled`);
    return classes;
  }

  const background = computed<Theme | undefined>(() => {
    const { background, transparent } = unrefProps();

    if (transparent || background === "none") return undefined;
    return ensureThemeObject(background ?? defaults.value);
  });

  const defaults = computed<Theme>(() => {
    const { colorVariant, accentedOnActive, mutedOnDisabled, color } = unrefProps();
    return { accentedOnActive, mutedOnDisabled, colorVariant, color };
  });

  const backgroundCssVars = computed(() => {
    const bg = background.value;

    if (bg?.color) {
      return {
        default: bg.colorVariant ? `var(--spod-${bg.color}-${bg.colorVariant})` : `var(--spod-${bg.color})`,
        accented:
          bg.colorVariant === "accented" ? `var(--spod-${bg.color}-accented-2)` : `var(--spod-${bg.color}-accented)`,
        muted: bg.colorVariant === "muted" ? `var(--spod-${bg.color}-muted-2)` : `var(--spod-${bg.color}-muted)`,
      };
    }
    return undefined;
  });

  const border = computed<Theme | undefined>(() => {
    const { border } = unrefProps();

    if (border === "none") return undefined;
    return ensureThemeObject(border ?? defaults.value);
  });

  const text = computed<Theme | undefined>(() => {
    const { text, transparent } = unrefProps();

    if (text === "none") return undefined;
    if (transparent) return ensureThemeObject(text ?? defaults.value);
    return ensureThemeObject(text);
  });

  const themeClasses = computed(() => [
    ...themeToClasses("bg", background.value),
    ...themeToClasses("border", border.value),
    ...themeToClasses("text", text.value),
  ]);

  return {
    // background,
    backgroundCssVars,
    // border,
    // text,
    themeClasses,
  };
}
