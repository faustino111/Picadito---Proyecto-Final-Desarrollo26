// Validaciones para formularios de autenticación y datos de usuario

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  // Mínimo 6 caracteres según requerimientos estándar de Supabase
  return password.trim().length >= 6;
};

export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!isValidEmail(email)) {
    errors.email = 'Ingresa un correo electrónico válido';
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (!isValidPassword(password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (nombre, email, password, confirmPassword) => {
  const errors = {};

  if (!nombre || !nombre.trim()) {
    errors.nombre = 'El nombre completo es obligatorio';
  } else if (nombre.trim().length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!email || !email.trim()) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!isValidEmail(email)) {
    errors.email = 'Ingresa un correo electrónico con formato válido';
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (!isValidPassword(password)) {
    errors.password = 'La contraseña debe contener al menos 6 caracteres';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
