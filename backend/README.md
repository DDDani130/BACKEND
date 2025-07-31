# 🌱 LiveLevelUp Backend

> "Cada elección saludable que haces... impacta más allá de ti."

Backend completo para LiveLevelUp, una webapp interactiva que une el bienestar personal con la salud global del planeta.

## 🚀 Características

### 🧍 Salud y Bienestar Personal
- Sistema de avatares personalizables
- Gestión de hábitos y acciones de salud
- Cálculo automático de impacto en salud personal
- Sistema de logros y progreso
- Recomendaciones personalizadas basadas en IA

### 🌐 Calidad de Vida Mundial
- Simulación de impacto colectivo
- Gestión de hábitos ecológicos
- Cálculo de impacto en la salud del planeta
- Ranking de usuarios por impacto ambiental

### 🤖 IA Integrada
- Consejos personalizados del gato mascota "Dr. Miau"
- Análisis de hábitos y acciones del usuario
- Motivación diaria personalizada
- Respuestas contextuales a logros

### 👥 Comunidad
- Foro comunitario con categorías
- Sistema de likes y respuestas
- Búsqueda y filtros avanzados
- Estadísticas de participación

### 📚 Base de Datos Educativa
- Tips de salud y sostenibilidad
- Sistema de calificaciones
- Categorización por impacto
- Fuentes confiables verificadas

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **OpenAI API** - IA para consejos personalizados
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos
- **helmet** - Seguridad
- **cors** - Cross-Origin Resource Sharing

## 📋 Prerrequisitos

- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- Cuenta de OpenAI (para la API de IA)

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/livelevelup

# JWT
JWT_SECRET=tu-super-secret-jwt-key

# OpenAI API
OPENAI_API_KEY=tu-openai-api-key

# Server
PORT=5000
NODE_ENV=development
```

4. **Poblar la base de datos con datos iniciales**
```bash
npm run seed
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 API Endpoints

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

## 🗄️ Modelos de Datos

### User
- Información personal (edad, peso, altura, etc.)
- Estado de salud y planeta
- Hábitos y acciones
- Logros y progreso
- Avatar y personalizaciones
- Preferencias

### Tip
- Consejos de salud y sostenibilidad
- Impacto en salud y planeta
- Categorización y dificultad
- Sistema de calificaciones
- Fuentes verificadas

### Community
- Mensajes del foro
- Sistema de likes y respuestas
- Categorización
- Estadísticas de participación

## 🔒 Seguridad

- Autenticación JWT
- Encriptación de contraseñas con bcrypt
- Validación de datos con express-validator
- Headers de seguridad con helmet
- Rate limiting
- CORS configurado
- Manejo de errores centralizado

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## 📊 Monitoreo

- Logs con Morgan
- Manejo de errores centralizado
- Estadísticas de rendimiento
- Health checks

## 🚀 Despliegue

### Variables de entorno para producción:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/livelevelup
JWT_SECRET=super-secret-production-key
OPENAI_API_KEY=your-openai-api-key
PORT=5000
```

### Comandos de despliegue:
```bash
# Instalar dependencias de producción
npm ci --only=production

# Iniciar servidor
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🎯 Roadmap

- [ ] Sistema de notificaciones push
- [ ] Integración con wearables
- [ ] Gamificación avanzada
- [ ] Análisis de datos avanzado
- [ ] API pública para desarrolladores
- [ ] Integración con redes sociales
- [ ] Sistema de desafíos comunitarios
- [ ] Machine Learning para recomendaciones

---

**LiveLevelUp** - Transformando hábitos, transformando el mundo 🌱 