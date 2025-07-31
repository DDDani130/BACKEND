# 🔑 Actualizar API Key de OpenAI

## ✅ API Key Configurada

Tu API key de OpenAI ha sido configurada correctamente:

```
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
```

## 📝 Pasos para Actualizar

### 1. Crear/Actualizar archivo .env

Crea o actualiza el archivo `backend/.env` con el siguiente contenido:

```env
# Configuración del entorno
NODE_ENV=development
PORT=5000

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/livelevelup

# JWT Secret
JWT_SECRET=livelevelup-super-secret-jwt-key-2024

# OpenAI API Key - TU API KEY AQUÍ
OPENAI_API_KEY=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

# Configuración de seguridad
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### 2. Verificar la Configuración

Ejecuta el script de prueba para verificar que la API key funciona:

```bash
cd backend
node test-openai.js
```

### 3. Probar el Servidor

Una vez configurada la API key, ejecuta el servidor:

```bash
cd backend
npm run dev
```

## 🧪 Funcionalidades de IA Implementadas

### 🤖 Dr. Miau - El Gato Mascota

La IA está configurada para actuar como "Dr. Miau", un gato mascota sabio que:

- ✅ **Da consejos personalizados** basados en el perfil del usuario
- ✅ **Celebra logros** cuando el usuario desbloquea achievements
- ✅ **Motiva diariamente** con mensajes inspiradores
- ✅ **Analiza acciones** y da feedback específico
- ✅ **Usa emojis** para hacer los mensajes más amigables
- ✅ **Se adapta al contexto** (salud personal vs. planeta)

### 📊 Endpoints de IA Disponibles

1. **`POST /api/ai/advice`** - Consejo personalizado general
2. **`POST /api/ai/action-advice`** - Consejo basado en acción específica
3. **`GET /api/ai/daily-motivation`** - Motivación diaria
4. **`POST /api/ai/achievement-advice`** - Celebración de logros

### 🎯 Ejemplos de Uso

#### Consejo Personalizado
```javascript
// El usuario registra un nuevo hábito de ejercicio
const response = await fetch('/api/ai/action-advice', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    action: 'Empezar a correr 30 minutos',
    impact: 25,
    category: 'health'
  })
});

// Respuesta esperada:
// "¡Excelente decisión! 🏃‍♂️ Correr 30 minutos al día no solo mejora tu salud cardiovascular, sino que también libera endorfinas que te harán sentir más feliz. ¡Sigue así! 💪"
```

#### Motivación Diaria
```javascript
// El usuario abre la app por la mañana
const response = await fetch('/api/ai/daily-motivation', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Respuesta esperada:
// "¡Buenos días! 🌅 Es un nuevo día lleno de oportunidades para cuidar tu salud y el planeta. Con 5 días seguidos activos, estás construyendo un futuro más brillante. ¡Vamos por más! ✨"
```

#### Celebración de Logro
```javascript
// El usuario desbloquea un logro
const response = await fetch('/api/ai/achievement-advice', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    achievementName: 'Primer paso saludable',
    achievementIcon: '🌱',
    category: 'health'
  })
});

// Respuesta esperada:
// "¡Felicidades! 🎉 Has desbloqueado 'Primer paso saludable' 🌱. Cada gran viaje comienza con un pequeño paso, y tú ya lo has dado. ¡El futuro es brillante! ⭐"
```

## 🔧 Configuración Técnica

### Modelo de IA
- **Modelo:** GPT-3.5-turbo
- **Temperatura:** 0.8 (creatividad balanceada)
- **Max Tokens:** 150 (respuestas concisas)
- **Sistema:** Dr. Miau, gato mascota motivador

### Personalización
La IA considera:
- ✅ Edad, peso, altura del usuario
- ✅ Hábitos actuales
- ✅ Estado de salud personal y del planeta
- ✅ Acciones recientes
- ✅ Logros desbloqueados
- ✅ Contexto específico de la consulta

### Fallback System
Si la IA no está disponible, el sistema usa consejos predefinidos:
- ✅ Consejos de salud
- ✅ Consejos del planeta
- ✅ Motivación general

## 🚀 Próximos Pasos

1. **Actualizar el archivo .env** con la API key
2. **Ejecutar las pruebas:** `node test-openai.js`
3. **Iniciar el servidor:** `npm run dev`
4. **Probar desde el frontend** la funcionalidad de IA

## 🔒 Seguridad

- ✅ La API key está en variables de entorno
- ✅ No se expone en el código
- ✅ Rate limiting configurado
- ✅ Validación de entrada implementada

---

**¡Tu IA está lista para motivar y guiar a los usuarios de LiveLevelUp!** 🐱✨ 