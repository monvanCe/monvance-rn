import {Text as PaperText, TextProps} from 'react-native-paper';
import {useTheme} from '../../context/ThemeContext';

interface CustomTextProps extends TextProps<any> {
  children: React.ReactNode;
}

export const Text = (props: CustomTextProps) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  return (
    <PaperText style={[{color: colors.onSurface}]} {...props}>
      {props.children}
    </PaperText>
  );
};
