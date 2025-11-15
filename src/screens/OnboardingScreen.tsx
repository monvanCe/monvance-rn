import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';
import {useDispatch} from 'react-redux';
import {setHasSeenOnboarding} from '../store/slices/appConfigSlice';
import {eventBus} from '../middleware/eventMiddleware';
import {useNavigation} from '@react-navigation/native';
import {t} from '../localization';
import {Button} from '../components/ui/Button';
import {Text} from '../components/ui/Text';
import {OnboardingPageKey} from '../const/enums';

const {width} = Dimensions.get('window');

const OnboardingScreen = () => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onboardingPages: IOnboardingPage[] = [
    {
      id: 1,
      title: t(OnboardingPageKey.PAGE1_TITLE),
      description: t(OnboardingPageKey.PAGE1_DESCRIPTION),
      image: require('../assets/logo.png'),
    },
    {
      id: 2,
      title: t(OnboardingPageKey.PAGE2_TITLE),
      description: t(OnboardingPageKey.PAGE2_DESCRIPTION),
      image: require('../assets/onboarding_switch_explain.png'),
    },
    {
      id: 3,
      title: t(OnboardingPageKey.PAGE3_TITLE),
      description: t(OnboardingPageKey.PAGE3_DESCRIPTION),
      image: require('../assets/onboarding_parameters_explain.png'),
    },
    {
      id: 4,
      title: t(OnboardingPageKey.PAGE4_TITLE),
      description: t(OnboardingPageKey.PAGE4_DESCRIPTION),
      image: require('../assets/logo.png'),
    },
  ];

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      const nextPage = currentPage + 1;
      flatListRef.current?.scrollToIndex({index: nextPage, animated: true});
      setCurrentPage(nextPage);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    dispatch(setHasSeenOnboarding(true));
    eventBus.emit('onboardingCompleted', null);
    eventBus.emit('setHasSeenOnboarding', true);
    navigation.reset({
      index: 0,
      routes: [{name: 'Main'}],
    });
  };

  const renderPage = ({item}: {item: IOnboardingPage}) => {
    return (
      <View
        style={[styles.pageContainer, {backgroundColor: colors.background}]}>
        <View style={styles.contentContainer}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
          <Text
            style={[styles.title, {color: colors.text}]}
            variant="headlineLarge">
            {item.title}
          </Text>
          <Text
            style={[styles.description, {color: colors.textSecondary}]}
            variant="bodyLarge">
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const renderPageIndicator = () => {
    return (
      <View style={styles.indicatorContainer}>
        {onboardingPages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  index === currentPage ? colors.brand : colors.border,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={{color: colors.textSecondary}}>
            {t(OnboardingPageKey.SKIP)}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingPages}
        renderItem={renderPage}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={e => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const page = Math.round(offsetX / width);
          setCurrentPage(page);
        }}
        scrollEventThrottle={16}
      />

      {renderPageIndicator()}

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleNext}
          variant="contained"
          style={styles.nextButton}>
          {currentPage === onboardingPages.length - 1
            ? t(OnboardingPageKey.GET_STARTED)
            : t(OnboardingPageKey.NEXT)}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    padding: 16,
    alignItems: 'flex-end',
  },
  pageContainer: {
    width: width,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  nextButton: {
    width: '100%',
  },
});

export default OnboardingScreen;
