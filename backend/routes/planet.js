import express from 'express';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// @desc    Obtener estado del planeta del usuario
// @route   GET /api/planet/status
// @access  Private
router.get('/status', protect, async (req, res) => {
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
      planet: user.planet,
      habits: user.habits.filter(h => h.category === 'planet'),
      actions: user.actions.filter(a => a.category === 'planet')
    });
  } catch (error) {
    console.error('Error obteniendo estado del planeta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el estado del planeta'
    });
  }
});

// @desc    Agregar hábito para el planeta
// @route   POST /api/planet/habits
// @access  Private
router.post('/habits', [
  protect,
  body('id')
    .isNumeric()
    .withMessage('El ID del hábito debe ser un número'),
  body('name')
    .isString()
    .notEmpty()
    .withMessage('El nombre del hábito es requerido'),
  body('impact')
    .isNumeric()
    .withMessage('El impacto debe ser un número'),
  body('icon')
    .isString()
    .notEmpty()
    .withMessage('El icono es requerido')
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

    const { id, name, impact, icon } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Verificar si el hábito ya existe
    const existingHabit = user.habits.find(h => h.id === id && h.category === 'planet');
    if (existingHabit) {
      return res.status(400).json({
        error: 'Hábito ya existe',
        message: 'Este hábito ya está agregado a tu perfil'
      });
    }

    // Agregar hábito
    user.habits.push({
      id,
      name,
      impact,
      icon,
      category: 'planet'
    });

    // Actualizar salud del planeta
    const updatedPlanet = user.updatePlanetHealth(impact);
    
    // Actualizar progreso
    user.progress.totalPlanetPoints += impact;
    user.updateDailyProgress();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Hábito para el planeta agregado exitosamente',
      habit: {
        id,
        name,
        impact,
        icon,
        category: 'planet'
      },
      planet: updatedPlanet,
      totalPlanetPoints: user.progress.totalPlanetPoints
    });
  } catch (error) {
    console.error('Error agregando hábito del planeta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al agregar el hábito del planeta'
    });
  }
});

// @desc    Remover hábito del planeta
// @route   DELETE /api/planet/habits/:habitId
// @access  Private
router.delete('/habits/:habitId', protect, async (req, res) => {
  try {
    const { habitId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Buscar el hábito
    const habitIndex = user.habits.findIndex(h => h.id === parseInt(habitId) && h.category === 'planet');
    
    if (habitIndex === -1) {
      return res.status(404).json({
        error: 'Hábito no encontrado',
        message: 'No se encontró el hábito especificado'
      });
    }

    const habit = user.habits[habitIndex];
    
    // Remover hábito
    user.habits.splice(habitIndex, 1);
    
    // Actualizar salud del planeta (restar impacto)
    const updatedPlanet = user.updatePlanetHealth(-habit.impact);
    
    // Actualizar progreso
    user.progress.totalPlanetPoints = Math.max(0, user.progress.totalPlanetPoints - habit.impact);
    user.updateDailyProgress();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Hábito del planeta removido exitosamente',
      removedHabit: habit,
      planet: updatedPlanet,
      totalPlanetPoints: user.progress.totalPlanetPoints
    });
  } catch (error) {
    console.error('Error removiendo hábito del planeta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al remover el hábito del planeta'
    });
  }
});

// @desc    Agregar acción para el planeta
// @route   POST /api/planet/actions
// @access  Private
router.post('/actions', [
  protect,
  body('id')
    .isNumeric()
    .withMessage('El ID de la acción debe ser un número'),
  body('name')
    .isString()
    .notEmpty()
    .withMessage('El nombre de la acción es requerido'),
  body('impact')
    .isNumeric()
    .withMessage('El impacto debe ser un número'),
  body('icon')
    .isString()
    .notEmpty()
    .withMessage('El icono es requerido')
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

    const { id, name, impact, icon } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Verificar si la acción ya existe
    const existingAction = user.actions.find(a => a.id === id && a.category === 'planet');
    if (existingAction) {
      return res.status(400).json({
        error: 'Acción ya existe',
        message: 'Esta acción ya está agregada a tu perfil'
      });
    }

    // Agregar acción
    user.actions.push({
      id,
      name,
      impact,
      icon,
      category: 'planet'
    });

    // Actualizar salud del planeta
    const updatedPlanet = user.updatePlanetHealth(impact);
    
    // Actualizar progreso
    user.progress.totalPlanetPoints += impact;
    user.updateDailyProgress();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Acción para el planeta agregada exitosamente',
      action: {
        id,
        name,
        impact,
        icon,
        category: 'planet'
      },
      planet: updatedPlanet,
      totalPlanetPoints: user.progress.totalPlanetPoints
    });
  } catch (error) {
    console.error('Error agregando acción del planeta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al agregar la acción del planeta'
    });
  }
});

