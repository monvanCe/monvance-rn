import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  View,
} from 'react-native';

const KeyboardAvoidingView = ({
  children,
  ...props
}: KeyboardAvoidingViewProps) => {
  return Platform.OS === 'ios' ? (
    <RNKeyboardAvoidingView
      behavior={'padding'}
      keyboardVerticalOffset={90}
      {...props}>
      {children}
    </RNKeyboardAvoidingView>
  ) : (
    <View {...props}>{children}</View>
  );
};

export default KeyboardAvoidingView;
