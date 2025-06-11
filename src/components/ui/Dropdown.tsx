import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  selectedValue: string;
  onSelect: (value: string) => void;
  items: DropdownItem[];
  placeholder?: string;
  buttonStyle?: object;
  buttonTextStyle?: object;
}

export const Dropdown = ({
  selectedValue,
  onSelect,
  items,
  placeholder = 'Select...',
  buttonStyle,
  buttonTextStyle,
}: DropdownProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={() => setShowDropdown(true)}>
        <Text style={[styles.buttonText, buttonTextStyle]}>
          {selectedItem?.label || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdownContainer}>
            <ScrollView style={styles.dropdownScroll}>
              {items.map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.dropdownItem,
                    item.value === selectedValue && styles.selectedItem,
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    setShowDropdown(false);
                  }}>
                  <Text
                    style={[
                      styles.dropdownItemText,
                      item.value === selectedValue && styles.selectedItemText,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
  },
  dropdownScroll: {
    maxHeight: 400,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedItem: {
    backgroundColor: '#f8f9fa',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedItemText: {
    color: '#000',
    fontWeight: '500',
  },
});
