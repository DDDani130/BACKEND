import express from 'express';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import Community from '../models/Community.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Obtener mensajes de la comunidad
// @route   GET /api/community/messages
// @access  Private
router.get('/messages', protect, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category = 'all',
      sort = 'newest' 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir filtro
    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Construir ordenamiento
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'popular':
        sortOption = { 'likes.length': -1, createdAt: -1 };
        break;
      case 'mostReplies':
        sortOption = { 'replies.length': -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const messages = await Community.find(filter)
      .populate('user', 'username profile.avatar')
      .populate('likes.user', 'username')
      .populate('replies.user', 'username')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Community.countDocuments(filter);

    res.status(200).json({
      success: true,
      messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalMessages: total,
        hasNextPage: skip + parseInt(limit) < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los mensajes de la comunidad'
    });
  }
});

// @desc    Crear nuevo mensaje
// @route   POST /api/community/messages
// @access  Private
router.post('/messages', [
  protect,
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('El mensaje debe tener entre 1 y 500 caracteres'),
  body('category')
    .optional()
    .isIn(['salud', 'planeta', 'general', 'consejos', 'logros'])
    .withMessage('Categoría inválida'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Los tags deben ser un array')
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

    const { message, category = 'general', tags = [] } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    const newMessage = await Community.create({
      user: req.user.id,
      username: user.username,
      message,
      category,
      tags: tags.slice(0, 5) // Máximo 5 tags
    });

    // Poblar la información del usuario
    await newMessage.populate('user', 'username profile.avatar');

    res.status(201).json({
      success: true,
      message: 'Mensaje creado exitosamente',
      data: newMessage
    });
  } catch (error) {
    console.error('Error creando mensaje:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al crear el mensaje'
    });
  }
});

// @desc    Obtener mensaje específico
// @route   GET /api/community/messages/:messageId
// @access  Private
router.get('/messages/:messageId', protect, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Community.findById(messageId)
      .populate('user', 'username profile.avatar')
      .populate('likes.user', 'username')
      .populate('replies.user', 'username');

    if (!message) {
      return res.status(404).json({
        error: 'Mensaje no encontrado',
        message: 'No se encontró el mensaje especificado'
      });
    }

    // Incrementar contador de vistas
    message.incrementViews();
    await message.save();

    res.status(200).json({
      success: true,
      message: message
    });
  } catch (error) {
    console.error('Error obteniendo mensaje:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el mensaje'
    });
  }
});

// @desc    Actualizar mensaje
// @route   PUT /api/community/messages/:messageId
// @access  Private
router.put('/messages/:messageId', [
  protect,
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('El mensaje debe tener entre 1 y 500 caracteres'),
  body('category')
    .optional()
    .isIn(['salud', 'planeta', 'general', 'consejos', 'logros'])
    .withMessage('Categoría inválida'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Los tags deben ser un array')
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

    const { messageId } = req.params;
    const { message, category, tags } = req.body;

    const communityMessage = await Community.findById(messageId);

    if (!communityMessage) {
      return res.status(404).json({
        error: 'Mensaje no encontrado',
        message: 'No se encontró el mensaje especificado'
      });
    }

    // Verificar que el usuario sea el propietario del mensaje
    if (communityMessage.user.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para editar este mensaje'
      });
    }

    // Actualizar mensaje
    communityMessage.message = message;
    if (category) communityMessage.category = category;
    if (tags) communityMessage.tags = tags.slice(0, 5);
    communityMessage.isEdited = true;
    communityMessage.editedAt = new Date();

    await communityMessage.save();

    res.status(200).json({
      success: true,
      message: 'Mensaje actualizado exitosamente',
      data: communityMessage
    });
  } catch (error) {
    console.error('Error actualizando mensaje:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar el mensaje'
    });
  }
});