// @desc    Remover acción del planeta
// @route   DELETE /api/planet/actions/:actionId
// @access  Private
router.delete('/actions/:actionId', protect, async (req, res) => {
  try {
    const { actionId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Buscar la acción
    const actionIndex = user.actions.findIndex(a => a.id === parseInt(actionId) && a.category === 'planet');
    
    if (actionIndex === -1) {
      return res.status(404).json({
        error: 'Acción no encontrada',
        message: 'No se encontró la acción especificada'
      });
    }

    const action = user.actions[actionIndex];
    
    // Remover acción
    user.actions.splice(actionIndex, 1);
    
    // Actualizar salud del planeta (restar impacto)
    const updatedPlanet = user.updatePlanetHealth(-action.impact);
    
    // Actualizar progreso
    user.progress.totalPlanetPoints = Math.max(0, user.progress.totalPlanetPoints - action.impact);
    user.updateDailyProgress();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Acción del planeta removida exitosamente',
      removedAction: action,
      planet: updatedPlanet,
      totalPlanetPoints: user.progress.totalPlanetPoints
    });
  } catch (error) {
    console.error('Error removiendo acción del planeta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al remover la acción del planeta'
    });
  }
});

// @desc    Simular impacto colectivo
// @route   POST /api/planet/simulate-collective
// @access  Private
router.post('/simulate-collective', [
  protect,
  body('action')
    .isString()
    .notEmpty()
    .withMessage('La acción es requerida'),
  body('impact')
    .isNumeric()
    .withMessage('El impacto debe ser un número'),
  body('peopleCount')
    .isInt({ min: 1, max: 1000000 })
    .withMessage('El número de personas debe estar entre 1 y 1,000,000')
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

    const { action, impact, peopleCount } = req.body;

    // Calcular impacto colectivo
    const collectiveImpact = impact * peopleCount;
    const globalImpact = Math.min(100, collectiveImpact / 1000); // Normalizar a escala global

    // Determinar el mensaje basado en el impacto
    let message, emoji, status;
    
    if (globalImpact >= 80) {
      message = `¡Increíble! Si ${peopleCount.toLocaleString()} personas ${action}, el impacto sería masivo`;
      emoji = '🌍';
      status = 'Excelente';
    } else if (globalImpact >= 60) {
      message = `¡Excelente! Si ${peopleCount.toLocaleString()} personas ${action}, el planeta mejoraría significativamente`;
      emoji = '🌱';
      status = 'Mejorando';
    } else if (globalImpact >= 40) {
      message = `¡Muy bien! Si ${peopleCount.toLocaleString()} personas ${action}, habría un impacto notable`;
      emoji = '🌿';
      status = 'Estable';
    } else if (globalImpact >= 20) {
      message = `¡Bueno! Si ${peopleCount.toLocaleString()} personas ${action}, sería un paso en la dirección correcta`;
      emoji = '🌪️';
      status = 'Empeorando';
    } else {
      message = `¡Cada acción cuenta! Si ${peopleCount.toLocaleString()} personas ${action}, sería un pequeño pero valioso aporte`;
      emoji = '🔥';
      status = 'Crítico';
    }

    res.status(200).json({
      success: true,
      simulation: {
        action,
        individualImpact: impact,
        peopleCount,
        collectiveImpact,
        globalImpact: Math.round(globalImpact * 100) / 100,
        message,
        emoji,
        status
      }
    });
  } catch (error) {
    console.error('Error simulando impacto colectivo:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al simular el impacto colectivo'
    });
  }
});

// @desc    Obtener estadísticas del planeta
// @route   GET /api/planet/stats
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

    const planetHabits = user.habits.filter(h => h.category === 'planet');
    const planetActions = user.actions.filter(a => a.category === 'planet');

    const stats = {
      currentPlanetHealth: user.planet.currentPlanetHealth,
      planetStatus: user.planet.planetStatus,
      planetEmoji: user.planet.planetEmoji,
      totalPlanetPoints: user.progress.totalPlanetPoints,
      habitsCount: planetHabits.length,
      actionsCount: planetActions.length,
      totalHabitsImpact: planetHabits.reduce((sum, h) => sum + h.impact, 0),
      totalActionsImpact: planetActions.reduce((sum, a) => sum + a.impact, 0),
      daysActive: user.progress.daysActive,
      streakDays: user.progress.streakDays
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas del planeta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener las estadísticas del planeta'
    });
  }
});

// @desc    Obtener ranking de usuarios por impacto planetario
// @route   GET /api/planet/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find({})
      .select('username profile.avatar planet.progress.totalPlanetPoints')
      .sort({ 'progress.totalPlanetPoints': -1 })
      .limit(parseInt(limit))
      .lean();

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalPlanetPoints: user.progress?.totalPlanetPoints || 0,
      avatar: user.profile?.avatar || null
    }));

    res.status(200).json({
      success: true,
      leaderboard: formattedLeaderboard
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