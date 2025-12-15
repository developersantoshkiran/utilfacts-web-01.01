'use client';
import { Montserrat } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

 const montserrat = Montserrat({
  weight: ['300', '400', '500', '700', '800', '900'],
  subsets: ['latin']
}); 


// eslint-disable-next-line import/no-anonymous-default-export
const colors= {
  "light": {
    "primary": "rgb(89, 71, 209)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(228, 223, 255)",
    "onPrimaryContainer": "rgb(23, 0, 101)",
    "secondary": "rgb(92, 83, 167)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(228, 223, 255)",
    "onSecondaryContainer": "rgb(24, 3, 98)",
    "tertiary": "rgb(77, 87, 169)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(223, 224, 255)",
    "onTertiaryContainer": "rgb(0, 9, 101)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "#FFFFFF",
    "onBackground": "rgb(28, 27, 31)",
    "surface": "#FFFFFF",
    "onSurface": "rgb(28, 27, 31)",
    "surfaceVariant": "rgb(229, 225, 236)",
    "onSurfaceVariant": "rgb(71, 70, 79)",
    "outline": "rgb(120, 118, 128)",
    "outlineVariant": "rgb(201, 197, 208)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(49, 48, 52)",
    "inverseOnSurface": "rgb(244, 239, 244)",
    "inversePrimary": "rgb(199, 191, 255)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(247, 242, 253)",
      "level2": "rgb(242, 237, 251)",
      "level3": "rgb(237, 231, 250)",
      "level4": "rgb(235, 229, 250)",
      "level5": "rgb(232, 226, 249)"
    },
    "surfaceDisabled": "rgba(28, 27, 31, 0.12)",
    "onSurfaceDisabled": "rgba(28, 27, 31, 0.38)",
    "backdrop": "rgba(49, 47, 56, 0.4)"
  },
  dark: {
    "primary": "rgb(199, 191, 255)",
    "onPrimary": "rgb(42, 0, 159)",
    "primaryContainer": "rgb(65, 41, 185)",
    "onPrimaryContainer": "rgb(228, 223, 255)",
    "secondary": "rgb(200, 195, 220)",
    "onSecondary": "rgb(48, 46, 65)",
    "secondaryContainer": "rgb(71, 68, 89)",
    "onSecondaryContainer": "rgb(229, 223, 249)",
    "tertiary": "rgb(236, 184, 207)",
    "onTertiary": "rgb(72, 37, 55)",
    "tertiaryContainer": "rgb(97, 59, 78)",
    "onTertiaryContainer": "rgb(255, 216, 232)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(28, 27, 31)",
    "onBackground": "rgb(229, 225, 230)",
    "surface": "rgb(28, 27, 31)",
    "onSurface": "rgb(229, 225, 230)",
    "surfaceVariant": "rgb(71, 70, 79)",
    "onSurfaceVariant": "rgb(201, 197, 208)",
    "outline": "rgb(146, 143, 153)",
    "outlineVariant": "rgb(71, 70, 79)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(229, 225, 230)",
    "inverseOnSurface": "rgb(49, 48, 52)",
    "inversePrimary": "rgb(89, 71, 209)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(37, 35, 42)",
      "level2": "rgb(42, 40, 49)",
      "level3": "rgb(47, 45, 56)",
      "level4": "rgb(49, 47, 58)",
      "level5": "rgb(52, 50, 62)"
    },
    "surfaceDisabled": "rgba(229, 225, 230, 0.12)",
    "onSurfaceDisabled": "rgba(229, 225, 230, 0.38)",
    "backdrop": "rgba(49, 47, 56, 0.4)",
    "#6E5De7": "rgb(199, 191, 255)",
    "on#6E5De7": "rgb(42, 0, 159)",
    "#6E5De7Container": "rgb(65, 41, 185)",
    "on#6E5De7Container": "rgb(228, 223, 255)"
  }
};


const theme = createTheme({
  palette: {
    primary: { main: '#6E5DE7' }
  },
  typography: {
    
    fontFamily: montserrat.style.fontFamily,
    
  },
});

export {montserrat}
export default theme;