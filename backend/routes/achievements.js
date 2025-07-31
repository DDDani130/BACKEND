import express from 'express';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// @desc    Obtener logros del usuario
// @route   GET /api/achievements
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    const achievements = {
      unlocked: user.achievements.filter(a => a.unlocked),
      locked: user.achievements.filter(a => !a.unlocked),
      total: user.achievements.length,
      unlockedCount: user.achievements.filter(a => a.unlocked).length,
      progress: Math.round((user.achievements.filter(a => a.unlocked).length / user.achievements.length) * 100) || 0
    };

    res.status(200).json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Error obteniendo logros:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los logros'
    });
  }
});

// @desc    Agregar logro al usuario
// @route   POST /api/achievements
// @access  Private
router.post('/', [
  protect,
  body('id')
    .isNumeric()
    .withMessage('El ID del logro debe ser un número'),
  body('name')
    .isString()
    .notEmpty()
    .withMessage('El nombre del logro es requerido'),
  body('icon')
    .isString()
    .notEmpty()
    .withMessage('El icono del logro es requerido'),
  body('description')
    .isString()
    .notEmpty()
    .withMessage('La descripción del logro es requerida'),
  body('category')
    .isIn(['health', 'planeta', 'general'])
    .withMessage('La categoría debe ser health, planeta o general')
], async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Error de validación',
        details: errors.array()
      });
    }

    const { id, name, icon, description, category } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Verificar si el logro ya existe
    const existingAchievement = user.achievements.find(a => a.id === id);
    if (existingAchievement) {
      return res.status(400).json({
        error: 'Logro ya existe',
        message: 'Este logro ya está en tu perfil'
      });
    }

    // Agregar logro
    const wasAdded = user.addAchievement(id, name, icon, description, category);
    
    if (!wasAdded) {
      return res.status(400).json({
        error: 'Logro ya desbloqueado',
        message: 'Este logro ya está desbloqueado'
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: '¡Logro desbloqueado!',
      achievement: {
        id,
        name,
        icon,
        description,
        category,
        unlocked: true,
        unlockedAt: new Date()
      },
      totalAchievements: user.achievements.length,
      unlockedCount: user.achievements.filter(a => a.unlocked).length
    });
  } catch (error) {
    console.error('Error agregando logro:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al agregar el logro'
    });
  }
});

// @desc    Verificar y otorgar logros automáticamente
// @route   POST /api/achievements/check
// @access  Private
router.post('/check', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    const newAchievements = [];
    const allAchievements = getAchievementDefinitions();

    // Verificar cada logro
    allAchievements.forEach(achievement => {
      const existingAchievement = user.achievements.find(a => a.id === achievement.id);
      
      if (!existingAchievement && checkAchievementCondition(user, achievement)) {
        const wasAdded = user.addAchievement(
          achievement.id,
          achievement.name,
          achievement.icon,
          achievement.description,
          achievement.category
        );
        
        if (wasAdded) {
          newAchievements.push(achievement);
        }
      }
    });

    if (newAchievements.length > 0) {
      await user.save();
    }

    res.status(200).json({
      success: true,
      newAchievements,
      totalNew: newAchievements.length,
      message: newAchievements.length > 0 
        ? `¡${newAchievements.length} nuevo(s) logro(s) desbloqueado(s)!` 
        : 'No hay nuevos logros para desbloquear'
    });
  } catch (error) {
    console.error('Error verificando logros:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al verificar logros'
    });
  }
});

// @desc    Obtener definiciones de logros disponibles
// @route   GET /api/achievements/definitions
// @access  Private
router.get('/definitions', protect, async (req, res) => {
  try {
    const achievements = getAchievementDefinitions();

    res.status(200).json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Error obteniendo definiciones de logros:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener las definiciones de logros'
    });
  }
});

