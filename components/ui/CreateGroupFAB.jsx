import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native'; // or any icon library
import { useTheme } from "@/theme/ThemeProvider";

export const CreateGroupFAB = ({ onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.fab, { backgroundColor: colors.accent }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Plus color="white" size={28} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
});