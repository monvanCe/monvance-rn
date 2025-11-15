import React, {PropsWithChildren, forwardRef, useMemo} from 'react';
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = PropsWithChildren<
  KeyboardAvoidingViewProps & {
    androidBehavior?: 'height' | 'position' | 'padding';
    extraOffset?: number;
  }
>;

const KeyboardAvoidingView = forwardRef<RNKeyboardAvoidingView, Props>(
  (
    {
      children,
      behavior,
      androidBehavior = 'height',
      keyboardVerticalOffset,
      extraOffset = 0,
      style,
      enabled,
      ...rest
    },
    ref,
  ) => {
    const insets = useSafeAreaInsets();

    const resolvedBehavior =
      behavior ?? Platform.select({ios: 'padding', default: androidBehavior});

    const resolvedOffset = useMemo(() => {
      if (typeof keyboardVerticalOffset === 'number') {
        return keyboardVerticalOffset;
      }

      const baseOffset = Platform.select({
        ios: insets.top,
        android: StatusBar.currentHeight ?? 0,
        default: 0,
      });

      return (baseOffset ?? 0) + extraOffset;
    }, [keyboardVerticalOffset, insets.top, extraOffset]);

    const resolvedEnabled = enabled ?? true;

    return (
      <RNKeyboardAvoidingView
        ref={ref}
        behavior={resolvedBehavior}
        enabled={resolvedEnabled}
        keyboardVerticalOffset={resolvedOffset}
        style={style}
        {...rest}>
        {children}
      </RNKeyboardAvoidingView>
    );
  },
);

KeyboardAvoidingView.displayName = 'KeyboardAvoidingView';

export default KeyboardAvoidingView;