// Función para obtener definiciones de logros
const getAchievementDefinitions = () => {
  return [
    // Logros de salud
    {
      id: 1,
      name: 'Primer paso saludable',
      icon: '🌱',
      description: 'Agregaste tu primer hábito de salud',
      category: 'health',
      condition: (user) => user.habits.filter(h => h.category === 'health').length >= 1
    },
    {
      id: 2,
      name: 'Come-frutas',
      icon: '🍎',
      description: 'Agregaste 3 hábitos de nutrición',
      category: 'health',
      condition: (user) => user.habits.filter(h => h.category === 'health' && h.name.includes('fruta')).length >= 1
    },
    {
      id: 3,
      name: 'Hidratación perfecta',
      icon: '💧',
      description: 'Agregaste el hábito de beber agua',
      category: 'health',
      condition: (user) => user.habits.filter(h => h.category === 'health' && h.name.includes('agua')).length >= 1
    },
    {
      id: 4,
      name: 'Ejercicio diario',
      icon: '🏃‍♂️',
      description: 'Agregaste 3 hábitos de ejercicio',
      category: 'health',
      condition: (user) => user.habits.filter(h => h.category === 'health' && (h.name.includes('ejercicio') || h.name.includes('correr') || h.name.includes('gimnasio'))).length >= 1
    },
    {
      id: 5,
      name: 'Descanso óptimo',
      icon: '😴',
      description: 'Agregaste el hábito de dormir bien',
      category: 'health',
      condition: (user) => user.habits.filter(h => h.category === 'health' && h.name.includes('dormir')).length >= 1
    },
    {
      id: 6,
      name: 'Salud excelente',
      icon: '😄',
      description: 'Alcanzaste 80+ puntos de salud',
      category: 'health',
      condition: (user) => user.health.currentHealth >= 80
    },
    {
      id: 7,
      name: 'Atleta en ciernes',
      icon: '🏆',
      description: 'Agregaste 5 hábitos de salud',
      category: 'health',
      condition: (user) => user.habits.filter(h => h.category === 'health').length >= 5
    },

    // Logros del planeta
    {
      id: 8,
      name: 'Guardian del planeta',
      icon: '🌍',
      description: 'Agregaste tu primer hábito ecológico',
      category: 'planeta',
      condition: (user) => user.habits.filter(h => h.category === 'planeta').length >= 1
    },
    {
      id: 9,
      name: 'Reciclador comprometido',
      icon: '♻️',
      description: 'Agregaste hábitos de reciclaje',
      category: 'planeta',
      condition: (user) => user.habits.filter(h => h.category === 'planeta' && h.name.includes('reciclar')).length >= 1
    },
    {
      id: 10,
      name: 'Transporte verde',
      icon: '🚲',
      description: 'Agregaste hábitos de transporte sostenible',
      category: 'planeta',
      condition: (user) => user.habits.filter(h => h.category === 'planeta' && (h.name.includes('bici') || h.name.includes('transporte público'))).length >= 1
    },
    {
      id: 11,
      name: 'Ahorrador de energía',
      icon: '⚡',
      description: 'Agregaste hábitos de ahorro energético',
      category: 'planeta',
      condition: (user) => user.habits.filter(h => h.category === 'planeta' && h.name.includes('energía')).length >= 1
    },
    {
      id: 12,
      name: 'Planeta mejorando',
      icon: '🌱',
      description: 'Alcanzaste 60+ puntos de salud del planeta',
      category: 'planeta',
      condition: (user) => user.planet.currentPlanetHealth >= 60
    },
    {
      id: 13,
      name: 'Eco-warrior',
      icon: '🛡️',
      description: 'Agregaste 5 hábitos ecológicos',
      category: 'planeta',
      condition: (user) => user.habits.filter(h => h.category === 'planeta').length >= 5
    },

    // Logros generales
    {
      id: 14,
      name: 'Primer día',
      icon: '📅',
      description: 'Completaste tu primer día activo',
      category: 'general',
      condition: (user) => user.progress.daysActive >= 1
    },
    {
      id: 15,
      name: 'Constancia',
      icon: '🔥',
      description: 'Mantuviste una racha de 7 días',
      category: 'general',
      condition: (user) => user.progress.streakDays >= 7
    },
    {
      id: 16,
      name: 'Dedicación',
      icon: '💪',
      description: 'Mantuviste una racha de 30 días',
      category: 'general',
      condition: (user) => user.progress.streakDays >= 30
    },
    {
      id: 17,
      name: 'Coleccionista',
      icon: '🏅',
      description: 'Desbloqueaste 10 logros',
      category: 'general',
      condition: (user) => user.achievements.filter(a => a.unlocked).length >= 10
    },
    {
      id: 18,
      name: 'Maestro',
      icon: '👑',
      description: 'Desbloqueaste todos los logros',
      category: 'general',
      condition: (user) => user.achievements.filter(a => a.unlocked).length >= 18
    },
    {
      id: 19,
      name: 'Comunidad activa',
      icon: '🤝',
      description: 'Participaste en el foro comunitario',
      category: 'general',
      condition: (user) => true // Se otorgará manualmente cuando participe
    },
    {
      id: 20,
      name: 'Avatar personalizado',
      icon: '🎨',
      description: 'Personalizaste tu avatar',
      category: 'general',
      condition: (user) => user.avatar.equippedClothing.cabeza || user.avatar.equippedClothing.torso || user.avatar.equippedClothing.piernas || user.avatar.equippedClothing.pies
    }
  ];
};

// Función para verificar si se cumple la condición de un logro
const checkAchievementCondition = (user, achievement) => {
  try {
    return achievement.condition(user);
  } catch (error) {
    console.error(`Error verificando condición del logro ${achievement.id}:`, error);
    return false;
  }
};

export default router; 