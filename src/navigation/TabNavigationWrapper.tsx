import React, {useState, useEffect} from 'react';
import {StyleSheet, Dimensions, View, Keyboard} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {useCallback} from 'react';

import {useTheme as useAppTheme} from '../context/ThemeContext';
import TabNavigation from './TabNavigation';
import ChatScreen from '../screens/ChatScreen';
import {eventBus} from '../middleware/eventMiddleware';

const {width} = Dimensions.get('window');

const TabNavigationWrapper = () => {
  const {theme: appTheme} = useAppTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [screenName, setScreenName] = useState<string>('Home');
  const translateX = useSharedValue(width);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (isChatOpen) {
      eventBus.emit('chatScreenOpened', null);
    }
  }, [isChatOpen]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const navigateToChat = useCallback(() => {
    setIsChatOpen(true);
    translateX.value = withTiming(0, {duration: 300});
    overlayOpacity.value = withTiming(0.5, {duration: 300});
  }, [translateX, overlayOpacity]);

  useEffect(() => {
    // Listen for navigate to chat events from ScreenHeader
    const handleNavigateToChat = () => {
      navigateToChat();
    };

    eventBus.on('navigateToChat', handleNavigateToChat);

    return () => {
      eventBus.off('navigateToChat', handleNavigateToChat);
    };
  }, [navigateToChat]);

  const navigateToTab = () => {
    setIsChatOpen(false);
    dismissKeyboard();
    translateX.value = withTiming(width, {duration: 300});
    overlayOpacity.value = withTiming(0, {duration: 300});
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onBegin(event => {
      if (event.x > 50) {
        return false;
      }
    })
    .shouldCancelWhenOutside(true)
    .simultaneousWithExternalGesture(Gesture.Pan())
    .onUpdate(event => {
      const {translationX} = event;

      if (!isChatOpen) {
        const newTranslateX = Math.max(0, width + translationX);
        translateX.value = newTranslateX;
        overlayOpacity.value = Math.max(
          0,
          Math.min(0.5, (-translationX / width) * 0.5),
        );
      } else {
        const newTranslateX = Math.min(width, translationX);
        translateX.value = newTranslateX;
        overlayOpacity.value = Math.max(
          0,
          Math.min(0.5, 0.5 - (translationX / width) * 0.5),
        );
      }
    })
    .onEnd(event => {
      const {translationX, velocityX} = event;
      const threshold = width * 0.3;
      const velocityThreshold = 500;

      if (!isChatOpen) {
        if (translationX < -threshold || velocityX < -velocityThreshold) {
          runOnJS(setIsChatOpen)(true);
          translateX.value = withTiming(0, {duration: 300});
          overlayOpacity.value = withTiming(0.5, {duration: 300});
        } else {
          translateX.value = withTiming(width, {duration: 300});
          overlayOpacity.value = withTiming(0, {duration: 300});
        }
      } else {
        if (translationX > threshold || velocityX > velocityThreshold) {
          runOnJS(setIsChatOpen)(false);
          runOnJS(dismissKeyboard)();
          translateX.value = withTiming(width, {duration: 300});
          overlayOpacity.value = withTiming(0, {duration: 300});
        } else {
          translateX.value = withTiming(0, {duration: 300});
          overlayOpacity.value = withTiming(0.5, {duration: 300});
        }
      }
    });

  const chatAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
      opacity: 1,
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {screenName === 'Home' ? (
        <GestureDetector gesture={panGesture}>
          <View
            style={[
              styles.container,
              {backgroundColor: appTheme.colors.background},
            ]}>
            <View style={styles.mainContainer}>
                        <TabNavigation
            setScreenName={setScreenName}
          />
            </View>

            <Animated.View
              style={[styles.darkOverlay, overlayAnimatedStyle]}
              pointerEvents="none"
            />

            <Animated.View style={[styles.chatOverlay, chatAnimatedStyle]}>
              <ChatScreen onNavigateToTab={navigateToTab} />
            </Animated.View>
          </View>
        </GestureDetector>
      ) : (
        <View
          style={[
            styles.container,
            {backgroundColor: appTheme.colors.background},
          ]}>
          <View style={styles.mainContainer}>
            <TabNavigation
              setScreenName={setScreenName}
            />
          </View>

          <Animated.View
            style={[styles.darkOverlay, overlayAnimatedStyle]}
            pointerEvents="none"
          />

          <Animated.View style={[styles.chatOverlay, chatAnimatedStyle]}>
            <ChatScreen onNavigateToTab={navigateToTab} />
          </Animated.View>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mainContainer: {
    flex: 1,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 500,
  },
  chatOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
});

export default TabNavigationWrapper;
