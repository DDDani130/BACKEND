# 🚀 Instrucciones para Ejecutar el Backend de LiveLevelUp

## ✅ Estado del Proyecto

El backend de LiveLevelUp está **COMPLETAMENTE DESARROLLADO** con todas las funcionalidades solicitadas:

### 🎯 Funcionalidades Implementadas

#### 🧍 Salud y Bienestar Personal
- ✅ Sistema de avatares personalizables
- ✅ Gestión de hábitos y acciones de salud
- ✅ Cálculo automático de impacto en salud personal
- ✅ Sistema de logros y progreso
- ✅ Recomendaciones personalizadas basadas en IA

#### 🌐 Calidad de Vida Mundial
- ✅ Simulación de impacto colectivo
- ✅ Gestión de hábitos ecológicos
- ✅ Cálculo de impacto en la salud del planeta
- ✅ Ranking de usuarios por impacto ambiental

#### 🤖 IA Integrada
- ✅ Consejos personalizados del gato mascota "Dr. Miau"
- ✅ Análisis de hábitos y acciones del usuario
- ✅ Motivación diaria personalizada
- ✅ Respuestas contextuales a logros
- ✅ API de OpenAI configurada y funcionando

#### 👥 Comunidad
- ✅ Foro comunitario con categorías
- ✅ Sistema de likes y respuestas
- ✅ Búsqueda y filtros avanzados
- ✅ Estadísticas de participación

#### 📚 Base de Datos Educativa
- ✅ Tips de salud y sostenibilidad
- ✅ Sistema de calificaciones
- ✅ Categorización por impacto
- ✅ Fuentes confiables verificadas

## 🔧 Configuración del Entorno

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (opcional - el backend funciona sin MongoDB para pruebas)

### Variables de Entorno Configuradas
- ✅ JWT_SECRET configurado
- ✅ OPENAI_API_KEY configurado (con tu API key)
- ✅ Puerto 5000 configurado
- ✅ CORS configurado para desarrollo

## 🚀 Opciones de Ejecución

### Opción 1: Servidor Completo (Recomendado)
```bash
cd backend
npm install
npm run dev
```

### Opción 2: Servidor Básico (Para Pruebas Rápidas)
```bash
cd backend
node server-basic.js
```

### Opción 3: Servidor Simplificado
```bash
cd backend
node server-simple.js
```

## 📊 Endpoints Disponibles

### 🔐 Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/updatepassword` - Actualizar contraseña
- `GET /api/auth/verify` - Verificar token

### 👤 Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/preferences` - Actualizar preferencias
- `GET /api/users/progress` - Obtener progreso
- `GET /api/users/achievements` - Obtener logros
- `GET /api/users/stats` - Obtener estadísticas
- `DELETE /api/users/account` - Eliminar cuenta
- `GET /api/users/leaderboard` - Ranking de usuarios

### 🎨 Avatar
- `GET /api/avatar` - Obtener avatar
- `PUT /api/avatar/clothing` - Actualizar ropa
- `PUT /api/avatar/customizations` - Actualizar personalizaciones
- `DELETE /api/avatar/clothing/:category` - Remover item
- `GET /api/avatar/clothing-items` - Items disponibles
- `GET /api/avatar/colors` - Colores disponibles
- `POST /api/avatar/reset` - Resetear avatar
- `GET /api/avatar/full` - Avatar completo

### 🏥 Salud
- `GET /api/health/status` - Estado de salud
- `POST /api/health/habits` - Agregar hábito
- `DELETE /api/health/habits/:id` - Remover hábito
- `POST /api/health/actions` - Agregar acción
- `DELETE /api/health/actions/:id` - Remover acción
- `PUT /api/health/profile` - Actualizar perfil
- `GET /api/health/stats` - Estadísticas

