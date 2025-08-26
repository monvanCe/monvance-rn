import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Text} from './Text';
import {Button} from './Button';
import {useTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText: string;
  onClose: () => void;
}

const {width: screenWidth} = Dimensions.get('window');

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title,
  message,
  buttonText,
  onClose,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}>
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        />
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1}>
            <Animated.View
              style={[
                styles.modal,
                {
                  backgroundColor: theme.colors.surface,
                  transform: [
                    {scale: scaleAnim},
                  ],
                  opacity: fadeAnim,
                },
              ]}>
              
              {/* Success Icon */}
              <View style={[styles.iconContainer, {backgroundColor: theme.colors.green}]}>
                <Icon name="check" size={32} color="#FFFFFF" />
              </View>

              {/* Title */}
              <Text style={[styles.title, {color: theme.colors.onSurface}]}>
                {title}
              </Text>

              {/* Message */}
              <Text style={[styles.message, {color: theme.colors.onSurfaceVariant}]}>
                {message}
              </Text>

              {/* Button */}
              <View style={styles.buttonContainer}>
                <View style={[styles.bigButton, {backgroundColor: theme.colors.green}]}>
                  <Button
                    onPress={onClose}
                    style={styles.buttonInside}>
                    <Text style={styles.buttonText}>
                      {buttonText}
                    </Text>
                  </Button>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.ui.spacing * 3,
    },
    modal: {
      width: Math.min(screenWidth - (theme.ui.spacing * 6), 320),
      borderRadius: theme.ui.radius * 2,
      padding: theme.ui.spacing * 3,
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.ui.spacing * 2,
    },
    title: {
      fontSize: theme.ui.fontSize * 1.5,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: theme.ui.spacing,
    },
    message: {
      fontSize: theme.ui.fontSize * 1,
      lineHeight: theme.ui.fontSize * 1.4,
      textAlign: 'center',
      marginBottom: theme.ui.spacing * 3,
    },
    buttonContainer: {
      width: '100%',
    },
    bigButton: {
      height: 48,
      borderRadius: theme.ui.radius * 1.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonInside: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: theme.ui.fontSize * 1.125,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });

export default SuccessModal; 