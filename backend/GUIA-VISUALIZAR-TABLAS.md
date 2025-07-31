# 🔍 Guía Completa: Visualizar Tablas en MongoDB Compass

## ✅ Estado Actual de tu Base de Datos

**¡Tu base de datos está funcionando perfectamente!** Aquí tienes el resumen:

### 📊 Estadísticas Actuales:
- 👥 **Usuarios registrados:** 0 (se crearán cuando uses la app)
- 💡 **Tips disponibles:** 17 (ya cargados)
- 💬 **Mensajes en comunidad:** 0 (se crearán cuando uses la app)
- 📁 **Colecciones:** 3 (users, tips, community)

---

## 🎯 Cómo Visualizar las Tablas en MongoDB Compass

### 1. **Abrir MongoDB Compass**

1. **Busca MongoDB Compass** en tu menú de inicio
2. **Haz clic** para abrirlo
3. **Conecta** usando: `mongodb://localhost:27017`

### 2. **Navegar a tu Base de Datos**

1. **En la lista de bases de datos**, busca `livelevelup`
2. **Haz clic** en `livelevelup`
3. **Verás las 3 colecciones:**
   - 📁 `users` (usuarios)
   - 📁 `tips` (consejos)
   - 📁 `community` (mensajes)

### 3. **Explorar Cada Colección**

#### 📁 **Colección: users**
- **Haz clic** en `users`
- **Verás:** Lista de usuarios registrados
- **Campos principales:**
  - `username`: Nombre del usuario
  - `email`: Email del usuario
  - `profile`: Información personal
  - `health`: Estado de salud
  - `planet`: Estado del planeta
  - `achievements`: Logros desbloqueados

#### 📁 **Colección: tips**
- **Haz clic** en `tips`
- **Verás:** Los 17 consejos disponibles
- **Campos principales:**
  - `title`: Título del consejo
  - `content`: Contenido del consejo
  - `category`: salud o planeta
  - `subcategory`: nutricion, ejercicio, etc.
  - `impact`: Impacto en salud y planeta
  - `isFeatured`: Si es destacado

#### 📁 **Colección: community**
- **Haz clic** en `community`
- **Verás:** Mensajes del foro
- **Campos principales:**
  - `title`: Título del mensaje
  - `content`: Contenido del mensaje
  - `userId`: ID del usuario que lo escribió
  - `likes`: Usuarios que dieron like
  - `replies`: Respuestas al mensaje

---

## 🔍 Consultas Útiles en MongoDB Compass

### 📊 **Ver Estadísticas Generales**

#### Contar documentos:
```json
{}
```
**Resultado:** Te muestra el total de documentos en la colección

### 👥 **Consultas de Usuarios**

#### Ver todos los usuarios:
```json
{}
```

#### Buscar usuario por email:
```json
{
  "email": "usuario@ejemplo.com"
}
```

#### Ver usuarios con buena salud:
```json
{
  "health.currentHealth": {
    "$gte": 70
  }
}
```

#### Ver usuarios con muchos logros:
```json
{
  "achievements": {
    "$size": {
      "$gte": 5
    }
  }
}
```

### 💡 **Consultas de Tips**

#### Ver todos los tips:
```json
{}
```

#### Ver solo tips de salud:
```json
{
  "category": "salud"
}
```

#### Ver solo tips del planeta:
```json
{
  "category": "planeta"
}
```

#### Ver tips destacados:
```json
{
  "isFeatured": true
}
```

#### Ver tips de ejercicio:
```json
{
  "subcategory": "ejercicio"
}
```

#### Ver tips con alto impacto en salud:
```json
{
  "impact.health": {
    "$gte": 20
  }
}
```

#### Buscar tips por texto:
```json
{
  "title": {
    "$regex": "agua",
    "$options": "i"
  }
}
```

### 💬 **Consultas de Comunidad**

#### Ver todos los mensajes:
```json
{}
```

#### Ver mensajes de salud:
```json
{
  "category": "salud"
}
```

