import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import Tip from '../models/Tip.js';

const router = express.Router();

// @desc    Obtener tips
// @route   GET /api/tips
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      category, 
      subcategory, 
      difficulty, 
      page = 1, 
      limit = 20,
      sort = 'rating' 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir filtro
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (difficulty) filter.difficulty = difficulty;

    // Construir ordenamiento
    let sortOption = {};
    switch (sort) {
      case 'rating':
        sortOption = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'usage':
        sortOption = { usageCount: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { 'rating.average': -1 };
    }

    const tips = await Tip.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Tip.countDocuments(filter);

    res.status(200).json({
      success: true,
      tips,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalTips: total,
        hasNextPage: skip + parseInt(limit) < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo tips:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los tips'
    });
  }
});

// @desc    Obtener tip aleatorio
// @route   GET /api/tips/random
// @access  Public
router.get('/random', optionalAuth, async (req, res) => {
  try {
    const { category, limit = 1 } = req.query;

    const tip = await Tip.getRandomTips(category, parseInt(limit));

    res.status(200).json({
      success: true,
      tip: tip[0] || null
    });
  } catch (error) {
    console.error('Error obteniendo tip aleatorio:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el tip aleatorio'
    });
  }
});

// @desc    Obtener tip por ID
// @route   GET /api/tips/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        error: 'Tip no encontrado',
        message: 'No se encontró el tip especificado'
      });
    }

    // Incrementar contador de uso
    tip.incrementUsage();
    await tip.save();

    res.status(200).json({
      success: true,
      tip
    });
  } catch (error) {
    console.error('Error obteniendo tip:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el tip'
    });
  }
});

// @desc    Obtener tips por impacto
// @route   GET /api/tips/impact/:type
// @access  Public
router.get('/impact/:type', optionalAuth, async (req, res) => {
  try {
    const { type } = req.params;
    const { category, limit = 10 } = req.query;

    if (!['health', 'planet'].includes(type)) {
      return res.status(400).json({
        error: 'Tipo de impacto inválido',
        message: 'El tipo debe ser health o planet'
      });
    }

    const tips = await Tip.getTipsByImpact(category, type, parseInt(limit));

    res.status(200).json({
      success: true,
      tips,
      impactType: type
    });
  } catch (error) {
    console.error('Error obteniendo tips por impacto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los tips por impacto'
    });
  }
});

// @desc    Obtener tips destacados
// @route   GET /api/tips/featured
// @access  Public
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const tips = await Tip.find({ isActive: true, isFeatured: true })
      .sort({ 'rating.average': -1, usageCount: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      tips
    });
  } catch (error) {
    console.error('Error obteniendo tips destacados:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los tips destacados'
    });
  }
});

// @desc    Buscar tips
// @route   GET /api/tips/search
// @access  Public
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, category, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'Búsqueda inválida',
        message: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir filtro de búsqueda
    const filter = {
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    if (category) {
      filter.category = category;
    }

    const tips = await Tip.find(filter)
      .sort({ 'rating.average': -1, usageCount: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Tip.countDocuments(filter);

    res.status(200).json({
      success: true,
      tips,
      searchTerm: q,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalResults: total,
        hasNextPage: skip + parseInt(limit) < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error buscando tips:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al buscar tips'
    });
  }
});

// @desc    Calificar tip
// @route   POST /api/tips/:id/rate
// @access  Private
router.post('/:id/rate', [
  protect,
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe estar entre 1 y 5')
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

    const { id } = req.params;
    const { rating } = req.body;

    const tip = await Tip.findById(id);

    if (!tip) {
      return res.status(404).json({
        error: 'Tip no encontrado',
        message: 'No se encontró el tip especificado'
      });
    }

    // Agregar calificación
    tip.addRating(rating);
    await tip.save();

    res.status(200).json({
      success: true,
      message: 'Calificación agregada exitosamente',
      rating: {
        average: tip.rating.average,
        count: tip.rating.count
      }
    });
  } catch (error) {
    console.error('Error calificando tip:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al calificar el tip'
    });
  }
});

// @desc    Obtener categorías de tips
// @route   GET /api/tips/categories
// @access  Public
router.get('/categories', optionalAuth, async (req, res) => {
  try {
    const categories = [
      {
        name: 'salud',
        label: 'Salud Personal',
        icon: '🏥',
        subcategories: [
          { name: 'nutricion', label: 'Nutrición', icon: '🍎' },
          { name: 'ejercicio', label: 'Ejercicio', icon: '🏃‍♂️' },
          { name: 'sueño', label: 'Sueño', icon: '😴' },
          { name: 'estres', label: 'Manejo del Estrés', icon: '🧘‍♀️' }
        ]
      },
      {
        name: 'planeta',
        label: 'Salud del Planeta',
        icon: '🌍',
        subcategories: [
          { name: 'reciclaje', label: 'Reciclaje', icon: '♻️' },
          { name: 'energia', label: 'Ahorro de Energía', icon: '⚡' },
          { name: 'transporte', label: 'Transporte Sostenible', icon: '🚲' },
          { name: 'agua', label: 'Conservación del Agua', icon: '💧' },
          { name: 'biodiversidad', label: 'Biodiversidad', icon: '🌱' }
        ]
      },
      {
        name: 'general',
        label: 'Consejos Generales',
        icon: '💡',
        subcategories: [
          { name: 'productividad', label: 'Productividad', icon: '📈' },
          { name: 'bienestar', label: 'Bienestar Mental', icon: '🧠' },
          { name: 'social', label: 'Impacto Social', icon: '🤝' }
        ]
      }
    ];

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener las categorías'
    });
  }
});

// @desc    Obtener estadísticas de tips
// @route   GET /api/tips/stats
// @access  Public
router.get('/stats', optionalAuth, async (req, res) => {
  try {
    const totalTips = await Tip.countDocuments({ isActive: true });
    const featuredTips = await Tip.countDocuments({ isActive: true, isFeatured: true });
    
    const categoryStats = await Tip.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const difficultyStats = await Tip.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topRatedTips = await Tip.find({ isActive: true })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(5)
      .select('title icon rating.average rating.count')
      .lean();

    const mostUsedTips = await Tip.find({ isActive: true })
      .sort({ usageCount: -1 })
      .limit(5)
      .select('title icon usageCount')
      .lean();

    const stats = {
      totalTips,
      featuredTips,
      categoryStats,
      difficultyStats,
      topRatedTips,
      mostUsedTips
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de tips:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener las estadísticas de tips'
    });
  }
});

export default router; 