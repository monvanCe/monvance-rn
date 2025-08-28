import React, {useEffect, useMemo, useRef} from 'react';
import {TouchableOpacity, View, StyleSheet, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';
import {Text} from './Text';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_NAMES} from '../../const/routeNames';

interface PromoButtonProps {
  trialTime: string;
}

const PromoButton: React.FC<PromoButtonProps> = ({trialTime}) => {
  const {theme} = useTheme();
  const styles = style(theme);
  const navigation = useNavigation<any>();

  // Countdown
  const [remainingText, setRemainingText] = React.useState('');
  useEffect(() => {
    const target = new Date(trialTime).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemainingText(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [trialTime]);

  // Glow pulse
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [glow]);

  // Shake every 3s
  const shake = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const runShake = () => {
      Animated.sequence([
        Animated.timing(shake, {
          toValue: 10,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -10,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: 6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start();
    };
    const interval = setInterval(runShake, 3000);
    return () => clearInterval(interval);
  }, [shake]);

  // Particles
  const particleAnims = useMemo(
    () =>
      [...Array(6)].map(() => ({
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.6),
      })),
    [],
  );

  useEffect(() => {
    const loops = particleAnims.map(({translateY, opacity, scale}, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(idx * 250),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -18,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0.6,
                duration: 1200,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [particleAnims]);

  const shadowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const onPress = () => {
    navigation.navigate(ROUTE_NAMES.PROMO);
  };

  return (
    <Animated.View style={{transform: [{translateX: shake}]}}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Animated.View style={[styles.glow, {opacity: shadowOpacity}]} />
        <LinearGradient
          colors={['#FFEE58', '#FFD600', '#FF8F00']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.container}>
          <View style={styles.contentRow}>
            <Icon name="lightning-bolt" size={18} color="#000" />
            <Text style={styles.text}>Promo</Text>
          </View>
          <Text style={styles.countdown}>{remainingText}</Text>
        </LinearGradient>
        <View style={styles.particlesLayer} pointerEvents="none">
          {particleAnims.map((p, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {left: 6 + i * 10},
                {transform: [{translateY: p.translateY}, {scale: p.scale}]},
                {opacity: p.opacity},
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: '#000',
      minWidth: 90,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentRow: {
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: '#000',
      fontWeight: '900',
      fontSize: theme.ui.fontSize * 0.9,
    },
    countdown: {
      color: '#000',
      fontWeight: '700',
      fontSize: theme.ui.fontSize * 0.75,
    },
    glow: {
      position: 'absolute',
      top: -6,
      left: -6,
      right: -6,
      bottom: -6,
      borderRadius: 28,
      backgroundColor: 'rgba(255, 214, 0, 0.35)',
      zIndex: -1,
    },
    particlesLayer: {
      position: 'absolute',
      top: -6,
      left: 0,
      right: 0,
      height: 12,
    },
    particle: {
      position: 'absolute',
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#FFF59D',
    },
  });

export default PromoButton;
