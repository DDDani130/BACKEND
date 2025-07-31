// Script para visualizar todas las tablas y datos de LiveLevelUp
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Tip from './models/Tip.js';
import Community from './models/Community.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livelevelup');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Función para mostrar estadísticas generales
const mostrarEstadisticas = async () => {
  console.log('\n📊 ESTADÍSTICAS GENERALES DE LA BASE DE DATOS');
  console.log('=' .repeat(50));
  
  try {
    const totalUsers = await User.countDocuments();
    const totalTips = await Tip.countDocuments();
    const totalCommunity = await Community.countDocuments();
    
    console.log(`👥 Usuarios registrados: ${totalUsers}`);
    console.log(`💡 Tips disponibles: ${totalTips}`);
    console.log(`💬 Mensajes en comunidad: ${totalCommunity}`);
    console.log(`📁 Total de colecciones: 3 (users, tips, community)`);
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.message);
  }
};

// Función para mostrar usuarios
const mostrarUsuarios = async () => {
  console.log('\n👥 USUARIOS REGISTRADOS');
  console.log('=' .repeat(50));
  
  try {
    const users = await User.find().select('-password').limit(10);
    
    if (users.length === 0) {
      console.log('📝 No hay usuarios registrados aún');
      console.log('💡 Para crear un usuario, usa la aplicación web');
      return;
    }
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuario: ${user.username}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   📅 Registrado: ${user.createdAt.toLocaleDateString()}`);
      console.log(`   🏥 Salud: ${user.health?.currentHealth || 50}/100`);
      console.log(`   🌍 Planeta: ${user.planet?.currentPlanetHealth || 45}/100`);
      console.log(`   🏆 Logros: ${user.achievements?.length || 0}`);
      console.log(`   📈 Días activos: ${user.progress?.streakDays || 0}`);
    });
    
    if (users.length >= 10) {
      console.log(`\n... y ${await User.countDocuments() - 10} usuarios más`);
    }
  } catch (error) {
    console.error('❌ Error mostrando usuarios:', error.message);
  }
};

// Función para mostrar tips
const mostrarTips = async () => {
  console.log('\n💡 TIPS DISPONIBLES');
  console.log('=' .repeat(50));
  
  try {
    const tips = await Tip.find().limit(10);
    
    if (tips.length === 0) {
      console.log('📝 No hay tips disponibles');
      return;
    }
    
    tips.forEach((tip, index) => {
      console.log(`\n${index + 1}. ${tip.title}`);
      console.log(`   📝 ${tip.content}`);
      console.log(`   🏷️ Categoría: ${tip.category} > ${tip.subcategory}`);
      console.log(`   ⭐ Destacado: ${tip.isFeatured ? 'Sí' : 'No'}`);
      console.log(`   🏥 Impacto salud: +${tip.impact.health}`);
      console.log(`   🌍 Impacto planeta: +${tip.impact.planet}`);
      console.log(`   ⏱️ Tiempo requerido: ${tip.timeRequired}`);
      console.log(`   📊 Dificultad: ${tip.difficulty}`);
    });
    
    if (tips.length >= 10) {
      console.log(`\n... y ${await Tip.countDocuments() - 10} tips más`);
    }
  } catch (error) {
    console.error('❌ Error mostrando tips:', error.message);
  }
};

// Función para mostrar mensajes de comunidad
const mostrarComunidad = async () => {
  console.log('\n💬 MENSAJES DE LA COMUNIDAD');
  console.log('=' .repeat(50));
  
  try {
    const messages = await Community.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(5);
    
    if (messages.length === 0) {
      console.log('📝 No hay mensajes en la comunidad aún');
      console.log('💡 Para crear mensajes, usa la aplicación web');
      return;
    }
    
    messages.forEach((message, index) => {
      console.log(`\n${index + 1}. ${message.title}`);
      console.log(`   👤 Por: ${message.userId?.username || 'Usuario'}`);
      console.log(`   📝 ${message.content.substring(0, 100)}...`);
      console.log(`   🏷️ Categoría: ${message.category}`);
      console.log(`   👍 Likes: ${message.likes?.length || 0}`);
      console.log(`   💬 Respuestas: ${message.replies?.length || 0}`);
      console.log(`   📅 ${message.createdAt.toLocaleDateString()}`);
    });
  } catch (error) {
    console.error('❌ Error mostrando comunidad:', error.message);
  }
};

// Función para mostrar estructura de la base de datos
const mostrarEstructura = () => {
  console.log('\n🗄️ ESTRUCTURA DE LA BASE DE DATOS');
  console.log('=' .repeat(50));
  
  console.log('\n📁 Colección: users');
  console.log('   Campos principales:');
  console.log('   - _id: ID único del usuario');
  console.log('   - username: Nombre de usuario');
  console.log('   - email: Email del usuario');
  console.log('   - password: Contraseña (encriptada)');
  console.log('   - profile: Información personal (edad, género, peso, etc.)');
  console.log('   - health: Estado de salud (currentHealth, healthStatus)');
  console.log('   - planet: Estado del planeta (currentPlanetHealth, planetStatus)');
  console.log('   - avatar: Personalización del avatar');
  console.log('   - achievements: Logros desbloqueados');
  console.log('   - progress: Progreso (streakDays, totalPoints)');
  console.log('   - habits: Hábitos activos');
  console.log('   - actions: Acciones realizadas');
  console.log('   - createdAt: Fecha de registro');
  console.log('   - updatedAt: Última actualización');
  
  console.log('\n📁 Colección: tips');
  console.log('   Campos principales:');
  console.log('   - _id: ID único del tip');
  console.log('   - title: Título del consejo');
  console.log('   - content: Contenido del consejo');
  console.log('   - category: Categoría (salud/planeta)');
  console.log('   - subcategory: Subcategoría específica');
  console.log('   - impact: Impacto en salud y planeta');
  console.log('   - difficulty: Dificultad de implementación');
  console.log('   - timeRequired: Tiempo requerido');
  console.log('   - isFeatured: Si es destacado');
  console.log('   - rating: Calificación promedio');
  console.log('   - usageCount: Veces usado');
  console.log('   - createdAt: Fecha de creación');
  
  console.log('\n📁 Colección: community');
  console.log('   Campos principales:');
  console.log('   - _id: ID único del mensaje');
  console.log('   - userId: ID del usuario que lo escribió');
  console.log('   - title: Título del mensaje');
  console.log('   - content: Contenido del mensaje');
  console.log('   - category: Categoría del mensaje');
  console.log('   - likes: Array de usuarios que dieron like');
  console.log('   - replies: Respuestas al mensaje');
  console.log('   - createdAt: Fecha de creación');
  console.log('   - updatedAt: Última actualización');
};

// Función para mostrar comandos útiles
const mostrarComandos = () => {
  console.log('\n🛠️ COMANDOS ÚTILES PARA MONGODB');
  console.log('=' .repeat(50));
  
  console.log('\n📊 Ver estadísticas:');
  console.log('   db.users.countDocuments()');
  console.log('   db.tips.countDocuments()');
  console.log('   db.community.countDocuments()');
  
  console.log('\n👥 Ver usuarios:');
  console.log('   db.users.find()');
  console.log('   db.users.findOne({email: "usuario@ejemplo.com"})');
  console.log('   db.users.find({}, {username: 1, email: 1, health: 1})');
  
  console.log('\n💡 Ver tips:');
  console.log('   db.tips.find()');
  console.log('   db.tips.find({category: "salud"})');
  console.log('   db.tips.find({isFeatured: true})');
  console.log('   db.tips.find({subcategory: "ejercicio"})');
  
  console.log('\n💬 Ver comunidad:');
  console.log('   db.community.find()');
  console.log('   db.community.find().sort({createdAt: -1})');
  console.log('   db.community.find({category: "salud"})');
  
  console.log('\n🔍 Búsquedas avanzadas:');
  console.log('   db.users.find({"health.currentHealth": {$gte: 70}})');
  console.log('   db.tips.find({"impact.health": {$gt: 20}})');
  console.log('   db.community.find({"likes": {$size: {$gte: 5}}})');
};

// Función principal
const main = async () => {
  console.log('🔍 VISUALIZADOR DE DATOS - LiveLevelUp');
  console.log('=' .repeat(50));
  
  await connectDB();
  
  // Mostrar toda la información
  await mostrarEstadisticas();
  await mostrarUsuarios();
  await mostrarTips();
  await mostrarComunidad();
  mostrarEstructura();
  mostrarComandos();
  
  console.log('\n🎉 Visualización completada!');
  console.log('💡 Para más detalles, usa MongoDB Compass o los comandos mostrados arriba');
  
  // Cerrar conexión
  await mongoose.connection.close();
  console.log('✅ Conexión cerrada');
};

// Ejecutar
main().catch(console.error); 