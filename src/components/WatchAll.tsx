import React from 'react';
import {View, Text} from 'react-native';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import {t} from '../localization';
import {Switch} from './ui/Switch';
import {useAppSelector} from '../store/store';
import {eventBus} from '../middleware/eventMiddleware';

const WatchAll = () => {
  const {theme: appTheme} = useAppTheme();
  const {watchAll, loading} = useAppSelector(state => state.watchlist);

  const handleWatchAllChange = () => {
    eventBus.emit('watchAllChanged', !watchAll);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: appTheme.ui.spacing,
        marginTop: appTheme.ui.spacing * 2,
        marginBottom: appTheme.ui.spacing,
        paddingHorizontal: appTheme.ui.spacing * 2,
      }}>
      <Text
        style={{
          fontWeight: '600',
          fontSize: appTheme.ui.spacing * 1.7,
          color: appTheme.colors.primary,
        }}>
        {t('watch_all')}
      </Text>
      {loading ? (
        <View
          style={{
            width: 50,
            height: 28,
            borderRadius: 999,
            backgroundColor: appTheme.colors.surface,
          }}
        />
      ) : (
        <Switch value={watchAll} onValueChange={handleWatchAllChange} />
      )}
    </View>
  );
};

export default WatchAll;
