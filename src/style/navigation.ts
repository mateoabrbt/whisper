import { Theme, DefaultTheme } from "@react-navigation/native";
import {
  WHITE,
  BLACK,
  PUMPKIN,
  DARK_CARD,
  LIGHT_CARD,
  DARK_BORDER,
  DARK_SHADOW,
  LIGHT_BORDER,
  DARK_BACKGROUND,
  LIGHT_BACKGROUND,
} from "@style/colors";

export const Light = (): Theme => ({
  dark: false,
  fonts: { ...DefaultTheme.fonts },
  colors: {
    text: BLACK,
    card: LIGHT_CARD,
    primary: PUMPKIN,
    border: LIGHT_BORDER,
    background: LIGHT_BACKGROUND,
    notification: LIGHT_BACKGROUND,
  },
});

export const Dark = () => ({
  dark: true,
  fonts: { ...DefaultTheme.fonts },
  colors: {
    text: WHITE,
    card: DARK_CARD,
    primary: PUMPKIN,
    shadow: DARK_SHADOW,
    border: DARK_BORDER,
    background: DARK_BACKGROUND,
    notification: DARK_BACKGROUND,
  },
});
