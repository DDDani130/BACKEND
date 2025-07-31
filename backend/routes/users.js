import express from 'express';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// @desc    Obtener perfil del usuario
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        health: user.health,
        planet: user.planet,
        avatar: user.avatar,
        progress: user.progress,
        preferences: user.preferences,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el perfil del usuario'
    });
  }
});

// @desc    Actualizar perfil del usuario
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', [
  protect,
  body('nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El nombre no puede exceder 50 caracteres'),
  body('edad')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('La edad debe estar entre 1 y 120 años'),
  body('peso')
    .optional()
    .isFloat({ min: 20, max: 300 })
    .withMessage('El peso debe estar entre 20 y 300 kg'),
  body('altura')
    .optional()
    .isFloat({ min: 0.5, max: 2.5 })
    .withMessage('La altura debe estar entre 0.5 y 2.5 metros'),
  body('genero')
    .optional()
    .isIn(['masculino', 'femenino', 'otro', 'prefiero-no-decir'])
    .withMessage('Género inválido'),
  body('actividad')
    .optional()
    .isIn(['sedentario', 'ligera', 'moderada', 'activa', 'muy-activa'])
    .withMessage('Nivel de actividad inválido'),
  body('dieta')
    .optional()
    .isIn(['omnivora', 'vegetariana', 'vegana', 'paleo', 'keto', 'mediterranea'])
    .withMessage('Tipo de dieta inválido'),
  body('horasSueno')
    .optional()
    .isInt({ min: 4, max: 12 })
    .withMessage('Las horas de sueño deben estar entre 4 y 12'),
  body('estres')
    .optional()
    .isIn(['bajo', 'moderado', 'alto', 'muy-alto'])
    .withMessage('Nivel de estrés inválido'),
  body('consumo')
    .optional()
    .isIn(['bajo', 'moderado', 'alto'])
    .withMessage('Nivel de consumo inválido'),
  body('animo')
    .optional()
    .isIn(['triste', 'neutral', 'feliz', 'muy-feliz'])
    .withMessage('Estado de ánimo inválido')
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

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Actualizar solo los campos proporcionados
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        user.profile[key] = req.body[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      profile: user.profile,
      bmi: user.bmi,
      ageInYears: user.ageInYears
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar el perfil'
    });
  }
});

// @desc    Actualizar preferencias del usuario
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', [
  protect,
  body('theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Tema inválido'),
  body('notifications')
    .optional()
    .isBoolean()
    .withMessage('Las notificaciones deben ser un valor booleano'),
  body('language')
    .optional()
    .isIn(['es', 'en'])
    .withMessage('Idioma inválido')
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

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Actualizar solo las preferencias proporcionadas
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        user.preferences[key] = req.body[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferencias actualizadas exitosamente',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error actualizando preferencias:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar las preferencias'
    });
  }
});

// @desc    Obtener progreso del usuario
// @route   GET /api/users/progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    res.status(200).json({
      success: true,
      progress: user.progress,
      health: user.health,
      planet: user.planet,
      achievements: user.achievements
    });
  } catch (error) {
    console.error('Error obteniendo progreso:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el progreso del usuario'
    });
  }
});

// @desc    Obtener logros del usuario
// @route   GET /api/users/achievements
// @access  Private
router.get('/achievements', protect, async (req, res) => {
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
      unlockedCount: user.achievements.filter(a => a.unlocked).length
    };

    res.status(200).json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Error obteniendo logros:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los logros del usuario'
    });
  }
});

// @desc    Obtener estadísticas del usuario
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    const healthHabits = user.habits.filter(h => h.category === 'health');
    const planetHabits = user.habits.filter(h => h.category === 'planet');
    const healthActions = user.actions.filter(a => a.category === 'health');
    const planetActions = user.actions.filter(a => a.category === 'planet');

    const stats = {
      profile: {
        age: user.profile.edad,
        bmi: user.bmi,
        activityLevel: user.profile.actividad,
        diet: user.profile.dieta,
        sleepHours: user.profile.horasSueno,
        stressLevel: user.profile.estres
      },
      health: {
        currentHealth: user.health.currentHealth,
        healthStatus: user.health.healthStatus,
        lifeExpectancy: user.health.lifeExpectancy,
        totalHealthPoints: user.progress.totalHealthPoints,
        habitsCount: healthHabits.length,
        actionsCount: healthActions.length,
        totalHabitsImpact: healthHabits.reduce((sum, h) => sum + h.impact, 0),
        totalActionsImpact: healthActions.reduce((sum, a) => sum + a.impact, 0)
      },
      planet: {
        currentPlanetHealth: user.planet.currentPlanetHealth,
        planetStatus: user.planet.planetStatus,
        totalPlanetPoints: user.progress.totalPlanetPoints,
        habitsCount: planetHabits.length,
        actionsCount: planetActions.length,
        totalHabitsImpact: planetHabits.reduce((sum, h) => sum + h.impact, 0),
        totalActionsImpact: planetActions.reduce((sum, a) => sum + a.impact, 0)
      },
      progress: {
        daysActive: user.progress.daysActive,
        streakDays: user.progress.streakDays,
        totalAchievements: user.achievements.length,
        unlockedAchievements: user.achievements.filter(a => a.unlocked).length
      },
      activity: {
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        daysSinceRegistration: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24))
      }
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener las estadísticas del usuario'
    });
  }
});

// @desc    Eliminar cuenta del usuario
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Aquí podrías agregar lógica adicional antes de eliminar
    // Por ejemplo, verificar contraseña, enviar email de confirmación, etc.

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Cuenta eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando cuenta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al eliminar la cuenta'
    });
  }
});

// @desc    Obtener ranking de usuarios
// @route   GET /api/users/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const { type = 'health', limit = 10 } = req.query;

    let sortField;
    switch (type) {
      case 'health':
        sortField = 'progress.totalHealthPoints';
        break;
      case 'planet':
        sortField = 'progress.totalPlanetPoints';
        break;
      case 'streak':
        sortField = 'progress.streakDays';
        break;
      case 'achievements':
        sortField = 'achievements.length';
        break;
      default:
        sortField = 'progress.totalHealthPoints';
    }

    const leaderboard = await User.find({})
      .select('username profile.avatar progress achievements')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit))
      .lean();

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      avatar: user.profile?.avatar || null,
      totalHealthPoints: user.progress?.totalHealthPoints || 0,
      totalPlanetPoints: user.progress?.totalPlanetPoints || 0,
      streakDays: user.progress?.streakDays || 0,
      achievementsCount: user.achievements?.length || 0
    }));

    res.status(200).json({
      success: true,
      leaderboard: formattedLeaderboard,
      type
    });
  } catch (error) {
    console.error('Error obteniendo leaderboard:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el ranking de usuarios'
    });
  }
});

export default router; 