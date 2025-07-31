import express from 'express';
import OpenAI from 'openai';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// Función para obtener instancia de OpenAI
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
};

// Función para generar consejo personalizado
const generatePersonalizedAdvice = async (userData, context) => {
  try {
    const prompt = `
Eres un gato mascota amigable y sabio llamado "Dr. Miau" que da consejos sobre salud personal y del planeta. 
Debes ser motivador, positivo y usar emojis apropiados.

Contexto del usuario:
- Edad: ${userData.profile?.edad || 'No especificada'}
- Peso: ${userData.profile?.peso || 'No especificado'} kg
- Altura: ${userData.profile?.altura || 'No especificada'} m
- Género: ${userData.profile?.genero || 'No especificado'}
- Actividad física: ${userData.profile?.actividad || 'No especificada'}
- Dieta: ${userData.profile?.dieta || 'No especificada'}
- Horas de sueño: ${userData.profile?.horasSueno || 'No especificadas'}
- Nivel de estrés: ${userData.profile?.estres || 'No especificado'}
- Consumo: ${userData.profile?.consumo || 'No especificado'}
- Estado de ánimo: ${userData.profile?.animo || 'No especificado'}

Estado actual:
- Salud personal: ${userData.health?.currentHealth || 50}/100 (${userData.health?.healthStatus || 'Neutro'})
- Salud del planeta: ${userData.planet?.currentPlanetHealth || 45}/100 (${userData.planet?.planetStatus || 'Mejorando'})

Hábitos actuales: ${userData.habits?.map(h => h.name).join(', ') || 'Ninguno'}
Acciones recientes: ${userData.actions?.map(a => a.name).join(', ') || 'Ninguna'}

Contexto específico: ${context}

Genera un consejo personalizado, motivador y útil que:
1. Sea relevante para el estado actual del usuario
2. Considere sus hábitos y acciones recientes
3. Sea específico para su perfil (edad, peso, actividad, etc.)
4. Use un tono amigable y motivador
5. Incluya 1-2 emojis apropiados
6. Sea conciso (máximo 2 frases)
7. Sea práctico y accionable

Responde solo con el consejo, sin explicaciones adicionales.
`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres Dr. Miau, un gato mascota sabio y motivador que da consejos sobre salud personal y del planeta. Siempre sé positivo, amigable y usa emojis apropiados."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.8
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generando consejo con IA:', error);
    return getFallbackAdvice(userData, context);
  }
};

// Consejos de respaldo si la IA falla
const getFallbackAdvice = (userData, context) => {
  const healthTips = [
    "¡Hola! Recuerda beber agua cada hora para mantenerte hidratado 💧",
    "Una manzana al día mantiene al doctor lejos 🍎",
    "El ejercicio libera endorfinas, ¡la hormona de la felicidad! 🏃‍♂️",
    "Dormir bien es clave para tu salud mental y física 😴",
    "La meditación reduce el estrés y mejora la concentración 🧘‍♀️",
    "¡Mantén una postura correcta mientras trabajas! 🪑",
    "Tomar descansos regulares mejora tu productividad ⏰",
    "¡Sonríe! La felicidad es contagiosa 😊"
  ];

  const planetTips = [
    "¡Hola! Recuerda apagar las luces cuando salgas de una habitación 💡",
    "Un árbol puede absorber hasta 22kg de CO2 al año 🌳",
    "El transporte público reduce las emisiones en un 45% 🚌",
    "Los productos locales viajan menos y contaminan menos 🛒",
    "Reciclar una botella ahorra la energía de 6 horas de bombilla ♻️",
    "Usar la bici para trayectos cortos es saludable y ecológico 🚲",
    "Los productos de temporada tienen menor impacto ambiental 🌱",
    "Desconectar dispositivos ahorra energía y dinero ⚡"
  ];

  const generalTips = [
    "¡Cada pequeño paso cuenta para mejorar tu vida y el planeta! 🌟",
    "La constancia es la clave del éxito en cualquier meta 🎯",
    "Celebra tus logros, por pequeños que sean 🎉",
    "Compartir con otros multiplica el impacto positivo 🤝",
    "El aprendizaje continuo mantiene tu mente activa 📚",
    "La gratitud mejora tu bienestar emocional 🙏"
  ];

  let tips;
  if (context.includes('salud') || context.includes('health')) {
    tips = healthTips;
  } else if (context.includes('planeta') || context.includes('planet')) {
    tips = planetTips;
  } else {
    tips = [...healthTips, ...planetTips, ...generalTips];
  }

  return tips[Math.floor(Math.random() * tips.length)];
};

