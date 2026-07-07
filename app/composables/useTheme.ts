import type { Theme, ThemeVariant } from "~/types";

interface Args {
  borderTheme?: MaybeRefOrGetter<Theme | undefined>;
  darkenOnDisabled?: MaybeRefOrGetter<boolean>;
  diagonalBg?: MaybeRefOrGetter<boolean>;
  lightenOnActive?: MaybeRefOrGetter<boolean>;
  lightenOnHover?: MaybeRefOrGetter<boolean>;
  textTheme?: MaybeRefOrGetter<Theme>;
  theme?: MaybeRefOrGetter<Theme>;
  themeVariant?: MaybeRefOrGetter<ThemeVariant>;
  transparent?: MaybeRefOrGetter<boolean>;
}

export default function useTheme(args: MaybeRefOrGetter<Args>) {
  const themeClasses = computed(() => {
    const {
      borderTheme,
      darkenOnDisabled,
      diagonalBg,
      lightenOnActive,
      lightenOnHover,
      textTheme,
      theme,
      themeVariant,
      transparent,
    } = toValue(args);
    const _theme = toValue(theme);
    const _borderTheme = toValue(borderTheme);
    const _textTheme = toValue(textTheme);

    if (!_theme && !_borderTheme && !_textTheme) return [];

    return [
      _theme ? `theme-${_theme}` : undefined,
      _borderTheme ? `border-${_borderTheme}` : undefined,
      _textTheme ? `text-${_textTheme}` : undefined,
      toValue(themeVariant),
      {
        transparent: toValue(transparent),
        "on-hover-lighten": toValue(lightenOnHover),
        "on-active-lighten": toValue(lightenOnActive),
        "on-disabled-darken": toValue(darkenOnDisabled),
        "diagonal-bg": toValue(diagonalBg),
      },
    ];
  });

  return { themeClasses };
}
