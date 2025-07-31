# 🗄️ Guía Completa para MongoDB - LiveLevelUp

## 📋 Índice
1. [Instalación de MongoDB](#instalación)
2. [Abrir MongoDB Compass](#compass)
3. [Conectar a la Base de Datos](#conectar)
4. [Explorar las Colecciones](#explorar)
5. [Consultas Básicas](#consultas)
6. [Gestión de Datos](#gestión)
7. [Backup y Restauración](#backup)

---

## 🚀 Instalación de MongoDB

### Opción 1: MongoDB Community Server (Local)
1. **Descargar MongoDB Community Server:**
   - Ve a: https://www.mongodb.com/try/download/community
   - Selecciona tu sistema operativo (Windows)
   - Descarga la versión más reciente

2. **Instalar MongoDB:**
   ```bash
   # Ejecutar el instalador descargado
   # Seguir las instrucciones del wizard
   # Instalar MongoDB Compass cuando se pregunte
   ```

3. **Verificar instalación:**
   ```bash
   # Abrir PowerShell como administrador
   mongod --version
   ```

### Opción 2: MongoDB Atlas (Cloud - Recomendado)
1. **Crear cuenta gratuita:**
   - Ve a: https://www.mongodb.com/atlas
   - Crea una cuenta gratuita
   - Crea un cluster gratuito

2. **Obtener string de conexión:**
   - En tu cluster, haz clic en "Connect"
   - Selecciona "Connect your application"
   - Copia el string de conexión

3. **Actualizar .env:**
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/livelevelup
   ```

---

## 🎯 Abrir MongoDB Compass

### Instalación de Compass
1. **Descargar MongoDB Compass:**
   - Ve a: https://www.mongodb.com/try/download/compass
   - Descarga la versión para Windows
   - Instala siguiendo el wizard

### Conectar a la Base de Datos

#### Para MongoDB Local:
```
mongodb://localhost:27017/livelevelup
```

#### Para MongoDB Atlas:
```
mongodb+srv://usuario:password@cluster.mongodb.net/livelevelup
```

### Pasos para Conectar:
1. **Abrir MongoDB Compass**
2. **En la pantalla de conexión:**
   - Pega el string de conexión
   - Haz clic en "Connect"
3. **Si es la primera vez:**
   - Compass te pedirá crear la base de datos
   - Nombre: `livelevelup`
   - Colección inicial: `users`

---

## 🔗 Conectar a la Base de Datos

### Verificar Conexión
Una vez conectado, verás:
- ✅ **Estado:** Connected
- 📊 **Base de datos:** livelevelup
- 📁 **Colecciones:** users, tips, community

### Estructura de la Base de Datos
```
livelevelup/
├── users/          # Usuarios y perfiles
├── tips/           # Consejos y tips
└── community/      # Mensajes del foro
```

---

## 🔍 Explorar las Colecciones

### 1. Colección `users`
**Contiene:** Todos los usuarios registrados

**Campos principales:**
- `_id`: ID único del usuario
- `username`: Nombre de usuario
- `email`: Email del usuario
- `profile`: Información personal
- `health`: Estado de salud
- `planet`: Estado del planeta
- `avatar`: Personalización del avatar
- `achievements`: Logros desbloqueados

**Ejemplo de documento:**
```json
{
  "_id": "ObjectId('...')",
  "username": "usuario_ejemplo",
  "email": "usuario@ejemplo.com",
  "profile": {
    "age": 25,
    "gender": "femenino",
    "weight": 65
  },
  "health": {
    "currentHealth": 75,
    "healthStatus": "Bueno"
  },
  "planet": {
    "currentPlanetHealth": 60,
    "planetStatus": "Mejorando"
  }
}
```

### 2. Colección `tips`
**Contiene:** Consejos de salud y sostenibilidad

**Campos principales:**
- `_id`: ID único del tip
- `title`: Título del consejo
- `content`: Contenido del consejo
- `category`: Categoría (salud/planeta)
- `subcategory`: Subcategoría específica
- `impact`: Impacto en salud y planeta
- `difficulty`: Dificultad de implementación
- `isFeatured`: Si es destacado

**Ejemplo de documento:**
```json
{
  "_id": "ObjectId('...')",
  "title": "Bebe 8 vasos de agua al día",
  "content": "Mantenerte hidratado es fundamental para tu salud.",
  "category": "salud",
  "subcategory": "nutricion",
  "impact": {
    "health": 15,
    "planet": 0
  },
  "difficulty": "facil",
  "isFeatured": true
}
```

### 3. Colección `community`
**Contiene:** Mensajes del foro comunitario

**Campos principales:**
- `_id`: ID único del mensaje
- `userId`: ID del usuario que lo escribió
- `title`: Título del mensaje
- `content`: Contenido del mensaje
- `category`: Categoría del mensaje
- `likes`: Array de usuarios que dieron like
- `replies`: Respuestas al mensaje

---

## 🔍 Consultas Básicas

### En MongoDB Compass:

#### 1. Ver todos los usuarios
```json
{}
```

#### 2. Buscar usuario por email
```json
{
  "email": "usuario@ejemplo.com"
}
```

#### 3. Ver tips de salud
```json
{
  "category": "salud"
}
```

#### 4. Ver tips destacados
```json
{
  "isFeatured": true
}
```

#### 5. Buscar por texto en tips
```json
{
  "title": {
    "$regex": "agua",
    "$options": "i"
  }
}
```

#### 6. Ver usuarios con buena salud
```json
{
  "health.currentHealth": {
    "$gte": 70
  }
}
```

#### 7. Ver mensajes populares
```json
{
  "likes": {
    "$size": {
      "$gte": 10
    }
  }
}
```

---

## 📊 Gestión de Datos

### Insertar Documento
1. **Selecciona la colección**
2. **Haz clic en "Add Data" → "Insert Document"**
3. **Escribe el JSON:**
```json
{
  "username": "nuevo_usuario",
  "email": "nuevo@ejemplo.com",
  "profile": {
    "age": 30,
    "gender": "masculino"
  }
}
```

### Actualizar Documento
1. **Encuentra el documento**
2. **Haz clic en "Edit Document"**
3. **Modifica los campos necesarios**
4. **Haz clic en "Update"**

### Eliminar Documento
1. **Encuentra el documento**
2. **Haz clic en "Delete Document"**
3. **Confirma la eliminación**

---

## 💾 Backup y Restauración

### Crear Backup
```bash
# En PowerShell como administrador
mongodump --db livelevelup --out C:\backup\livelevelup
```

### Restaurar Backup
```bash
# En PowerShell como administrador
mongorestore --db livelevelup C:\backup\livelevelup\livelevelup
```

### Exportar Colección
1. **En Compass:**
   - Selecciona la colección
   - "Add Data" → "Export Collection"
   - Elige formato (JSON/CSV)
   - Selecciona ubicación

### Importar Colección
1. **En Compass:**
   - Selecciona la base de datos
   - "Add Data" → "Import File"
   - Selecciona el archivo
   - Confirma la importación

---

## 🛠️ Comandos Útiles

### Verificar Estado del Servidor
```bash
# Verificar si MongoDB está corriendo
netstat -ano | findstr :27017
```

### Iniciar MongoDB (si no está como servicio)
```bash
# En PowerShell como administrador
mongod --dbpath C:\data\db
```

### Conectar con mongo shell
```bash
# Conectar a la base de datos
mongo livelevelup
```

### Comandos en mongo shell
```javascript
// Ver todas las colecciones
show collections

// Ver documentos de una colección
db.users.find()

// Contar documentos
db.users.countDocuments()

// Ver un documento específico
db.users.findOne({email: "usuario@ejemplo.com"})
```

---

## 🔧 Solución de Problemas

### Error de Conexión
1. **Verificar que MongoDB esté corriendo:**
   ```bash
   netstat -ano | findstr :27017
   ```

2. **Reiniciar el servicio:**
   ```bash
   # En PowerShell como administrador
   net stop MongoDB
   net start MongoDB
   ```

3. **Verificar firewall:**
   - Asegúrate de que el puerto 27017 esté abierto

### Error de Autenticación
1. **Verificar credenciales en .env**
2. **Crear usuario si es necesario:**
   ```javascript
   use admin
   db.createUser({
     user: "admin",
     pwd: "password",
     roles: ["root"]
   })
   ```

### Base de Datos No Encontrada
1. **Verificar nombre de la base de datos**
2. **Crear la base de datos si no existe:**
   ```javascript
   use livelevelup
   db.createCollection("users")
   ```

---

## 📱 Integración con la Aplicación

### Verificar Conexión desde el Backend
```bash
# En la carpeta backend
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livelevelup')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error:', err));
"
```

### Verificar Datos desde el Frontend
1. **Abrir la aplicación en el navegador**
2. **Ver el indicador de conexión en la esquina superior derecha**
3. **Si está verde, la conexión es exitosa**

---

## 🎯 Próximos Pasos

1. **Explorar las colecciones** para entender la estructura
2. **Ejecutar consultas** para ver los datos
3. **Modificar documentos** si es necesario
4. **Crear backups** regularmente
5. **Monitorear el rendimiento** de la base de datos

---

**¡Tu base de datos MongoDB está lista para usar con LiveLevelUp!** 🚀 