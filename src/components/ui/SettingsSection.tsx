import React from 'react';
import {View, StyleSheet} from 'react-native';
import SettingsCard from './SettingsCard';
import {Text} from './Text';
import {useTheme} from '../../context/ThemeContext';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({title, children}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <SettingsCard>
      {title && (
        <Text
          style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>
          {title}
        </Text>
      )}
      <View style={styles.content}>{children}</View>
    </SettingsCard>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: theme.ui.fontSize * 0.8125,
      fontWeight: '600',
      marginBottom: 2,
    },
    content: {
      gap: 8,
    },
  });

export default SettingsSection;
