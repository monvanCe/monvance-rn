import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import {useTheme} from '../../context/ThemeContext';
import {Text} from './Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface WebViewProps {
  uri: string;
  title: string;
  onClose: () => void;
}

const WebView: React.FC<WebViewProps> = ({uri, title, onClose}) => {
  const {theme} = useTheme();
  const styles = style(theme);

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.loadingText, {color: theme.colors.onSurface}]}>
        Loading...
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.colors.onSurface}]}>
          {title}
        </Text>
        <View style={styles.placeholder} />
      </View>
      <RNWebView
        source={{uri}}
        style={styles.webview}
        renderLoading={renderLoading}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.ui.spacing * 2,
      paddingVertical: theme.ui.spacing,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surface,
    },
    closeButton: {
      padding: theme.ui.spacing,
    },
    title: {
      fontSize: theme.ui.fontSize * 1.125,
      fontWeight: '600',
      flex: 1,
      textAlign: 'center',
    },
    placeholder: {
      width: 48,
    },
    webview: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      marginTop: theme.ui.spacing,
      fontSize: theme.ui.fontSize,
    },
  });

export default WebView;
