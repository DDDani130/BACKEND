import express from 'express';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// @desc    Obtener estado de salud del usuario
// @route   GET /api/health/status
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
      health: user.health,
      habits: user.habits.filter(h => h.category === 'health'),
      actions: user.actions.filter(a => a.category === 'health'),
      bmi: user.bmi,
      ageInYears: user.ageInYears
    });
  } catch (error) {
    console.error('Error obteniendo estado de salud:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el estado de salud'
    });
  }
});

// @desc    Agregar hábito de salud
// @route   POST /api/health/habits
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
    const existingHabit = user.habits.find(h => h.id === id && h.category === 'health');
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
      category: 'health'
    });

    // Actualizar salud
    const updatedHealth = user.updateHealth(impact);
    
    // Actualizar progreso
    user.progress.totalHealthPoints += impact;
    user.updateDailyProgress();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Hábito agregado exitosamente',
      habit: {
        id,
        name,
        impact,
        icon,
        category: 'health'
      },
      health: updatedHealth,
      totalHealthPoints: user.progress.totalHealthPoints
    });
  } catch (error) {
    console.error('Error agregando hábito:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al agregar el hábito'
    });
  }
});

// @desc    Remover hábito de salud
// @route   DELETE /api/health/habits/:habitId
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
    const habitIndex = user.habits.findIndex(h => h.id === parseInt(habitId) && h.category === 'health');
    
    if (habitIndex === -1) {
      return res.status(404).json({
        error: 'Hábito no encontrado',
        message: 'No se encontró el hábito especificado'
      });
    }

    const habit = user.habits[habitIndex];
    
    // Remover hábito
    user.habits.splice(habitIndex, 1);
    
    // Actualizar salud (restar impacto)
    const updatedHealth = user.updateHealth(-habit.impact);
    
    // Actualizar progreso
    user.progress.totalHealthPoints = Math.max(0, user.progress.totalHealthPoints - habit.impact);
    user.updateDailyProgress();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Hábito removido exitosamente',
      removedHabit: habit,
      health: updatedHealth,
      totalHealthPoints: user.progress.totalHealthPoints
    });
  } catch (error) {
    console.error('Error removiendo hábito:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al remover el hábito'
    });
  }
});

// @desc    Agregar acción de salud
// @route   POST /api/health/actions
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
    const existingAction = user.actions.find(a => a.id === id && a.category === 'health');
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
      category: 'health'
    });

    // Actualizar salud
    const updatedHealth = user.updateHealth(impact);
    
    // Actualizar progreso
    user.progress.totalHealthPoints += impact;
    user.updateDailyProgress();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Acción agregada exitosamente',
      action: {
        id,
        name,
        impact,
        icon,
        category: 'health'
      },
      health: updatedHealth,
      totalHealthPoints: user.progress.totalHealthPoints
    });
  } catch (error) {
    console.error('Error agregando acción:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al agregar la acción'
    });
  }
});

// @desc    Remover acción de salud
// @route   DELETE /api/health/actions/:actionId
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
    const actionIndex = user.actions.findIndex(a => a.id === parseInt(actionId) && a.category === 'health');
    
    if (actionIndex === -1) {
      return res.status(404).json({
        error: 'Acción no encontrada',
        message: 'No se encontró la acción especificada'
      });
    }

    const action = user.actions[actionIndex];
    
    // Remover acción
    user.actions.splice(actionIndex, 1);
    
    // Actualizar salud (restar impacto)
    const updatedHealth = user.updateHealth(-action.impact);
    
    // Actualizar progreso
    user.progress.totalHealthPoints = Math.max(0, user.progress.totalHealthPoints - action.impact);
    user.updateDailyProgress();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Acción removida exitosamente',
      removedAction: action,
      health: updatedHealth,
      totalHealthPoints: user.progress.totalHealthPoints
    });
  } catch (error) {
    console.error('Error removiendo acción:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al remover la acción'
    });
  }
});

// @desc    Actualizar perfil de salud
// @route   PUT /api/health/profile
// @access  Private
router.put('/profile', [
  protect,
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

    // Recalcular salud basado en el nuevo perfil
    // Aquí podrías implementar lógica más compleja para recalcular la salud
    // basada en los nuevos datos del perfil

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Perfil de salud actualizado exitosamente',
      profile: user.profile,
      bmi: user.bmi,
      ageInYears: user.ageInYears
    });
  } catch (error) {
    console.error('Error actualizando perfil de salud:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar el perfil de salud'
    });
  }
});

// @desc    Obtener estadísticas de salud
// @route   GET /api/health/stats
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
    const healthActions = user.actions.filter(a => a.category === 'health');

    const stats = {
      currentHealth: user.health.currentHealth,
      healthStatus: user.health.healthStatus,
      lifeExpectancy: user.health.lifeExpectancy,
      totalHealthPoints: user.progress.totalHealthPoints,
      habitsCount: healthHabits.length,
      actionsCount: healthActions.length,
      totalHabitsImpact: healthHabits.reduce((sum, h) => sum + h.impact, 0),
      totalActionsImpact: healthActions.reduce((sum, a) => sum + a.impact, 0),
      bmi: user.bmi,
      ageInYears: user.ageInYears,
      daysActive: user.progress.daysActive,
      streakDays: user.progress.streakDays
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener las estadísticas de salud'
    });
  }
});

export default router; 