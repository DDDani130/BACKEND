import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware básico
app.use(cors());
app.use(express.json());

// Ruta de salud
app.get('/api/health-check', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LiveLevelUp Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Ruta de prueba para tips
app.get('/api/tips', (req, res) => {
  const mockTips = [
    {
      id: 1,
      title: 'Bebe 8 vasos de agua al día',
      content: 'Mantenerte hidratado es fundamental para tu salud.',
      category: 'salud',
      subcategory: 'nutricion',
      impact: { health: 15, planet: 0 },
      difficulty: 'facil',
      timeRequired: 'diario',
      icon: '💧',
      tags: ['hidratación', 'agua', 'salud'],
      isActive: true,
      isFeatured: true
    },
    {
      id: 2,
      title: 'Usa transporte público o bicicleta',
      content: 'El transporte público reduce las emisiones de CO2 en un 45%.',
      category: 'planeta',
      subcategory: 'transporte',
      impact: { health: 15, planet: 25 },
      difficulty: 'moderado',
      timeRequired: 'diario',
      icon: '🚌',
      tags: ['transporte', 'CO2', 'sostenibilidad'],
      isActive: true,
      isFeatured: true
    }
  ];

  res.json({
    success: true,
    tips: mockTips,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalTips: mockTips.length,
      hasNextPage: false,
      hasPrevPage: false
    }
  });
});

// Ruta de prueba para tips aleatorios
app.get('/api/tips/random', (req, res) => {
  const mockTip = {
    id: 1,
    title: 'Bebe 8 vasos de agua al día',
    content: 'Mantenerte hidratado es fundamental para tu salud.',
    category: 'salud',
    subcategory: 'nutricion',
    impact: { health: 15, planet: 0 },
    difficulty: 'facil',
    timeRequired: 'diario',
    icon: '💧',
    tags: ['hidratación', 'agua', 'salud'],
    isActive: true,
    isFeatured: true
  };

  res.json({
    success: true,
    tip: mockTip
  });
});

// Ruta de prueba para tips destacados
app.get('/api/tips/featured', (req, res) => {
  const mockFeaturedTips = [
    {
      id: 1,
      title: 'Bebe 8 vasos de agua al día',
      content: 'Mantenerte hidratado es fundamental para tu salud.',
      category: 'salud',
      subcategory: 'nutricion',
      impact: { health: 15, planet: 0 },
      difficulty: 'facil',
      timeRequired: 'diario',
      icon: '💧',
      tags: ['hidratación', 'agua', 'salud'],
      isActive: true,
      isFeatured: true
    }
  ];

  res.json({
    success: true,
    tips: mockFeaturedTips
  });
});

// Ruta de prueba para categorías
app.get('/api/tips/categories', (req, res) => {
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
    }
  ];

  res.json({
    success: true,
    categories
  });
});

// Ruta de prueba para registro
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'Datos incompletos',
      message: 'Todos los campos son requeridos'
    });
  }

  // Mock response
  res.status(201).json({
    success: true,
    token: 'mock-jwt-token-for-testing',
    user: {
      id: 'mock-user-id',
      username,
      email,
      profile: {},
      health: { currentHealth: 50, healthStatus: 'Neutro' },
      planet: { currentPlanetHealth: 45, planetStatus: 'Mejorando' },
      avatar: {},
      progress: { totalHealthPoints: 0, totalPlanetPoints: 0 },
      preferences: { theme: 'light', notifications: true, language: 'es' },
      isVerified: true
    }
  });
});

// Ruta de prueba para login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      error: 'Credenciales incompletas',
      message: 'Email y contraseña son requeridos'
    });
  }

  // Mock response
  res.status(200).json({
    success: true,
    token: 'mock-jwt-token-for-testing',
    user: {
      id: 'mock-user-id',
      username: 'testuser',
      email,
      profile: {},
      health: { currentHealth: 50, healthStatus: 'Neutro' },
      planet: { currentPlanetHealth: 45, planetStatus: 'Mejorando' },
      avatar: {},
      progress: { totalHealthPoints: 0, totalPlanetPoints: 0 },
      preferences: { theme: 'light', notifications: true, language: 'es' },
      isVerified: true
    }
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor básico corriendo en puerto ${PORT}`);
  console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health-check`);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
}); 