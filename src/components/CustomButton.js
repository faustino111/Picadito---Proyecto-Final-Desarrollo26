import React from 'react';
import { StyleSheet, Text, ActivityIndicator, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente Reutilizable 1: Botón personalizable con estados táctiles usando Pressable
export const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  loading = false,
  disabled = false,
  iconName = null,
  style = null,
  textStyle = null,
}) => {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  const getBackgroundColor = (pressed) => {
    if (disabled || loading) return '#cbd5e1';
    if (isOutline) return pressed ? '#f1f5f9' : 'transparent';
    if (isSecondary) return pressed ? '#0284c7' : '#0ea5e9';
    if (isDanger) return pressed ? '#dc2626' : '#ef4444';
    // primary por defecto (Verde césped fútbol)
    return pressed ? '#15803d' : '#16a34a';
  };

  const getTextColor = () => {
    if (disabled || loading) return '#64748b';
    if (isOutline) return '#16a34a';
    return '#ffffff';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.baseButton,
        {
          backgroundColor: getBackgroundColor(pressed),
          borderColor: isOutline ? '#16a34a' : 'transparent',
          borderWidth: isOutline ? 1.5 : 0,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {iconName ? (
            <Ionicons
              name={iconName}
              size={18}
              color={getTextColor()}
              style={styles.icon}
            />
          ) : null}
          <Text style={[styles.baseText, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  baseText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
