import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {Text} from './ui/Text';
import {t} from '../localization';
import {useAppSelector} from '../store/store';

type HomeHeaderProps = {
  onNavigateToChat: () => void;
  hasNewMessages: boolean;
  appTheme: any;
};

const HomeHeader = ({
  onNavigateToChat,
  hasNewMessages,
  appTheme,
}: HomeHeaderProps) => {
  const navigation = useNavigation();
  const {unreadCount} = useAppSelector(state => state.notification);
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: appTheme.ui.spacing * 2,
          paddingTop: appTheme.ui.spacing * 2,
          paddingBottom: appTheme.ui.spacing * 2,
        },
      ]}>
      <Text
        style={[
          {
            fontSize: appTheme.ui.spacing * 3.5,
            fontWeight: '700',
            color: appTheme.colors.onSurface,
          },
        ]}>
        {t('markets')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: appTheme.ui.spacing * 1.5,
        }}>
        <View style={{position: 'relative', marginRight: appTheme.ui.spacing}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications' as never)}
            style={{
              backgroundColor: appTheme.colors.surfaceVariant,
              borderRadius: 100,
              padding: appTheme.ui.spacing,
            }}>
            <Icon
              name="notifications"
              size={appTheme.ui.spacing * 3.5}
              color={appTheme.colors.premium}
            />
          </TouchableOpacity>

          <View
            style={{
              position: 'absolute',
              top: appTheme.ui.spacing / 2.5,
              right: appTheme.ui.spacing / 2.5,
              backgroundColor: appTheme.colors.error,
              minWidth: appTheme.ui.spacing * 2.2,
              height: appTheme.ui.spacing * 2.2,
              borderRadius: appTheme.ui.spacing * 1.1,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              paddingHorizontal: appTheme.ui.spacing / 2,
            }}>
            <Text
              style={{
                color: appTheme.colors.onSurface,
                fontWeight: '700',
                fontSize: appTheme.ui.spacing * 1.1,
              }}>
              {unreadCount}
            </Text>
          </View>
        </View>
        <View style={{position: 'relative'}}>
          <TouchableOpacity
            onPress={onNavigateToChat}
            style={{
              backgroundColor: appTheme.colors.surfaceVariant,
              borderRadius: 100,
              padding: appTheme.ui.spacing,
            }}>
            <Icon
              name="chat"
              size={appTheme.ui.spacing * 3.5}
              color={appTheme.colors.primary}
            />
          </TouchableOpacity>
          {hasNewMessages && (
            <View
              style={{
                position: 'absolute',
                top: appTheme.ui.spacing / 2.5,
                right: appTheme.ui.spacing / 2.5,
                backgroundColor: appTheme.colors.error,
                width: appTheme.ui.spacing * 1.5,
                height: appTheme.ui.spacing * 1.5,
                borderRadius: appTheme.ui.spacing * 0.75,
                borderWidth: appTheme.ui.borderWidth * 2,
                borderColor: appTheme.colors.background,
                zIndex: 2,
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