#### Ver mensajes populares (con muchos likes):
```json
{
  "likes": {
    "$size": {
      "$gte": 5
    }
  }
}
```

#### Ver mensajes recientes:
```json
{
  "createdAt": {
    "$gte": {
      "$date": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 🛠️ Operaciones Avanzadas

### 📝 **Insertar un Usuario de Prueba**

1. **Haz clic** en la colección `users`
2. **Haz clic** en "Add Data" → "Insert Document"
3. **Copia y pega** este JSON:

```json
{
  "username": "usuario_prueba",
  "email": "prueba@ejemplo.com",
  "password": "$2b$12$hashedpassword",
  "profile": {
    "age": 25,
    "gender": "femenino",
    "weight": 65,
    "height": 1.70
  },
  "health": {
    "currentHealth": 75,
    "healthStatus": "Bueno"
  },
  "planet": {
    "currentPlanetHealth": 60,
    "planetStatus": "Mejorando"
  },
  "achievements": [],
  "progress": {
    "streakDays": 5,
    "totalPoints": 150
  },
  "habits": [],
  "actions": [],
  "avatar": {
    "equipped": {}
  }
}
```

### 📝 **Insertar un Mensaje de Prueba**

1. **Haz clic** en la colección `community`
2. **Haz clic** en "Add Data" → "Insert Document"
3. **Copia y pega** este JSON:

```json
{
  "userId": "ID_DEL_USUARIO_AQUI",
  "title": "Mi primer mensaje",
  "content": "¡Hola comunidad! Estoy empezando mi viaje hacia una vida más saludable y sostenible.",
  "category": "salud",
  "likes": [],
  "replies": []
}
```

---

## 📊 **Vistas Útiles en Compass**

### 📈 **Dashboard de Estadísticas**

1. **En la colección**, haz clic en "Schema"
2. **Verás** gráficos de:
   - Distribución de categorías
   - Rangos de valores
   - Tipos de datos

### 🔍 **Búsqueda Avanzada**

1. **Haz clic** en "Filter"
2. **Usa** las consultas JSON mostradas arriba
3. **Guarda** filtros frecuentes

### 📋 **Exportar Datos**

1. **Selecciona** los documentos que quieres exportar
2. **Haz clic** en "Add Data" → "Export Collection"
3. **Elige** formato: JSON o CSV
4. **Selecciona** ubicación de guardado

---

## 🎯 **Próximos Pasos**

### 1. **Crear Usuarios de Prueba**
- Usa la aplicación web para registrarte
- O inserta usuarios directamente en Compass

### 2. **Explorar los Tips**
- Revisa los 17 consejos disponibles
- Prueba diferentes filtros

### 3. **Probar la Aplicación**
- Abre la aplicación web
- Regístrate y crea un usuario
- Ver cómo se actualizan las tablas

### 4. **Monitorear Actividad**
- Revisa las colecciones regularmente
- Observa cómo crecen los datos

---

## 🔧 **Comandos Rápidos**

### **Desde la Terminal:**
```bash
# Ver estadísticas
node visualizar-datos.js

# Poblar datos de ejemplo
npm run seed

# Reiniciar servidor
npm run dev
```

### **Desde MongoDB Compass:**
- **F5**: Actualizar vista
- **Ctrl+F**: Buscar en documentos
- **Ctrl+S**: Guardar filtro

---

## 🎉 **¡Tu Base de Datos está Lista!**

**Estado actual:**
- ✅ MongoDB funcionando
- ✅ Base de datos creada
- ✅ Colecciones configuradas
- ✅ Datos de ejemplo cargados
- ✅ Servidor backend ejecutándose

**¡Ahora puedes explorar todas las tablas y ver cómo tu aplicación LiveLevelUp funciona con datos reales!** 🚀

---

**💡 Consejo:** Mantén MongoDB Compass abierto mientras usas la aplicación para ver en tiempo real cómo se actualizan las tablas cuando registras usuarios, agregas hábitos, o publicas mensajes en la comunidad. 