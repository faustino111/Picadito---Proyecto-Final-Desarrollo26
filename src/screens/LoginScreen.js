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
import { validateLoginForm } from '../utils/validations';

export const LoginScreen = ({ navigation }) => {
  const { signIn, loginGuest, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);

  const handleLogin = async () => {
    setAuthError(null);
    const validation = validateLoginForm(email, password);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    const result = await signIn(email, password);
    if (!result.success) {
      setAuthError(result.error);
      Alert.alert('Error de Inicio de Sesión', result.error);
    }
  };

  const handleQuickDemo = async () => {
    setAuthError(null);
    setErrors({});
    await loginGuest();
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
        {/* Cabecera / Marca de Picadito! */}
        <View style={styles.brandContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="football" size={48} color="#16a34a" />
          </View>
          <Text style={styles.brandTitle}>Picadito!</Text>
          <Text style={styles.brandSubtitle}>
            Encontrá y alquilá tu cancha de fútbol ideal
          </Text>
        </View>

        {/* Tarjeta del Formulario de Login */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>

          {authError ? (
            <View style={styles.alertBox}>
              <Ionicons name="alert-circle" size={18} color="#b91c1c" />
              <Text style={styles.alertText}>{authError}</Text>
            </View>
          ) : null}

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

          <CustomButton
            title="Ingresar a la cancha"
            iconName="log-in-outline"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <CustomButton
            title="Entrar rápido (Demo / Prueba)"
            variant="outline"
            iconName="flash-outline"
            onPress={handleQuickDemo}
            disabled={loading}
            style={styles.demoButton}
          />

          {/* Enlace para ir al Registro */}
          <View style={styles.footerLinkRow}>
            <Text style={styles.footerText}>¿Todavía no tenés cuenta?</Text>
            <Pressable
              onPress={() => navigation.navigate('Register')}
              hitSlop={6}
            >
              <Text style={styles.registerLink}>Registrate acá</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'center',
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
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
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
  loginButton: {
    marginTop: 10,
  },
  demoButton: {
    marginTop: 6,
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
  registerLink: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 14,
  },
});
