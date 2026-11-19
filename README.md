# ⚽ Picadito! - Aplicación de Alquiler de Canchas de Fútbol (5, 7, 9 y 11)

**Picadito!** es una aplicación móvil desarrollada con **React Native, Expo y Supabase**, inspirada en la experiencia de usuario de plataformas de alojamiento como **Airbnb** o **Booking**, diseñada específicamente para la búsqueda, visualización y alquiler de canchas de fútbol.

---

## 📋 Cumplimiento de Requisitos del Proyecto (Pizarrón)

| Requisito del Pizarrón | Implementación en Picadito! |
| :--- | :--- |
| **Pantalla de Registro** | `RegisterScreen.js`: Registro de usuario con nombre, email y contraseña. |
| **Validaciones de Registro** | `src/utils/validations.js`: Validación de formato de email, contraseña mínima de 6 caracteres, confirmación de contraseñas y campos requeridos. |
| **Pantalla de Login** | `LoginScreen.js`: Inicio de sesión seguro con Supabase + botón de acceso rápido demo. |
| **Sesión Persistente** | `AuthContext.js` configurado con `@react-native-async-storage/async-storage` y el listener `onAuthStateChange` de Supabase. |
| **Logout** | Opción accesible tanto en el `Drawer` como en la pantalla `ProfileScreen`. |
| **Stack (sin sesión)** | `AuthStack.js`: Manejo de flujo entre Login y Registro. |
| **Drawer (con sesión)** | `DrawerNavigator.js`: Menú lateral con opciones a "Explorar Canchas", "Mapa Interactivo", "Mi Perfil" y "Cerrar Sesión". |
| **Tabs (2 pestañas)** | `TabNavigator.js`: Pestaña 1 (Canchas) y Pestaña 2 (Mapa). |
| **Stack para Detalle de Cancha** | `CanchasStack.js` -> `CanchaDetailScreen.js`: Vista previa con imagen, ubicación, para cuántos jugadores es (F5, F7, F9, F11), contacto del dueño (llamada directa y WhatsApp) y horarios de atención. |
| **Mapa con Marcadores** | `MapScreen.js` con `react-native-maps` y marcadores personalizados con precios. |
| **Ubicación y Permisos** | `expo-location` para solicitar permisos de geolocalización y centrar el mapa en la posición del usuario. |
| **Modal con Info e Imágenes** | `CustomModal.js`: Componente reutilizable para previsualización rápida y confirmación de reservas con fotos. |
| **3 Componentes Reutilizables** | `CustomButton.js`, `CustomInput.js`, `CustomModal.js` (+ `CanchaCard.js`). |
| **Restricciones Especiales** | **CERO `Touchable`** (todos los componentes interactivos usan `Pressable`) y **CERO `.map`** (renderizado de listas mediante `FlatList` y ciclos `for` tradicionales). |

---

## 📂 Estructura del Código

```text
picadito/
├── App.js                         # Entrada principal (SafeAreaProvider, AuthProvider, NavigationContainer)
├── app.json                       # Configuración de Expo y permisos de ubicación
├── package.json                   # Dependencias oficiales del proyecto
├── supabase_setup.sql             # Script SQL para tablas y políticas RLS de Supabase
└── src/
    ├── components/
    │   ├── CustomButton.js        # Reutilizable 1: Botón con variantes, loader y Pressable
    │   ├── CustomInput.js         # Reutilizable 2: Input con validación, iconos y toggle de clave
    │   ├── CustomModal.js         # Reutilizable 3: Modal versátil para info e imágenes
    │   └── CanchaCard.js          # Tarjeta de cancha estilo Airbnb con fotos y badges
    ├── context/
    │   └── AuthContext.js         # Contexto global de autenticación y sesión persistente
    ├── navigation/
    │   ├── AppNavigator.js        # Selector condicional según estado de sesión
    │   ├── AuthStack.js           # Stack sin sesión (Login y Registro)
    │   ├── CanchasStack.js        # Stack con sesión para navegar a CanchaDetailScreen
    │   ├── TabNavigator.js        # 2 pestañas inferiores (Explorar y Mapa)
    │   └── DrawerNavigator.js     # Menú lateral con sesión y logout
    ├── screens/
    │   ├── LoginScreen.js         # Pantalla de login
    │   ├── RegisterScreen.js      # Pantalla de registro con validaciones
    │   ├── HomeScreen.js          # Catálogo estilo Airbnb con filtros por tamaño (F5, F7, F9, F11)
    │   ├── CanchaDetailScreen.js  # Detalle completo con especificaciones y contacto
    │   ├── MapScreen.js           # Mapa con marcadores y geolocalización del usuario
    │   └── ProfileScreen.js       # Perfil del usuario y botón de logout
    ├── services/
    │   ├── supabase.js            # Cliente Supabase configurado con AsyncStorage
    │   └── canchasData.js         # Catálogo completo de canchas con fotos e info
    └── utils/
        └── validations.js         # Lógica pura de validaciones de formularios
```

---

## 🚀 Cómo Ejecutar la Aplicación

1. **Instalar las dependencias:**
   ```bash
   npx expo install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```

3. **Abrir en tu celular:**
   - Abre la app **Expo Go** en Android o la cámara en iOS y escanea el código QR generado en la terminal.

---

## ⚡ Conexión con Supabase (Opcional pero recomendado)

1. Crea una cuenta gratuita en [supabase.com](https://supabase.com).
2. Crea un nuevo proyecto.
3. En la sección **SQL Editor**, copia y ejecuta el contenido del archivo `supabase_setup.sql`.
4. Abre `src/services/supabase.js` y coloca tu `SUPABASE_URL` y tu `SUPABASE_ANON_KEY`.
*(Si no colocas las claves de inmediato, la app incluye un modo local persistente automático para que puedas probarla inmediatamente sin configuración previa).*
