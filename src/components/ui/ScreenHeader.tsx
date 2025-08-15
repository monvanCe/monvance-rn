import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../context/ThemeContext';
import {Text} from './Text';
import NotificationIcon from '../NotificationIcon';

export interface HeaderAction {
  iconName: string;
  onPress: () => void;
  iconLibrary?: 'MaterialIcons' | 'MaterialCommunityIcons';
  size?: number;
  color?: string;
}

interface ScreenHeaderProps {
  title: string;
  showNotification?: boolean;
  actions?: HeaderAction[];
  backgroundColor?: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showNotification = true,
  actions = [],
  backgroundColor,
}) => {
  const {theme} = useTheme();
  const styles = style(theme);

  const renderAction = (action: HeaderAction, index: number) => {
    const IconComponent = action.iconLibrary === 'MaterialCommunityIcons' 
      ? require('react-native-vector-icons/MaterialCommunityIcons').default 
      : Icon;

    return (
      <TouchableOpacity
        key={index}
        onPress={action.onPress}
        style={styles.actionButton}>
        <IconComponent
          name={action.iconName}
          size={action.size || theme.ui.spacing * 3}
          color={action.color || theme.colors.onSurface}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      backgroundColor && {backgroundColor}
    ]}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.rightContainer}>
        {actions.map(renderAction)}
        {showNotification && <NotificationIcon />}
        
      </View>
    </View>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.ui.spacing * 2,
      paddingTop: theme.ui.spacing * 2,
      paddingBottom: theme.ui.spacing * 2,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      fontSize: theme.ui.spacing * 3.5,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.ui.spacing,
    },
    actionButton: {
      padding: theme.ui.spacing * 0.5,
    },
  });

export default ScreenHeader; 