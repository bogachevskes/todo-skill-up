import { THEME_LIST } from '@/shared/theme';

export const initializeThemePreference = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === null || savedTheme in THEME_LIST === false) {
    localStorage.setItem('theme', 'Морской бриз');
  }
};
