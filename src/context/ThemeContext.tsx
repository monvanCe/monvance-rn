import React, {createContext, useContext} from 'react';

import {useDispatch} from 'react-redux';
import {setAppTheme} from '../store/slices/appConfigSlice';
import {useAppSelector} from '../store/store';

const uiProperties = {
  radius: 8,
  borderWidth: 0.5,
  spacing: 8,
  elevation: 1,
  isFilled: false,
} as const;

const darkTheme = {
  colors: {
    primary: '#FFFFFF',
    secondary: '#000000',
    background: '#000000',
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    surfaceDisabled: '#2A2A2A',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#CCCCCC',
    onSurfaceDisabled: '#666666',
    outline: '#333333',
    outlineVariant: '#444444',
    text: '#FFFFFF',
    error: '#CF6679',
    shadow: '#000000',
    premium: '#FFD700',
    green: '#00FF00',
  },
  ui: uiProperties,
};

const lightTheme = {
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceVariant: '#E5E5E5',
    surfaceDisabled: '#EEEEEE',
    onSurface: '#000000',
    onSurfaceVariant: '#333333',
    onSurfaceDisabled: '#999999',
    outline: '#CCCCCC',
    outlineVariant: '#DDDDDD',
    text: '#000000',
    error: '#B00020',
    shadow: '#000000',
    premium: '#FFD700',
    green: '#00FF00',
  },
  ui: uiProperties,
};

type ThemeContextType = {
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
