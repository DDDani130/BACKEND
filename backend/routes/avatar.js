import express from 'express';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// @desc    Obtener avatar del usuario
// @route   GET /api/avatar
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

    res.status(200).json({
      success: true,
      avatar: user.avatar,
      profile: user.profile
    });
  } catch (error) {
    console.error('Error obteniendo avatar:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el avatar'
    });
  }
});

// @desc    Actualizar ropa del avatar
// @route   PUT /api/avatar/clothing
// @access  Private
router.put('/clothing', [
  protect,
  body('cabeza')
    .optional()
    .isString()
    .withMessage('El item de cabeza debe ser una cadena de texto'),
  body('torso')
    .optional()
    .isString()
    .withMessage('El item de torso debe ser una cadena de texto'),
  body('piernas')
    .optional()
    .isString()
    .withMessage('El item de piernas debe ser una cadena de texto'),
  body('pies')
    .optional()
    .isString()
    .withMessage('El item de pies debe ser una cadena de texto')
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

    const { cabeza, torso, piernas, pies } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Actualizar solo los campos proporcionados
    if (cabeza !== undefined) user.avatar.equippedClothing.cabeza = cabeza;
    if (torso !== undefined) user.avatar.equippedClothing.torso = torso;
    if (piernas !== undefined) user.avatar.equippedClothing.piernas = piernas;
    if (pies !== undefined) user.avatar.equippedClothing.pies = pies;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Ropa del avatar actualizada exitosamente',
      equippedClothing: user.avatar.equippedClothing
    });
  } catch (error) {
    console.error('Error actualizando ropa del avatar:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar la ropa del avatar'
    });
  }
});

// @desc    Actualizar personalizaciones del avatar
// @route   PUT /api/avatar/customizations
// @access  Private
router.put('/customizations', [
  protect,
  body('skinColor')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('El color de piel debe ser un código hexadecimal válido'),
  body('hairColor')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('El color de pelo debe ser un código hexadecimal válido'),
  body('eyeColor')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('El color de ojos debe ser un código hexadecimal válido')
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

    const { skinColor, hairColor, eyeColor } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Actualizar solo los campos proporcionados
    if (skinColor !== undefined) user.avatar.customizations.skinColor = skinColor;
    if (hairColor !== undefined) user.avatar.customizations.hairColor = hairColor;
    if (eyeColor !== undefined) user.avatar.customizations.eyeColor = eyeColor;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Personalizaciones del avatar actualizadas exitosamente',
      customizations: user.avatar.customizations
    });
  } catch (error) {
    console.error('Error actualizando personalizaciones del avatar:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar las personalizaciones del avatar'
    });
  }
});

// @desc    Remover item de ropa del avatar
// @route   DELETE /api/avatar/clothing/:category
// @access  Private
router.delete('/clothing/:category', protect, async (req, res) => {
  try {
    const { category } = req.params;

    // Validar categoría
    const validCategories = ['cabeza', 'torso', 'piernas', 'pies'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Categoría inválida',
        message: 'La categoría debe ser: cabeza, torso, piernas o pies'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Remover el item de la categoría especificada
    user.avatar.equippedClothing[category] = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: `Item de ${category} removido exitosamente`,
      equippedClothing: user.avatar.equippedClothing
    });
  } catch (error) {
    console.error('Error removiendo item del avatar:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al remover el item del avatar'
    });
  }
});

