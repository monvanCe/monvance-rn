import {View, ActivityIndicator} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

export const Spinner = () => {
  const theme = useTheme();
  const colors = theme.theme.colors;

  return (
    <View>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
};
