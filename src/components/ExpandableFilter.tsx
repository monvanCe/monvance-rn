import React, {useState} from 'react';
import {View} from 'react-native';
import {Button} from './ui/Button';
import {Text} from './ui/Text';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import {t} from '../localization';

type Option = {label: string; value: string};

const periodOptions: Option[] = [
  {label: '1m', value: '1m'},
  {label: '5m', value: '5m'},
  {label: '15m', value: '15m'},
  {label: '30m', value: '30m'},
  {label: '1h', value: '1h'},
  {label: '4h', value: '4h'},
  {label: '1d', value: '1d'},
];

const percentOptions: Option[] = [
  {label: '0.1%', value: '0.1'},
  {label: '0.5%', value: '0.5'},
  {label: '1%', value: '1'},
  {label: '2%', value: '2'},
  {label: '5%', value: '5'},
  {label: '10%', value: '10'},
];

const ExpandableFilter = () => {
  const {theme: appTheme} = useAppTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState('1m');
  const [currentPercent, setCurrentPercent] = useState('1');

  return (
    <View
      style={[
        {
          paddingHorizontal: appTheme.ui.spacing * 2,
          paddingBottom: appTheme.ui.spacing,
          backgroundColor: appTheme.colors.surface,
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: appTheme.ui.spacing,
        }}>
        <View style={{gap: appTheme.ui.spacing}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: appTheme.ui.spacing,
              backgroundColor: appTheme.colors.surface,
              paddingHorizontal: appTheme.ui.spacing * 1.5,
              paddingVertical: appTheme.ui.spacing,
              borderRadius: appTheme.ui.spacing,
            }}>
            <Text
              style={{
                color: appTheme.colors.onSurfaceVariant,
                fontSize: appTheme.ui.spacing * 1.8,
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
              {t('period')}:
            </Text>
            <Text
              style={{
                color: appTheme.colors.onSurface,
                fontSize: appTheme.ui.spacing * 2,
                fontWeight: '700',
              }}>
              {currentPeriod}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: appTheme.ui.spacing,
              paddingHorizontal: appTheme.ui.spacing * 1.5,
            }}>
            <Text
              style={{
                color: appTheme.colors.onSurfaceVariant,
                fontSize: appTheme.ui.spacing * 1.8,
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
              {t('percent')}:
            </Text>
            <Text
              style={{
                color: appTheme.colors.onSurface,
                fontSize: appTheme.ui.spacing * 2,
                fontWeight: '700',
              }}>
              {currentPercent}%
            </Text>
          </View>
        </View>
        <Button onPress={() => setIsExpanded(!isExpanded)} variant="outlined">
          <Text
            style={{
              fontSize: appTheme.ui.spacing * 2,
              fontWeight: '700',
              color: appTheme.colors.primary,
            }}>
            Change
          </Text>
        </Button>
      </View>
      {isExpanded && (
        <View style={{paddingTop: appTheme.ui.spacing}}>
          <View style={{gap: appTheme.ui.spacing}}>
            <Text
              style={{
                color: appTheme.colors.onSurface,
                fontWeight: '600',
              }}>
              {t('period')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: appTheme.ui.spacing,
              }}>
              {periodOptions.map(option => (
                <Button
                  key={option.value}
                  onPress={() => setCurrentPeriod(option.value)}
                  style={{
                    backgroundColor:
                      currentPeriod === option.value
                        ? appTheme.colors.primary
                        : appTheme.colors.surfaceVariant,
                  }}>
                  <Text
                    style={{
                      color: appTheme.colors.onSurface,
                      fontSize: appTheme.ui.spacing * 1.6,
                      fontWeight: '500',
                    }}>
                    {option.label}
                  </Text>
                </Button>
              ))}
            </View>
          </View>
          <View style={{gap: appTheme.ui.spacing}}>
            <Text
              style={{
                color: appTheme.colors.onSurface,
                fontSize: appTheme.ui.spacing * 1.8,
                fontWeight: '600',
              }}>
              {t('percent')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: appTheme.ui.spacing,
              }}>
              {percentOptions.map(option => (
                <Button
                  key={option.value}
                  onPress={() => setCurrentPercent(option.value)}
                  style={{
                    backgroundColor:
                      currentPercent === option.value
                        ? appTheme.colors.primary
                        : appTheme.colors.surfaceVariant,
                  }}>
                  <Text
                    style={{
                      color: appTheme.colors.onSurface,
                      fontSize: appTheme.ui.spacing * 1.6,
                      fontWeight: '500',
                    }}>
                    {option.label}
                  </Text>
                </Button>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ExpandableFilter;
