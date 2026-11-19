import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext({});

const LOCAL_SESSION_KEY = '@picadito_user_session';
const TURNOS_STORAGE_PREFIX = '@picadito_turnos_';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [turnos, setTurnos] = useState([]);

  // Helper para la clave de almacenamiento de turnos por usuario
  const getTurnosStorageKey = useCallback((currentUser) => {
    const userId = currentUser?.id || currentUser?.email || 'guest';
    return `${TURNOS_STORAGE_PREFIX}${userId}`;
  }, []);

  // Cargar turnos del usuario actual desde AsyncStorage (memorizada con useCallback)
  const loadTurnos = useCallback(async (currentUser) => {
    try {
      if (!currentUser) {
        setTurnos([]);
        return;
      }
      const key = getTurnosStorageKey(currentUser);
      const data = await AsyncStorage.getItem(key);
      if (data) {
        setTurnos(JSON.parse(data));
      } else {
        setTurnos([]);
      }
    } catch (err) {
      console.warn('Error cargando turnos guardados:', err);
      setTurnos([]);
    }
  }, [getTurnosStorageKey]);

  // Guardar un nuevo turno (persiste por usuario)
  const addTurno = async (turnoData) => {
    try {
      const nuevoTurno = {
        id: 'turno-' + Date.now(),
        fechaCreacion: new Date().toISOString(),
        ...turnoData,
      };
      const updatedTurnos = [nuevoTurno, ...turnos];
      setTurnos(updatedTurnos);

      if (user) {
        const key = getTurnosStorageKey(user);
        await AsyncStorage.setItem(key, JSON.stringify(updatedTurnos));
      }
      return { success: true, turno: nuevoTurno };
    } catch (err) {
      console.warn('Error guardando turno:', err);
      return { success: false, error: err.message };
    }
  };

  // Cancelar / eliminar un turno
  const removeTurno = async (turnoId) => {
    try {
      const updatedTurnos = turnos.filter((t) => t.id !== turnoId);
      setTurnos(updatedTurnos);
      if (user) {
        const key = getTurnosStorageKey(user);
        await AsyncStorage.setItem(key, JSON.stringify(updatedTurnos));
      }
      return { success: true };
    } catch (err) {
      console.warn('Error eliminando turno:', err);
      return { success: false, error: err.message };
    }
  };

  // Efecto cuando cambia el usuario autenticado: recargar sus turnos
  useEffect(() => {
    if (user) {
      loadTurnos(user);
    } else {
      setTurnos([]);
    }
  }, [user, loadTurnos]);

  // Restaurar sesión persistente al abrir la aplicación
  useEffect(() => {
    let authListener = null;

    const restoreSession = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase.auth.getSession();
          if (data && data.session) {
            setSession(data.session);
            setUser(data.session.user);
          }

          const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, currentSession) => {
              setSession(currentSession);
              const currentUser = currentSession ? currentSession.user : null;
              setUser(currentUser);
            }
          );
          authListener = listener;
        } else {
          // Modo local persistente mediante AsyncStorage
          const stored = await AsyncStorage.getItem(LOCAL_SESSION_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setSession({ user: parsed });
          }
        }
      } catch (err) {
        console.warn('Error restaurando sesión persistente:', err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Iniciar sesión
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setUser(data.user);
        setSession(data.session);
        return { success: true, user: data.user };
      } else {
        // Fallback local persistente
        const mockUser = {
          id: 'user-' + Date.now(),
          email: email.trim(),
          user_metadata: {
            full_name: email.split('@')[0],
          },
          created_at: new Date().toISOString(),
        };
        await AsyncStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
        setSession({ user: mockUser });
        return { success: true, user: mockUser };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  // Registrar usuario
  const signUp = async (nombre, email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: nombre.trim(),
            },
          },
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          setSession(data.session);
        }
        return { success: true, user: data.user };
      } else {
        const mockUser = {
          id: 'user-' + Date.now(),
          email: email.trim(),
          user_metadata: {
            full_name: nombre.trim(),
          },
          created_at: new Date().toISOString(),
        };
        await AsyncStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
        setSession({ user: mockUser });
        return { success: true, user: mockUser };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Error al registrar usuario' };
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
      setUser(null);
      setSession(null);
      setTurnos([]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Error al cerrar sesión' };
    } finally {
      setLoading(false);
    }
  };

  // Demo / Acceso rápido
  const loginGuest = async () => {
    return signIn('jugador@picadito.com', '123456');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        loginGuest,
        turnos,
        addTurno,
        removeTurno,
        loadTurnos,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
