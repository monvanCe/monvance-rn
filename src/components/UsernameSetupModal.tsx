import React, {useState, useEffect, useCallback} from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {Text} from './ui/Text';
import {Button} from './ui/Button';
import {DebouncedInput} from './ui/DebouncedInput';
import {internalService} from '../service/internalServices';
import {eventBus} from '../middleware/eventMiddleware';
import {t} from '../localization/index';

interface UsernameSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UsernameSetupModal: React.FC<UsernameSetupModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCheckUsernameSuccess = ({
      username: checkedUsername,
      available,
    }: {
      username: string;
      available: boolean;
    }) => {
      if (checkedUsername === username) {
        setIsChecking(false);
        setIsAvailable(available);
        setError(available ? '' : t('username_not_available'));
      }
    };

    eventBus.on('checkUsernameSuccess', handleCheckUsernameSuccess);

    return () => {
      eventBus.off('checkUsernameSuccess', handleCheckUsernameSuccess);
    };
  }, [username]);

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setIsAvailable(null);
    setError('');
  };

  const handleDebouncedCheck = useCallback(async (text: string) => {
    if (text.trim().length < 3) {
      setError('Username must be at least 3 characters');
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      await internalService.checkUsername(text);
    } catch (err) {
      setIsChecking(false);
      setError('Error checking username');
    }
  }, []);

  const handleSave = async () => {
    if (!isAvailable || !username.trim()) return;

    try {
      await internalService.updateUser({username: username.trim()});
      onSuccess();
    } catch (err) {
      setError('Error saving username');
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: theme.theme.ui.radius * 2,
      padding: theme.theme.ui.spacing * 2,
      margin: theme.theme.ui.spacing * 2,
      minWidth: 300,
      maxWidth: 400,
    },
    title: {
      fontSize: theme.theme.ui.fontSize + 4,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: theme.theme.ui.spacing,
      textAlign: 'center',
    },
    description: {
      fontSize: theme.theme.ui.fontSize,
      color: colors.onSurfaceVariant,
      marginBottom: theme.theme.ui.spacing * 2,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.theme.ui.spacing * 2,
    },
    button: {
      flex: 1,
      marginHorizontal: theme.theme.ui.spacing / 2,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t('username_setup_title')}</Text>
          <Text style={styles.description}>
            {t('username_setup_description')}
          </Text>

          <DebouncedInput
            value={username}
            onChangeText={handleUsernameChange}
            placeholder={t('username_placeholder')}
            onDebouncedChange={handleDebouncedCheck}
            debounceDelay={1000}
            error={error}
            success={isAvailable ? t('username_available') : undefined}
            loading={isChecking}
          />

          <View style={styles.buttonContainer}>
            <Button onPress={onClose} variant="outlined" style={styles.button}>
              {t('cancel')}
            </Button>
            <Button
              onPress={handleSave}
              disabled={!isAvailable || !username.trim()}
              style={styles.button}>
              {t('ok')}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