// @desc    Eliminar mensaje
// @route   DELETE /api/community/messages/:messageId
// @access  Private
router.delete('/messages/:messageId', protect, async (req, res) => {
  try {
    const { messageId } = req.params;

    const communityMessage = await Community.findById(messageId);

    if (!communityMessage) {
      return res.status(404).json({
        error: 'Mensaje no encontrado',
        message: 'No se encontró el mensaje especificado'
      });
    }

    // Verificar que el usuario sea el propietario del mensaje
    if (communityMessage.user.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para eliminar este mensaje'
      });
    }

    await Community.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: 'Mensaje eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando mensaje:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al eliminar el mensaje'
    });
  }
});

// @desc    Dar like a un mensaje
// @route   POST /api/community/messages/:messageId/like
// @access  Private
router.post('/messages/:messageId/like', protect, async (req, res) => {
  try {
    const { messageId } = req.params;

    const communityMessage = await Community.findById(messageId);

    if (!communityMessage) {
      return res.status(404).json({
        error: 'Mensaje no encontrado',
        message: 'No se encontró el mensaje especificado'
      });
    }

    const wasAdded = communityMessage.addLike(req.user.id);
    await communityMessage.save();

    res.status(200).json({
      success: true,
      message: wasAdded ? 'Like agregado exitosamente' : 'Like removido exitosamente',
      likeCount: communityMessage.likes.length,
      isLiked: wasAdded
    });
  } catch (error) {
    console.error('Error dando like:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar el like'
    });
  }
});

// @desc    Responder a un mensaje
// @route   POST /api/community/messages/:messageId/reply
// @access  Private
router.post('/messages/:messageId/reply', [
  protect,
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('La respuesta debe tener entre 1 y 300 caracteres')
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

    const { messageId } = req.params;
    const { message } = req.body;

    const communityMessage = await Community.findById(messageId);

    if (!communityMessage) {
      return res.status(404).json({
        error: 'Mensaje no encontrado',
        message: 'No se encontró el mensaje especificado'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    communityMessage.addReply(req.user.id, user.username, message);
    await communityMessage.save();

    res.status(200).json({
      success: true,
      message: 'Respuesta agregada exitosamente',
      replyCount: communityMessage.replies.length
    });
  } catch (error) {
    console.error('Error agregando respuesta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al agregar la respuesta'
    });
  }
});

// @desc    Buscar mensajes
// @route   GET /api/community/search
// @access  Private
router.get('/search', protect, async (req, res) => {
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
      $or: [
        { message: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    if (category && category !== 'all') {
      filter.category = category;
    }

    const messages = await Community.find(filter)
      .populate('user', 'username profile.avatar')
      .populate('likes.user', 'username')
      .populate('replies.user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Community.countDocuments(filter);

    res.status(200).json({
      success: true,
      messages,
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
    console.error('Error buscando mensajes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al buscar mensajes'
    });
  }
});

// @desc    Obtener mensajes populares
// @route   GET /api/community/popular
// @access  Private
router.get('/popular', protect, async (req, res) => {
  try {
    const { limit = 10, period = 'week' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'day':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
        break;
      case 'week':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case 'month':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
    }

    const popularMessages = await Community.find(dateFilter)
      .populate('user', 'username profile.avatar')
      .sort({ 'likes.length': -1, 'replies.length': -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      messages: popularMessages,
      period
    });
  } catch (error) {
    console.error('Error obteniendo mensajes populares:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los mensajes populares'
    });
  }
});

// @desc    Obtener estadísticas de la comunidad
// @route   GET /api/community/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalMessages = await Community.countDocuments();
    const totalUsers = await Community.distinct('user').countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const messagesToday = await Community.countDocuments({
      createdAt: { $gte: today }
    });

    const mostActiveCategory = await Community.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const stats = {
      totalMessages,
      totalUsers,
      messagesToday,
      mostActiveCategory: mostActiveCategory[0]?.category || 'general'
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener las estadísticas de la comunidad'
    });
  }
});

export default router; 