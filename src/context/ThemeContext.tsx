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
    primary: '#16C784', // primary color for buttons and links
    secondary: '#23262F', // secondary color for background
    background: '#181A20', // background color for the app
    surface: '#23262F', // surface color for cards and other elements
    surfaceVariant: '#23262F', // surface variant color for cards and other elements
    surfaceDisabled: '#23262F', // surface disabled color for cards and other elements
    onSurface: '#FFFFFF', // on surface color for text and icons
    onSurfaceVariant: '#A3A3A3', // on surface variant color for text and icons
    onSurfaceDisabled: '#666666', // on surface disabled color for text and icons
    outline: '#333333', // outline color for cards and other elements
    outlineVariant: '#23262F', // outline variant color for cards and other elements
    text: '#FFFFFF', // text color for text and icons
    error: '#CF6679', // error color for errors
    shadow: '#000000', // shadow color for shadows
    premium: '#FFD700', // premium color for premium elements
    green: '#16C784', // green color for success
  },
  ui: uiProperties,
};

const lightTheme = {
  colors: {
    primary: '#059669', // primary color for buttons and links - emerald green to match dark theme
    secondary: '#F8FAFC', // secondary color for background - light gray
    background: '#FFFFFF', // background color for the app
    surface: '#F1F5F9', // surface color for cards and other elements - light gray
    surfaceVariant: '#E2E8F0', // surface variant color for cards and other elements - slightly darker gray
    surfaceDisabled: '#F1F5F9', // surface disabled color for cards and other elements
    onSurface: '#1E293B', // on surface color for text and icons - dark slate
    onSurfaceVariant: '#64748B', // on surface variant color for text and icons - medium gray
    onSurfaceDisabled: '#94A3B8', // on surface disabled color for text and icons - light gray
    outline: '#CBD5E1', // outline color for cards and other elements - light gray
    outlineVariant: '#E2E8F0', // outline variant color for cards and other elements
    text: '#0F172A', // text color for text and icons - very dark slate
    error: '#DC2626', // error color for errors - red
    shadow: '#000000', // shadow color for shadows
    premium: '#F59E0B', // premium color for premium elements - amber
    green: '#059669', // green color for success - emerald green
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