### 🌍 Planeta
- `GET /api/planet/status` - Estado del planeta
- `POST /api/planet/habits` - Agregar hábito
- `DELETE /api/planet/habits/:id` - Remover hábito
- `POST /api/planet/actions` - Agregar acción
- `DELETE /api/planet/actions/:id` - Remover acción
- `POST /api/planet/simulate-collective` - Simular impacto colectivo
- `GET /api/planet/stats` - Estadísticas
- `GET /api/planet/leaderboard` - Ranking planetario

### 🤖 IA
- `POST /api/ai/advice` - Consejo personalizado
- `POST /api/ai/action-advice` - Consejo por acción
- `GET /api/ai/daily-motivation` - Motivación diaria
- `POST /api/ai/achievement-advice` - Consejo por logro

### 👥 Comunidad
- `GET /api/community/messages` - Obtener mensajes
- `POST /api/community/messages` - Crear mensaje
- `GET /api/community/messages/:id` - Obtener mensaje específico
- `PUT /api/community/messages/:id` - Actualizar mensaje
- `DELETE /api/community/messages/:id` - Eliminar mensaje
- `POST /api/community/messages/:id/like` - Dar like
- `POST /api/community/messages/:id/reply` - Responder
- `GET /api/community/search` - Buscar mensajes
- `GET /api/community/popular` - Mensajes populares
- `GET /api/community/stats` - Estadísticas

### 🏆 Logros
- `GET /api/achievements` - Obtener logros
- `POST /api/achievements` - Agregar logro
- `POST /api/achievements/check` - Verificar logros
- `GET /api/achievements/definitions` - Definiciones

### 💡 Tips
- `GET /api/tips` - Obtener tips
- `GET /api/tips/random` - Tip aleatorio
- `GET /api/tips/:id` - Obtener tip específico
- `GET /api/tips/impact/:type` - Tips por impacto
- `GET /api/tips/featured` - Tips destacados
- `GET /api/tips/search` - Buscar tips
- `POST /api/tips/:id/rate` - Calificar tip
- `GET /api/tips/categories` - Categorías
- `GET /api/tips/stats` - Estadísticas

## 🧪 Pruebas

### Script de Pruebas Automáticas
```bash
cd backend
node test-simple.js
```

### Prueba Manual con curl
```bash
# Health check
curl http://localhost:5000/api/health-check

# Obtener tips
curl http://localhost:5000/api/tips

# Registrar usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123!"}'
```

## 🔒 Seguridad Implementada

- ✅ Autenticación JWT
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Validación de datos con express-validator
- ✅ Headers de seguridad con helmet
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Manejo de errores centralizado

## 📊 Base de Datos

### Modelos Implementados
- ✅ User (Usuario completo con perfil, salud, planeta, avatar)
- ✅ Tip (Consejos con categorización y calificaciones)
- ✅ Community (Mensajes del foro con likes y respuestas)

### Datos Iniciales
- ✅ 17 tips de salud y sostenibilidad
- ✅ Categorías y subcategorías
- ✅ Sistema de logros automático

## 🎯 Integración con Frontend

El backend está completamente preparado para integrarse con tu frontend React. La configuración de la API en `LiveLevelUpReact/src/config/api.js` ya está lista para usar.

## 🚀 Despliegue

### Para Producción
1. Configurar variables de entorno de producción
2. Usar MongoDB Atlas o servidor MongoDB
3. Configurar dominio y SSL
4. Ejecutar `npm start`

### Para Desarrollo
1. Ejecutar `npm run dev`
2. El servidor se reiniciará automáticamente con cambios
3. Logs detallados en consola

## ✅ Resumen

**¡El backend está 100% completo y funcional!**

- ✅ Todas las funcionalidades solicitadas implementadas
- ✅ IA integrada con OpenAI funcionando
- ✅ Base de datos con datos iniciales
- ✅ API RESTful completa
- ✅ Seguridad implementada
- ✅ Documentación completa
- ✅ Scripts de prueba incluidos

**Para ejecutar:**
```bash
cd backend
npm install
npm run dev
```

**El servidor estará disponible en:** `http://localhost:5000/api`

---

**LiveLevelUp Backend** - ¡Listo para transformar hábitos y el mundo! 🌱 