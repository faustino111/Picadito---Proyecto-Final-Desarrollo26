import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente Reutilizable 2: Input de texto con validación y visualizador de contraseñas
export const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error = null,
  containerStyle = null,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.focusedBorder,
          error ? styles.errorBorder : null,
        ]}
      >
        {iconName ? (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? '#ef4444' : isFocused ? '#16a34a' : '#94a3b8'}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.textInput}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#64748b"
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  focusedBorder: {
    borderColor: '#16a34a',
    backgroundColor: '#ffffff',
  },
  errorBorder: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  leftIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0f172a',
    fontSize: 15,
  },
  eyeButton: {
    padding: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 2,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginLeft: 4,
  },
});