// @desc    Obtener items de ropa disponibles
// @route   GET /api/avatar/clothing-items
// @access  Private
router.get('/clothing-items', protect, async (req, res) => {
  try {
    // Lista de items de ropa disponibles (esto podría venir de una base de datos)
    const clothingItems = {
      cabeza: [
        { id: 'gorra', name: 'Gorra', icon: '🧢', rarity: 'common' },
        { id: 'sombrero', name: 'Sombrero', icon: '🎩', rarity: 'common' },
        { id: 'gorro', name: 'Gorro', icon: '🎧', rarity: 'common' },
        { id: 'diadema', name: 'Diadema', icon: '👑', rarity: 'rare' },
        { id: 'casco', name: 'Casco', icon: '⛑️', rarity: 'common' },
        { id: 'corona', name: 'Corona', icon: '👑', rarity: 'epic' }
      ],
      torso: [
        { id: 'camiseta', name: 'Camiseta', icon: '👕', rarity: 'common' },
        { id: 'camisa', name: 'Camisa', icon: '👔', rarity: 'common' },
        { id: 'sudadera', name: 'Sudadera', icon: '🧥', rarity: 'common' },
        { id: 'vestido', name: 'Vestido', icon: '👗', rarity: 'rare' },
        { id: 'chaleco', name: 'Chaleco', icon: '🦺', rarity: 'common' },
        { id: 'traje', name: 'Traje', icon: '🤵', rarity: 'epic' }
      ],
      piernas: [
        { id: 'pantalon', name: 'Pantalón', icon: '👖', rarity: 'common' },
        { id: 'falda', name: 'Falda', icon: '👘', rarity: 'common' },
        { id: 'shorts', name: 'Shorts', icon: '🩳', rarity: 'common' },
        { id: 'leggings', name: 'Leggings', icon: '🧦', rarity: 'common' },
        { id: 'pantalon_deportivo', name: 'Pantalón Deportivo', icon: '👖', rarity: 'rare' },
        { id: 'falda_elegante', name: 'Falda Elegante', icon: '👗', rarity: 'epic' }
      ],
      pies: [
        { id: 'zapatos', name: 'Zapatos', icon: '👟', rarity: 'common' },
        { id: 'botas', name: 'Botas', icon: '👢', rarity: 'common' },
        { id: 'sandalias', name: 'Sandalias', icon: '🩴', rarity: 'common' },
        { id: 'tenis', name: 'Tenis', icon: '👞', rarity: 'common' },
        { id: 'zapatos_deportivos', name: 'Zapatos Deportivos', icon: '👟', rarity: 'rare' },
        { id: 'botas_elegantes', name: 'Botas Elegantes', icon: '👢', rarity: 'epic' }
      ]
    };

    res.status(200).json({
      success: true,
      clothingItems
    });
  } catch (error) {
    console.error('Error obteniendo items de ropa:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los items de ropa'
    });
  }
});

// @desc    Obtener colores disponibles para personalización
// @route   GET /api/avatar/colors
// @access  Private
router.get('/colors', protect, async (req, res) => {
  try {
    const colors = {
      skin: [
        { name: 'Claro', value: '#FFDBB4' },
        { name: 'Medio Claro', value: '#F1C27D' },
        { name: 'Medio', value: '#E0AC69' },
        { name: 'Medio Oscuro', value: '#C68642' },
        { name: 'Oscuro', value: '#8D5524' },
        { name: 'Muy Oscuro', value: '#3C1F0A' }
      ],
      hair: [
        { name: 'Negro', value: '#090806' },
        { name: 'Marrón Oscuro', value: '#2C1810' },
        { name: 'Marrón', value: '#8B4513' },
        { name: 'Marrón Claro', value: '#A0522D' },
        { name: 'Rubio', value: '#DAA520' },
        { name: 'Rubio Claro', value: '#F4E4BC' },
        { name: 'Pelirrojo', value: '#A52A2A' },
        { name: 'Gris', value: '#808080' },
        { name: 'Blanco', value: '#FFFFFF' }
      ],
      eyes: [
        { name: 'Marrón', value: '#8B4513' },
        { name: 'Marrón Claro', value: '#D2691E' },
        { name: 'Verde', value: '#228B22' },
        { name: 'Azul', value: '#4A90E2' },
        { name: 'Azul Claro', value: '#87CEEB' },
        { name: 'Gris', value: '#708090' },
        { name: 'Negro', value: '#000000' },
        { name: 'Ámbar', value: '#FFBF00' }
      ]
    };

    res.status(200).json({
      success: true,
      colors
    });
  } catch (error) {
    console.error('Error obteniendo colores:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los colores disponibles'
    });
  }
});

// @desc    Resetear avatar a valores por defecto
// @route   POST /api/avatar/reset
// @access  Private
router.post('/reset', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Resetear avatar a valores por defecto
    user.avatar = {
      equippedClothing: {
        cabeza: null,
        torso: null,
        piernas: null,
        pies: null
      },
      customizations: {
        skinColor: '#FFDBB4',
        hairColor: '#8B4513',
        eyeColor: '#4A90E2'
      }
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar reseteado exitosamente',
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Error reseteando avatar:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al resetear el avatar'
    });
  }
});

// @desc    Obtener avatar completo con información del usuario
// @route   GET /api/avatar/full
// @access  Private
router.get('/full', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    const fullAvatar = {
      avatar: user.avatar,
      profile: user.profile,
      health: user.health,
      planet: user.planet,
      progress: user.progress,
      bmi: user.bmi,
      ageInYears: user.ageInYears
    };

    res.status(200).json({
      success: true,
      fullAvatar
    });
  } catch (error) {
    console.error('Error obteniendo avatar completo:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el avatar completo'
    });
  }
});

export default router; 