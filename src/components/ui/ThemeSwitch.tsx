import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {Switch} from './Switch';

const ThemeToggle = () => {
  const {isDarkMode, toggleTheme} = useTheme();
  return (
    <Switch disabled={true} value={isDarkMode} onValueChange={toggleTheme} />
  );
};

export default ThemeToggle;
