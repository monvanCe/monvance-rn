import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useAppSelector} from '../store/store';
import {Text} from '../components/ui/Text';
import {TextInput} from '../components/ui/TextInput';
import {Button} from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import SuccessModal from '../components/ui/SuccessModal';
import {t} from '../localization';
import {useNavigation} from '@react-navigation/native';
import {INTERNAL_ENDPOINTS} from '../const/internalEndpoints';
import {api} from '../service/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const user = useAppSelector(state => state.auth);

  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = () => {
    setError('');

    if (!message.trim()) {
      setError(t('please_enter_message'));
      return false;
    }

    if (message.trim().length < 5) {
      setError('Message must be at least 5 characters long');
      return false;
    }

    if (message.trim().length > 1000) {
      setError('Message is too long (max 1000 characters)');
      return false;
    }

    return true;
  };

  const sendFeedbackRequest = async (
    feedbackData: any,
    attempt: number = 1,
  ): Promise<boolean> => {
    try {
      await api.post(
        INTERNAL_ENDPOINTS.SEND_FEEDBACK,
        'internal',
        feedbackData,
      );
      return true;
    } catch (error: any) {
      console.error(`Feedback send attempt ${attempt} failed:`, error);

      // If it's a network error and we haven't exceeded max retries, try again
      if (
        attempt < 3 &&
        (error.code === 'NETWORK_ERROR' || error.message?.includes('Network'))
      ) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        return sendFeedbackRequest(feedbackData, attempt + 1);
      }

      throw error;
    }
  };

  const handleSendFeedback = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const feedbackData = {
        message: message.trim(),
        userId: user._id || 'unknown',
        userEmail: user.username || 'no-email',
        timestamp: new Date().toISOString(),
        appVersion: '1.0.0',
        platform: 'mobile',
        ...(rating > 0 && {star: rating}),
      };

      const success = await sendFeedbackRequest(feedbackData);

      if (success) {
        // Reset form
        setMessage('');
        setRating(0);
        setRetryCount(0);

        // Show success modal
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.error('Final feedback send error:', error);

      let errorMessage = t('failed_to_send_feedback');

      if (
        error.message?.includes('Network') ||
        error.code === 'NETWORK_ERROR'
      ) {
        errorMessage =
          'Network error. Please check your connection and try again.';
      } else if (error.status === 400) {
        errorMessage =
          'Invalid feedback data. Please check your message and try again.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      setError(errorMessage);
      setRetryCount(prev => prev + 1);

      // Show retry option for network errors
      if (
        error.message?.includes('Network') ||
        error.code === 'NETWORK_ERROR'
      ) {
        Alert.alert(
          'Connection Error',
          'Failed to send feedback due to network issues. Would you like to try again?',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Retry', onPress: () => handleSendFeedback()},
          ],
        );
      } else {
        Alert.alert(t('error'), errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.onSurface}]}>
          {t('feedback')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, {color: theme.colors.onSurface}]}>
          {t('your_feedback')}
        </Text>

        <Text
          style={[styles.description, {color: theme.colors.onSurfaceVariant}]}>
          {t('feedback_description')}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.label, {color: theme.colors.onSurface}]}>
            {t('rating')} ({t('optional')})
          </Text>
          <StarRating rating={rating} onRatingChange={setRating} size={32} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, {color: theme.colors.onSurface}]}>
            {t('message')} *
          </Text>
          <TextInput
            value={message}
            onChangeText={text => {
              setMessage(text);
              if (error) setError(''); // Clear error when user starts typing
            }}
            placeholder={t('enter_your_feedback')}
            multiline
            numberOfLines={6}
            style={[
              styles.textInput,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.onSurface,
                borderColor: error ? theme.colors.error : theme.colors.outline,
              },
            ]}
            textAlignVertical="top"
          />
          {error ? (
            <Text style={[styles.errorText, {color: theme.colors.error}]}>
              {error}
            </Text>
          ) : null}
          {retryCount > 0 && (
            <Text
              style={[
                styles.retryText,
                {color: theme.colors.onSurfaceVariant},
              ]}>
              Attempt {retryCount + 1} - Please try again
            </Text>
          )}
        </View>

        {/* Transaction Info Card */}

        <View style={styles.buttonContainer}>
          <View
            style={[
              styles.bigButton,
              {
                backgroundColor:
                  !message.trim() || isLoading || message.trim().length < 5
                    ? theme.colors.onSurfaceDisabled
                    : theme.colors.green,
              },
            ]}>
            <Button
              onPress={handleSendFeedback}
              loading={isLoading}
              disabled={
                !message.trim() || isLoading || message.trim().length < 5
              }
              style={styles.buttonInside}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      !message.trim() || isLoading || message.trim().length < 5
                        ? theme.colors.onSurfaceVariant
                        : '#FFFFFF',
                  },
                ]}>
                {isLoading ? 'Sending...' : t('send_feedback')}
              </Text>
            </Button>
          </View>
          {message.trim().length > 0 && message.trim().length < 5 && (
            <Text
              style={[styles.helpText, {color: theme.colors.onSurfaceVariant}]}>
              Message too short (minimum 5 characters)
            </Text>
          )}
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccessModal}
        title={t('success')}
        message={t('feedback_sent_successfully')}
        buttonText={t('ok')}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.ui.spacing * 2,
      paddingVertical: theme.ui.spacing,
      backgroundColor: theme.colors.surface,
    },
    backButton: {
      padding: theme.ui.spacing,
      marginRight: theme.ui.spacing,
    },
    headerTitle: {
      fontSize: theme.ui.fontSize * 1.25,
      fontWeight: '600',
      flex: 1,
      textAlign: 'center',
    },
    headerSpacer: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.ui.spacing * 2,
      paddingBottom: theme.ui.spacing * 4,
    },
    title: {
      fontSize: theme.ui.fontSize * 1.5,
      fontWeight: '700',
      marginBottom: theme.ui.spacing,
    },
    description: {
      fontSize: theme.ui.fontSize * 1,
      marginBottom: theme.ui.spacing * 3,
      lineHeight: theme.ui.fontSize * 1.4,
    },
    section: {
      marginBottom: theme.ui.spacing * 3,
    },
    label: {
      fontSize: theme.ui.fontSize * 1.125,
      fontWeight: '600',
      marginBottom: theme.ui.spacing,
    },
    textInput: {
      minHeight: 120,
      borderRadius: theme.ui.radius,
      padding: theme.ui.spacing * 1.5,
      fontSize: theme.ui.fontSize * 1,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    buttonContainer: {
      marginTop: theme.ui.spacing * 2,
    },
    bigButton: {
      height: 56,
      borderRadius: theme.ui.radius * 2,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    buttonInside: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: theme.ui.fontSize * 1.25,
      fontWeight: '700',
      textAlign: 'center',
    },
    errorText: {
      fontSize: theme.ui.fontSize * 0.875,
      marginTop: theme.ui.spacing / 2,
      fontWeight: '500',
    },
    retryText: {
      fontSize: theme.ui.fontSize * 0.875,
      marginTop: theme.ui.spacing / 2,
      fontStyle: 'italic',
    },
    helpText: {
      fontSize: theme.ui.fontSize * 0.875,
      marginTop: theme.ui.spacing / 2,
      textAlign: 'center',
    },
  });

export default FeedbackScreen;