// @desc    Obtener consejo personalizado del gato
// @route   POST /api/ai/advice
// @access  Private
router.post('/advice', [
  protect,
  body('context')
    .optional()
    .isString()
    .withMessage('El contexto debe ser una cadena de texto')
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

    const { context = 'general' } = req.body;

    // Obtener datos actualizados del usuario
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Generar consejo personalizado
    const advice = await generatePersonalizedAdvice(user, context);

    res.status(200).json({
      success: true,
      advice,
      timestamp: new Date().toISOString(),
      context
    });
  } catch (error) {
    console.error('Error obteniendo consejo:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al generar el consejo personalizado'
    });
  }
});

// @desc    Obtener consejo basado en acción específica
// @route   POST /api/ai/action-advice
// @access  Private
router.post('/action-advice', [
  protect,
  body('action')
    .isString()
    .withMessage('La acción es requerida'),
  body('impact')
    .isNumeric()
    .withMessage('El impacto debe ser un número'),
  body('category')
    .isIn(['health', 'planet'])
    .withMessage('La categoría debe ser health o planet')
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

    const { action, impact, category } = req.body;

    // Obtener datos actualizados del usuario
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Crear contexto específico para la acción
    const context = `El usuario acaba de realizar la acción: "${action}" con un impacto de ${impact} puntos en ${category === 'health' ? 'salud personal' : 'salud del planeta'}.`;

    // Generar consejo específico para esta acción
    const advice = await generatePersonalizedAdvice(user, context);

    res.status(200).json({
      success: true,
      advice,
      action,
      impact,
      category,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo consejo de acción:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al generar el consejo para la acción'
    });
  }
});

// @desc    Obtener consejo de motivación diaria
// @route   GET /api/ai/daily-motivation
// @access  Private
router.get('/daily-motivation', protect, async (req, res) => {
  try {
    // Obtener datos actualizados del usuario
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Crear contexto para motivación diaria
    const context = `Es un nuevo día y el usuario tiene ${user.progress.streakDays} días seguidos activos. Su salud está en ${user.health.currentHealth}/100 y la del planeta en ${user.planet.currentPlanetHealth}/100.`;

    // Generar consejo motivacional
    const advice = await generatePersonalizedAdvice(user, context);

    res.status(200).json({
      success: true,
      advice,
      streakDays: user.progress.streakDays,
      healthStatus: user.health.healthStatus,
      planetStatus: user.planet.planetStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo motivación diaria:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al generar la motivación diaria'
    });
  }
});

// @desc    Obtener consejo basado en logro desbloqueado
// @route   POST /api/ai/achievement-advice
// @access  Private
router.post('/achievement-advice', [
  protect,
  body('achievementName')
    .isString()
    .withMessage('El nombre del logro es requerido'),
  body('achievementIcon')
    .isString()
    .withMessage('El icono del logro es requerido'),
  body('category')
    .isIn(['health', 'planet', 'general'])
    .withMessage('La categoría debe ser health, planet o general')
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

    const { achievementName, achievementIcon, category } = req.body;

    // Obtener datos actualizados del usuario
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se pudo encontrar la información del usuario'
      });
    }

    // Crear contexto para el logro
    const context = `¡El usuario acaba de desbloquear el logro "${achievementName}" ${achievementIcon} en la categoría ${category}!`;

    // Generar consejo de celebración
    const advice = await generatePersonalizedAdvice(user, context);

    res.status(200).json({
      success: true,
      advice,
      achievement: {
        name: achievementName,
        icon: achievementIcon,
        category
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo consejo de logro:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al generar el consejo para el logro'
    });
  }
});

export default router; 