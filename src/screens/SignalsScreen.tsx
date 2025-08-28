import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTheme} from '../context/ThemeContext';
import {useAppSelector} from '../store/store';
import {eventBus} from '../middleware/eventMiddleware';
import SelectableButton from '../components/ui/SelectableButton';
import {Dropdown} from '../components/ui/Dropdown';
import SignalItem from '../components/SignalItem';
import {t} from '../localization';
import {WatchlistPeriod, WatchlistPercent} from '../const/enums';
import ScreenHeader from '../components/ui/ScreenHeader';

const SignalsScreen: React.FC = () => {
  const {theme} = useTheme();
  const {
    allSignals,
    watchlistSignals,
    allSignalsLoading,
    watchlistSignalsLoading,
    hasMoreAll,
    hasMoreWatchlist,
    currentTab,
    filters,
  } = useAppSelector(state => state.signals);

  const [selectedPeriod, setSelectedPeriod] = useState(filters.period);
  const [selectedPercent, setSelectedPercent] = useState(filters.percent);

  const currentSignals = currentTab === 'all' ? allSignals : watchlistSignals;
  const isLoading =
    currentTab === 'all' ? allSignalsLoading : watchlistSignalsLoading;

  const periodOptions = [
    {label: '1m', value: WatchlistPeriod.MINUTE_1.toString()},
    {label: '2m', value: WatchlistPeriod.MINUTE_2.toString()},
    {label: '3m', value: WatchlistPeriod.MINUTE_3.toString()},
    {label: '5m', value: WatchlistPeriod.MINUTE_5.toString()},
    {label: '15m', value: WatchlistPeriod.MINUTE_15.toString()},
    {label: '30m', value: WatchlistPeriod.MINUTE_30.toString()},
    {label: '1h', value: WatchlistPeriod.HOUR_1.toString()},
    {label: '4h', value: WatchlistPeriod.HOUR_4.toString()},
  ];

  const percentOptions = [
    {label: '1%', value: WatchlistPercent.PERCENT_1.toString()},
    {label: '2%', value: WatchlistPercent.PERCENT_2.toString()},
    {label: '3%', value: WatchlistPercent.PERCENT_3.toString()},
    {label: '5%', value: WatchlistPercent.PERCENT_5.toString()},
    {label: '10%', value: WatchlistPercent.PERCENT_10.toString()},
    {label: '25%', value: WatchlistPercent.PERCENT_25.toString()},
    {label: '50%', value: WatchlistPercent.PERCENT_50.toString()},
    {label: '100%', value: WatchlistPercent.PERCENT_100.toString()},
  ];

  const handleFilterApply = () => {
    eventBus.emit('updateSignalsFilters', {
      period: selectedPeriod,
      percent: selectedPercent,
    });
    eventBus.emit('setAllSignalsLoading', true);
    eventBus.emit('setWatchlistSignalsLoading', true);

    if (currentTab === 'all') {
      eventBus.emit('loadAllSignals', {
        period: selectedPeriod,
        percent: selectedPercent,
        limit: 50,
        skip: 0,
        isRefresh: true,
      });
    } else {
      eventBus.emit('loadWatchlistSignals', {
        period: selectedPeriod,
        percent: selectedPercent,
        limit: 50,
        skip: 0,
        isRefresh: true,
      });
    }
  };

  const handleFilterClear = () => {
    setSelectedPeriod(WatchlistPeriod.MINUTE_5);
    setSelectedPercent(WatchlistPercent.PERCENT_3);
    eventBus.emit('updateSignalsFilters', {
      period: WatchlistPeriod.MINUTE_5,
      percent: WatchlistPercent.PERCENT_3,
    });
    eventBus.emit('setAllSignalsLoading', true);
    eventBus.emit('setWatchlistSignalsLoading', true);

    if (currentTab === 'all') {
      eventBus.emit('loadAllSignals', {
        period: WatchlistPeriod.MINUTE_5,
        percent: WatchlistPercent.PERCENT_3,
        limit: 50,
        skip: 0,
        isRefresh: true,
      });
    } else {
      eventBus.emit('loadWatchlistSignals', {
        period: WatchlistPeriod.MINUTE_5,
        percent: WatchlistPercent.PERCENT_3,
        limit: 50,
        skip: 0,
        isRefresh: true,
      });
    }
  };

  const handleTabSwitch = (tab: 'all' | 'watchlist') => {
    eventBus.emit('setCurrentTab', tab);
    eventBus.emit('setAllSignalsLoading', true);
    eventBus.emit('setWatchlistSignalsLoading', true);

    if (tab === 'all') {
      eventBus.emit('loadAllSignals', {
        period: filters.period,
        percent: filters.percent,
        limit: 50,
        skip: 0,
        isRefresh: true,
      });
    } else {
      eventBus.emit('loadWatchlistSignals', {
        period: filters.period,
        percent: filters.percent,
        limit: 50,
        skip: 0,
        isRefresh: true,
      });
    }
  };

  const handleLoadMore = () => {
    if (currentTab === 'all' && hasMoreAll && !allSignalsLoading) {
      eventBus.emit('setAllSignalsLoading', true);
      eventBus.emit('loadAllSignals', {
        period: filters.period,
        percent: filters.percent,
        limit: 50,
        skip: allSignals.length,
        isRefresh: false,
      });
    } else if (
      currentTab === 'watchlist' &&
      hasMoreWatchlist &&
      !watchlistSignalsLoading
    ) {
      eventBus.emit('setWatchlistSignalsLoading', true);
      eventBus.emit('loadWatchlistSignals', {
        period: filters.period,
        percent: filters.percent,
        limit: 50,
        skip: watchlistSignals.length,
        isRefresh: false,
      });
    }
  };

  const renderSignalItem = ({item}: {item: ISignal}) => (
    <SignalItem signal={item} />
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingContainer}>
        <Text
          style={[styles.loadingText, {color: theme.colors.onSurfaceVariant}]}>
          Loading...
        </Text>
      </View>
    );
  };

  const headerActions: any = [
    /*
    {
      iconName: 'chart-line',
      iconLibrary: 'MaterialCommunityIcons' as const,
      onPress: () => {
        // Add analytics action here
        console.log('Analytics pressed');
      },
    },
    {
      iconName: 'refresh',
      iconLibrary: 'MaterialCommunityIcons' as const,
      onPress: () => {
        // Add refresh action here
        console.log('Refresh pressed');
      },
    },
    */
  ];

  const styles = style(theme);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <ScreenHeader title={t('signals')} actions={headerActions} />

      {/* Filters */}
      <View
        style={[
          styles.filtersContainer,
          {backgroundColor: theme.colors.surface},
        ]}>
        <View style={styles.filterRow}>
          <View style={styles.filterInput}>
            <Text
              style={[
                styles.filterLabel,
                {color: theme.colors.onSurfaceVariant},
              ]}>
              Period
            </Text>
            <Dropdown
              items={periodOptions}
              selectedValue={selectedPeriod.toString()}
              onSelect={value => setSelectedPeriod(parseInt(value))}
              placeholder="Select period"
            />
          </View>

          <View style={styles.filterInput}>
            <Text
              style={[
                styles.filterLabel,
                {color: theme.colors.onSurfaceVariant},
              ]}>
              Percent
            </Text>
            <Dropdown
              items={percentOptions}
              selectedValue={selectedPercent.toString()}
              onSelect={value => setSelectedPercent(parseInt(value))}
              placeholder="Select percent"
            />
          </View>
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={handleFilterApply}>
            <Text
              style={[
                styles.filterButtonText,
                {color: theme.colors.onSurface},
              ]}>
              Apply
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
            onPress={handleFilterClear}>
            <Text
              style={[
                styles.filterButtonText,
                {color: theme.colors.onSurface},
              ]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Buttons */}
      <View
        style={[styles.tabContainer, {backgroundColor: theme.colors.surface}]}>
        <SelectableButton
          title="All"
          isSelected={currentTab === 'all'}
          onPress={() => handleTabSwitch('all')}
        />
        <SelectableButton
          title="Watchlist"
          isSelected={currentTab === 'watchlist'}
          onPress={() => handleTabSwitch('watchlist')}
        />
      </View>

      {/* Signals List */}
      <FlashList
        data={currentSignals}
        renderItem={renderSignalItem}
        keyExtractor={item => item._id}
        estimatedItemSize={120}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) => ({
  container: {
    flex: 1,
  },
  filtersContainer: {
    padding: theme.ui.spacing * 2,
    borderBottomWidth: theme.ui.borderWidth * 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  filterRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: theme.ui.spacing * 1.5,
  },
  filterInput: {
    flex: 1,
    marginHorizontal: theme.ui.spacing * 0.5,
  },
  filterLabel: {
    fontSize: theme.ui.fontSize * 0.75,
    marginBottom: theme.ui.spacing * 0.5,
  },
  filterButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: theme.ui.spacing * 0.5,
    paddingVertical: theme.ui.spacing,
    borderRadius: theme.ui.radius,
    alignItems: 'center' as const,
  },
  filterButtonText: {
    fontSize: theme.ui.fontSize * 0.875,
    fontWeight: '500' as const,
  },
  tabContainer: {
    flexDirection: 'row' as const,
    padding: theme.ui.spacing * 2,
    gap: theme.ui.spacing * 1.5,
    borderBottomWidth: theme.ui.borderWidth * 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  listContainer: {
    paddingBottom: 100,
  },
  loadingContainer: {
    padding: theme.ui.spacing * 2,
    alignItems: 'center' as const,
  },
  loadingText: {
    fontSize: theme.ui.fontSize * 0.875,
  },
});

export default SignalsScreen;
