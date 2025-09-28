import React, {useState} from 'react';
import {View} from 'react-native';
import {Button} from './ui/Button';
import {Text} from './ui/Text';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import {t} from '../localization';
import {WatchlistPeriod, WatchlistPercent} from '../const/enums';
import {eventBus} from '../middleware/eventMiddleware';
import {useAppSelector} from '../store/store';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_NAMES} from '../const/routeNames';

type Option = {label: string; value: string; premium?: boolean};

const periodOptions: Option[] = [
  {label: '1m', value: WatchlistPeriod.MINUTE_1.toString(), premium: true},
  {label: '2m', value: WatchlistPeriod.MINUTE_2.toString(), premium: true},
  {label: '3m', value: WatchlistPeriod.MINUTE_3.toString(), premium: true},
  {label: '5m', value: WatchlistPeriod.MINUTE_5.toString()},
  {label: '15m', value: WatchlistPeriod.MINUTE_15.toString()},
  {label: '30m', value: WatchlistPeriod.MINUTE_30.toString()},
  {label: '1h', value: WatchlistPeriod.HOUR_1.toString()},
  {label: '4h', value: WatchlistPeriod.HOUR_4.toString()},
];

const percentOptions: Option[] = [
  {label: '1%', value: WatchlistPercent.PERCENT_1.toString(), premium: true},
  {label: '2%', value: WatchlistPercent.PERCENT_2.toString(), premium: true},
  {label: '3%', value: WatchlistPercent.PERCENT_3.toString(), premium: true},
  {label: '5%', value: WatchlistPercent.PERCENT_5.toString()},
  {label: '10%', value: WatchlistPercent.PERCENT_10.toString()},
  {label: '25%', value: WatchlistPercent.PERCENT_25.toString()},
  {label: '50%', value: WatchlistPercent.PERCENT_50.toString()},
  {label: '100%', value: WatchlistPercent.PERCENT_100.toString()},
];

const ExpandableFilter = () => {
  const {theme: appTheme} = useAppTheme();
  const styles = style(appTheme);
  const [isExpanded, setIsExpanded] = useState(false);
  const {period, percent, loading} = useAppSelector(state => state.watchlist);
  const isUserPremium = useAppSelector(state => state.auth.isPremium);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {loading ? (
          <View style={{flexDirection: 'column', gap: appTheme.ui.spacing}}>
            <View
              style={{
                backgroundColor: appTheme.colors.onSurface,
                width: 100,
                height: 30,
                borderRadius: appTheme.ui.radius,
              }}
            />
            <View
              style={{
                backgroundColor: appTheme.colors.onSurface,
                width: 100,
                height: 30,
                borderRadius: appTheme.ui.radius,
              }}
            />
          </View>
        ) : (
          <View style={styles.periodPercentCol}>
            <View style={styles.periodRow}>
              <Text style={styles.periodLabel}>{t('period')}:</Text>
              <Text style={styles.periodValue}>{period}</Text>
            </View>
            <View style={styles.percentRow}>
              <Text style={styles.percentLabel}>{t('percent')}:</Text>
              <Text style={styles.percentValue}>{percent}%</Text>
            </View>
          </View>
        )}
        <Button onPress={() => setIsExpanded(!isExpanded)} variant="outlined">
          <Text style={styles.changeButtonText}>Change</Text>
        </Button>
      </View>
      {isExpanded && (
        <View style={styles.expandedContainer}>
          <View style={styles.expandedSection}>
            <Text style={styles.expandedTitle}>{t('period')}</Text>
            <View style={styles.optionsRow}>
              {periodOptions.map(option => (
                <Button
                  key={option.value}
                  onPress={() => {
                    eventBus.emit('periodChanged', option.value);
                    if (option.premium && !isUserPremium) {
                      navigation.navigate(ROUTE_NAMES.PAYWALL);
                    }
                  }}
                  style={{
                    backgroundColor:
                      period === Number(option.value)
                        ? appTheme.colors.brand
                        : appTheme.colors.onSurface,
                    marginRight: appTheme.ui.spacing / 2,
                    marginBottom: appTheme.ui.spacing / 2,
                  }}>
                  <Text style={styles.optionText}>{option.label}</Text>
                </Button>
              ))}
            </View>
          </View>
          <View style={styles.expandedSection}>
            <Text style={styles.expandedTitle}>{t('percent')}</Text>
            <View style={styles.optionsRow}>
              {percentOptions.map(option => (
                <Button
                  key={option.value}
                  onPress={() => {
                    eventBus.emit('percentChanged', option.value);
                    if (option.premium && !isUserPremium) {
                      navigation.navigate(ROUTE_NAMES.PAYWALL);
                    }
                  }}
                  style={{
                    backgroundColor:
                      percent === Number(option.value)
                        ? appTheme.colors.brand
                        : appTheme.colors.onSurface,
                    marginRight: appTheme.ui.spacing / 2,
                    marginBottom: appTheme.ui.spacing / 2,
                  }}>
                  <Text style={styles.optionText}>{option.label}</Text>
                </Button>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const style = (appTheme: any) => ({
  container: {
    paddingHorizontal: appTheme.ui.spacing * 2,
    backgroundColor: appTheme.colors.surface,
  },
  headerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: appTheme.ui.spacing,
  },
  periodPercentCol: {},
  periodRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: appTheme.colors.surface,
    paddingHorizontal: appTheme.ui.spacing * 1.5,
    paddingVertical: appTheme.ui.spacing,
    borderRadius: appTheme.ui.spacing,
    marginBottom: appTheme.ui.spacing / 2,
  },
  periodLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.ui.spacing * 1.8,
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginRight: appTheme.ui.spacing / 2,
  },
  periodValue: {
    color: appTheme.colors.text,
    fontSize: appTheme.ui.spacing * 2,
    fontWeight: '700' as const,
  },
  percentRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: appTheme.ui.spacing * 1.5,
    marginBottom: appTheme.ui.spacing / 2,
  },
  percentLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.ui.spacing * 1.8,
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginRight: appTheme.ui.spacing / 2,
  },
  percentValue: {
    color: appTheme.colors.text,
    fontSize: appTheme.ui.spacing * 2,
    fontWeight: '700' as const,
  },
  changeButtonText: {
    fontSize: appTheme.ui.spacing * 2,
    fontWeight: '700' as const,
    color: appTheme.colors.text,
  },
  expandedContainer: {
    paddingTop: appTheme.ui.spacing,
  },
  expandedSection: {
    marginBottom: appTheme.ui.spacing,
  },
  expandedTitle: {
    color: appTheme.colors.text,
    fontWeight: '600' as const,
    fontSize: appTheme.ui.spacing * 1.8,
    marginBottom: appTheme.ui.spacing / 2,
  },
  optionsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  optionText: {
    color: appTheme.colors.text,
    fontSize: appTheme.ui.spacing * 1.6,
    fontWeight: '500' as const,
  },
});

export default ExpandableFilter;
