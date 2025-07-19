import {Text as PaperText, TextProps} from 'react-native-paper';
import {useTheme} from '../../context/ThemeContext';

interface CustomTextProps extends TextProps<any> {
  children: React.ReactNode;
  textVariant?: 'text' | 'contained' | 'outlined';
}

export const Text = (props: CustomTextProps) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {textVariant, style, ...rest} = props;
  const isContained = textVariant === 'contained';
  const isOutlined = textVariant === 'outlined';
  return (
    <PaperText
      style={[
        {
          color: colors.onSurface,
          backgroundColor: isContained ? colors.surface : 'transparent',
          borderWidth: isOutlined ? 1 : 0,
          borderColor: isOutlined ? colors.outline : 'transparent',
          borderRadius: theme.theme.ui.radius,
          paddingHorizontal: isContained || isOutlined ? 8 : 0,
          paddingVertical: isContained || isOutlined ? 2 : 0,
        },
        style,
      ]}
      {...rest}>
      {props.children}
    </PaperText>
  );
};
