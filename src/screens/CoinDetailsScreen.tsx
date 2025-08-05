import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../context/ThemeContext';
import {useAppSelector} from '../store/store';
import {eventBus} from '../middleware/eventMiddleware';
import {WebView} from 'react-native-webview';
import SignalItem from '../components/SignalItem';
import {t} from '../localization';
import {useNavigation, useRoute} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const CoinDetailsScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {coin} = route.params as {coin: string};

  const {coinSignals, loading, hasMore} = useAppSelector(
    state => state.coinDetails,
  );

  const [chartSymbol, setChartSymbol] = useState(coin);

  useEffect(() => {
    // Load initial signals for the coin
    eventBus.emit('loadCoinSignals', {
      coin,
      limit: 50,
      skip: 0,
      isRefresh: true,
    });
  }, [coin]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      eventBus.emit('loadCoinSignals', {
        coin,
        limit: 50,
        skip: coinSignals.length,
        isRefresh: false,
      });
    }
  };

  const renderSignalItem = ({item}: {item: ISignal}) => (
    <SignalItem signal={item} />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <Text
          style={[styles.loadingText, {color: theme.colors.onSurfaceVariant}]}>
          Loading...
        </Text>
      </View>
    );
  };

  const tradingViewHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: ${theme.colors.background};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .tradingview-widget-container {
          width: 100%;
        }
        .tradingview-widget-container__widget {
          height: 100%;
          width: 100%;
        }
        .tradingview-widget-copyright {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${theme.colors.background};
        }
        .tradingview-widget-copyright a {
          color: ${theme.colors.primary};
          text-decoration: none;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <div class="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/symbols/BINANCE-${chartSymbol}/" rel="noopener nofollow" target="_blank">
            <span class="blue-text">${chartSymbol} chart by TradingView</span>
          </a>
        </div>
        <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
        {
          "allow_symbol_change": false,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": true,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "5",
          "locale": "en",
          "save_image": false,
          "style": "1",
          "symbol": "BINANCE:${chartSymbol}",
          "theme": "dark",
          "timezone": "Etc/UTC",
          "backgroundColor": "${theme.colors.background}",
          "gridColor": "rgba(242, 242, 242, 0.06)",
          "watchlist": [],
          "withdateranges": false,
          "range": "YTD",
          "compareSymbols": [],
          "studies": [],
          "width": "100%",
          "height": 250
        }
        </script>
      </div>
    </body>
    </html>
  `;

  const styles = style(theme);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.colors.onSurface}]}>
          {coin}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Chart Container */}
      <View style={styles.chartContainer}>
        <WebView
          source={{html: tradingViewHtml}}
          style={styles.chart}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      {/* Signals List */}
      <FlashList
        data={coinSignals}
        renderItem={renderSignalItem}
        keyExtractor={item => item._id}
        estimatedItemSize={120}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
        style={styles.signalsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) => ({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: theme.ui.spacing * 2,
    paddingVertical: theme.ui.spacing * 2,
    borderBottomWidth: theme.ui.borderWidth * 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: theme.ui.spacing * 0.5,
  },
  title: {
    flex: 1,
    fontSize: theme.ui.fontSize * 1.5,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },
  headerRight: {
    width: 40,
  },
  chartContainer: {
    backgroundColor: theme.colors.background,
    height: 220,
  },
  chart: {
    flex: 1,
  },
  signalsList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 100,
    paddingTop: theme.ui.spacing,
  },
  loadingContainer: {
    padding: theme.ui.spacing * 2,
    alignItems: 'center' as const,
  },
  loadingText: {
    fontSize: theme.ui.fontSize * 0.875,
  },
});

export default CoinDetailsScreen;
