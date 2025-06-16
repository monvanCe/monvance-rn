import React, {createContext, useState, useContext} from 'react';
import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';

const uiProperties = {
  radius: 8,
  borderWidth: 0.5,
  spacing: 8,
  elevation: 1,
  isFilled: false,
} as const;

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
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
  },
  ui: uiProperties,
};

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme, theme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
