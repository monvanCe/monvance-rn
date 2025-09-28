/**
 * Formats volume values to Million (M) or Billion (B) format
 * @param volume - Raw volume string
 * @returns Formatted volume string
 */
export const formatVolume = (volume: string): string => {
  const numVolume = parseFloat(volume);

  if (numVolume >= 1000000000) {
    // Billion format
    const billions = (numVolume / 1000000000).toFixed(1);
    return billions.endsWith('.0')
      ? billions.slice(0, -2) + 'B'
      : billions + 'B';
  } else if (numVolume >= 1000000) {
    // Million format
    const millions = (numVolume / 1000000).toFixed(1);
    return millions.endsWith('.0')
      ? millions.slice(0, -2) + 'M'
      : millions + 'M';
  } else {
    // For smaller volumes, show as K (thousands)
    const thousands = (numVolume / 1000).toFixed(1);
    return thousands.endsWith('.0')
      ? thousands.slice(0, -2) + 'K'
      : thousands + 'K';
  }
};

/**
 * Formats price values with appropriate decimal places based on price range
 * @param price - Raw price string
 * @returns Formatted price string
 */
export const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price);

  if (numPrice >= 1000) {
    // For prices >= 1000, show 2 decimal places
    return numPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (numPrice >= 1) {
    // For prices 1-999, show 2-4 decimal places
    return numPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  } else if (numPrice >= 0.01) {
    // For prices 0.01-0.99, show 4-6 decimal places
    return numPrice.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  } else if (numPrice >= 0.0001) {
    // For prices 0.0001-0.0099, show 6-8 decimal places
    return numPrice.toLocaleString(undefined, {
      minimumFractionDigits: 6,
      maximumFractionDigits: 8,
    });
  } else {
    // For very small prices < 0.0001, show up to 10 decimal places
    return numPrice.toLocaleString(undefined, {
      minimumFractionDigits: 8,
      maximumFractionDigits: 10,
    });
  }
};
