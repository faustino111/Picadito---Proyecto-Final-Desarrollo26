import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { validateRegisterForm } from '../utils/validations';

export const RegisterScreen = ({ navigation }) => {
  const { signUp, loading } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);

  const handleRegister = async () => {
    setAuthError(null);
    const validation = validateRegisterForm(
      nombre,
      email,
      password,
      confirmPassword
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    const result = await signUp(nombre, email, password);
    if (!result.success) {
      setAuthError(result.error);
      Alert.alert('Error de Registro', result.error);
    } else {
      Alert.alert(
        '¡Registro Exitoso! ⚽',
        'Tu usuario ha sido creado correctamente. Ya podés disfrutar de Picadito!'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Botón Volver */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
          <Text style={styles.backText}>Volver al Login</Text>
        </Pressable>

        {/* Cabecera */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Crear Cuenta</Text>
          <Text style={styles.headerSubtitle}>
            Sumate a la comunidad de Picadito! y reservá tu cancha
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formCard}>
          {authError ? (
            <View style={styles.alertBox}>
              <Ionicons name="alert-circle" size={18} color="#b91c1c" />
              <Text style={styles.alertText}>{authError}</Text>
            </View>
          ) : null}

          <CustomInput
            label="Nombre y Apellido"
            value={nombre}
            onChangeText={(text) => {
              setNombre(text);
              if (errors.nombre) setErrors({ ...errors, nombre: null });
            }}
            placeholder="Ej: Lionel Messi"
            iconName="person-outline"
            autoCapitalize="words"
            error={errors.nombre}
          />

          <CustomInput
            label="Correo electrónico"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            placeholder="ejemplo@correo.com"
            iconName="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <CustomInput
            label="Contraseña"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            placeholder="Mínimo 6 caracteres"
            iconName="lock-closed-outline"
            secureTextEntry
            error={errors.password}
          />

          <CustomInput
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword)
                setErrors({ ...errors, confirmPassword: null });
            }}
            placeholder="Repetí tu contraseña"
            iconName="shield-checkmark-outline"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <CustomButton
            title="Registrarme en Picadito!"
            iconName="person-add-outline"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.footerLinkRow}>
            <Text style={styles.footerText}>¿Ya tenés una cuenta?</Text>
            <Pressable
              onPress={() => navigation.navigate('Login')}
              hitSlop={6}
            >
              <Text style={styles.loginLink}>Iniciá sesión</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 36,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  alertText: {
    color: '#b91c1c',
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
  registerButton: {
    marginTop: 14,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    gap: 6,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  loginLink: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 14,
  },
});
