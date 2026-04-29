import type { InjectionKey, Ref } from 'vue';

export type ThemeToken = Record<string, boolean | number | string>;

export type ThemePreset = {
  mainColor: string;
  token: ThemeToken;
};

export type ThemeMap = Record<string, ThemePreset>;

export const THEME_LIST: ThemeMap = {
  'Лесная тропа': {
    mainColor: '#0f766e',
    token: {
      borderRadius: 6,
      colorInfo: '#0f766e',
      colorInfoBg: '#edf3f3',
      colorPrimary: '#0f766e',
      colorPrimaryBg: '#edf3f3',
      colorSelectedMenu: '#0f766e',
      controlOutline: 'transparent',
      mainBgColor: '#edf3f3',
    },
  },
  'Летний луг': {
    mainColor: '#148f2b',
    token: {
      colorInfo: '#8ac460',
      colorLogo: '#036231',
      colorPrimary: '#78c11a',
      colorPrimaryText: '#ffffff',
      colorSelectedMenu: '#036231',
      controlOutline: 'transparent',
      mainBgColor: '#d8ecb1',
    },
  },
  'Морской бриз': {
    mainColor: '#4079c9',
    token: {
      colorInfoBg: '#f0f9ff',
      colorPrimary: '#4079c9',
      colorSelectedMenu: '#4079c9',
      mainBgColor: '#f0f9ff',
    },
  },
  'Полет бабочки': {
    mainColor: '#805dca',
    token: {
      borderRadius: 6,
      colorBgBase: '#ffffff',
      colorInfo: '#805dca',
      colorPrimary: '#805dca',
      colorSelectedMenu: '#805dca',
      colorTextBase: '#1f2937',
      controlOutline: 'transparent',
      mainBgColor: '#f7f0ff',
      wireframe: false,
    },
  },
  'Полночный сумрак': {
    mainColor: '#4c5158',
    token: {
      borderRadius: 6,
      colorBgBase: '#37393e',
      colorBorder: 'rgba(255, 255, 255, 0.12)',
      colorBorderSecondary: 'rgba(255, 255, 255, 0.12)',
      colorInfo: '#73767c',
      colorInfoBg: '#2d2f33',
      colorPrimary: '#4c5158',
      colorPrimaryBg: '#2d2f33',
      colorPrimaryText: '#b9bbbe',
      colorSelectedMenu: '#b9bbbe',
      colorText: '#eeeeee',
      colorTextBase: '#b9bbbe',
      controlItemBgActive: '#2d2f33',
      controlOutline: 'transparent',
      mainBgColor: '#2d2f33',
      sizeStep: 4,
      sizeUnit: 4,
      wireframe: false,
    },
  },
  'Солнечный переулок': {
    mainColor: '#ffe400',
    token: {
      colorPrimary: '#5f5f5f',
      colorPrimaryBg: '#ffffda',
      colorPrimaryText: '#3e3e3e',
      colorSelectedMenu: '#5f5f5f',
      colorTextBase: '#1f1f1f',
      colorInfoBg: '#ffffda',
      controlOutline: 'transparent',
      mainBgColor: '#fcfc6f',
    },
  },
};

export type ThemeName = keyof typeof THEME_LIST;

export const SET_THEME_KEY: InjectionKey<(themeName: ThemeName) => void> = Symbol('set-theme');
export const CURRENT_THEME_KEY: InjectionKey<Ref<ThemeName>> = Symbol('current-theme');
