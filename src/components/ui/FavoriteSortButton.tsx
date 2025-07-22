import React, {useMemo} from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FavoriteSortButtonProps {
  onPress: () => void;
}

const FavoriteSortButton: React.FC<FavoriteSortButtonProps> = ({onPress}) => {
  const {theme} = useTheme();
  const styles = style(theme);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Icon
        name="heart"
        size={20}
        color={theme.colors.primary}
        style={{marginRight: 6}}
      />
      <View>
        <Icon name="sort" size={16} color={theme.colors.onSurface} />
      </View>
    </TouchableOpacity>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) => ({
  button: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.ui.spacing,
    paddingVertical: theme.ui.spacing / 2,
    borderRadius: theme.ui.radius,
    borderWidth: theme.ui.borderWidth,
  },
});

export default FavoriteSortButton;
