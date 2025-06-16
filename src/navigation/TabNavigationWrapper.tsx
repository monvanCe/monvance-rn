import React, {useRef, useState} from 'react';
import {FlatList, StyleSheet, Dimensions, View} from 'react-native';
import {Surface} from 'react-native-paper';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import TabNavigation from './TabNavigation';
import ChatScreen from '../screens/ChatScreen';

const {width} = Dimensions.get('window');

const TabNavigationWrapper = () => {
  const {theme: appTheme} = useAppTheme();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenName, setScreenName] = useState<string>('Home');

  const navigateToChat = () => {
    flatListRef.current?.scrollToIndex({index: 1, animated: true});
  };

  const navigateToTab = () => {
    flatListRef.current?.scrollToIndex({index: 0, animated: true});
  };

  const screens = [
    <View style={styles.screenContainer}>
      <TabNavigation
        setScreenName={setScreenName}
        onNavigateToChat={navigateToChat}
      />
    </View>,
    <View style={styles.screenContainer}>
      <ChatScreen onNavigateToTab={navigateToTab} />
    </View>,
  ];

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <Surface
      style={[styles.container, {backgroundColor: appTheme.colors.background}]}>
      <FlatList
        ref={flatListRef}
        data={screens}
        renderItem={({item}) => item}
        horizontal
        pagingEnabled
        scrollEnabled={screenName === 'Home'}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        snapToInterval={width}
        decelerationRate="fast"
        snapToAlignment="center"
        bounces={false}
        overScrollMode="never"
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    width: width,
    flex: 1,
  },
});

export default TabNavigationWrapper;
