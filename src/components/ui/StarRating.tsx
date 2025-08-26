import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 32,
  readonly = false,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const renderStar = (index: number) => {
    const isFilled = index < rating;
    const starName = isFilled ? 'star' : 'star-outline';
    const starColor = isFilled ? '#FFD700' : theme.colors.onSurfaceVariant;

    if (readonly) {
      return (
        <Icon
          key={index}
          name={starName}
          size={size}
          color={starColor}
          style={styles.star}
        />
      );
    }

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onRatingChange(index + 1)}
        style={styles.starButton}>
        <Icon name={starName} size={size} color={starColor} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.ui.spacing / 2,
    },
    star: {
      marginHorizontal: 2,
    },
    starButton: {
      padding: 4,
    },
  });

export default StarRating; 