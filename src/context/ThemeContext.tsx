import React, {createContext, useContext} from 'react';

import {useDispatch} from 'react-redux';
import {setAppTheme} from '../store/slices/appConfigSlice';
import {useAppSelector} from '../store/store';

const uiProperties: ITheme = {
  radius: 8,
  borderWidth: 0.5,
  spacing: 8,
  elevation: 1,
  defaultVariant: 'text',
  fontSize: 16,
} as const;

const darkTheme = {
  colors: {
    // Brand colors
    brand: '#ff6f17', // primary brand color for buttons and links
    premium: '#FFD700', // premium color for premium elements

    // Layout colors
    background: '#0A0A0A', // main background color
    surface: '#181A20', // card and component background
    onSurface: '#23262F', // surface element backgrounds (buttons, icons)
    onSurfaceContent: '#ccd2d9', // surface element colors

    // Text colors
    text: '#FFFFFF', // primary text color
    textSecondary: '#A3A3A3', // secondary text color
    textDisabled: '#666666', // disabled text color

    // Border colors
    border: '#333333', // primary border color
    borderVariant: '#23262F', // alternative border color

    // Semantic colors
    success: '#16C784', // success states and ascent indicators
    error: '#CF6679', // error states and descent indicators
    ascent: '#16C784', // price/trend ascent indicators
    descent: '#CF6679', // price/trend descent indicators
    notification: '#FF4444', // notification badges and alerts
    favorite: '#CF6679', // favorite icon color

    // Utility colors
    shadow: '#000000', // shadow color
  },
  ui: uiProperties,
};

const lightTheme = {
  colors: {
    // Brand colors
    brand: '#059669', // primary brand color for buttons and links
    premium: '#F59E0B', // premium color for premium elements

    // Layout colors
    background: '#FFFFFF', // main background color
    surface: '#F1F5F9', // card and component background
    onSurface: '#ccd2d9', // surface element backgrounds (buttons, icons)
    onSurfaceContent: '#0F172A', // surface element colors

    // Text colors
    text: '#0F172A', // primary text color
    textSecondary: '#64748B', // secondary text color
    textDisabled: '#94A3B8', // disabled text color

    // Border colors
    border: '#CBD5E1', // primary border color
    borderVariant: '#E2E8F0', // alternative border color

    // Semantic colors
    success: '#059669', // success states and ascent indicators
    error: '#DC2626', // error states and descent indicators
    ascent: '#059669', // price/trend ascent indicators
    descent: '#DC2626', // price/trend descent indicators
    notification: '#EF4444', // notification badges and alerts
    favorite: '#EF4444', // favorite icon color
    // Utility colors
    shadow: '#000', // shadow color
  },
  ui: uiProperties,
};

export type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof darkTheme;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
  theme: darkTheme,
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const dispatch = useDispatch();
  const currentTheme = useAppSelector(state => state.appConfig.appTheme);

  const isDarkMode = currentTheme === 'dark';

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    dispatch(setAppTheme(newTheme));
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme, theme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
