import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from './Text';
import {useTheme} from '../../context/ThemeContext';

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({title, onPress}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (_theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    button: {
      backgroundColor: '#FFD700',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000000',
    },
  });

export default PremiumButton; 