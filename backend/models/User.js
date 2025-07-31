import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [30, 'El nombre de usuario no puede exceder 30 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  profile: {
    nombre: {
      type: String,
      trim: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    edad: {
      type: Number,
      min: [1, 'La edad debe ser mayor a 0'],
      max: [120, 'La edad no puede exceder 120 años']
    },
    peso: {
      type: Number,
      min: [20, 'El peso debe ser mayor a 20kg'],
      max: [300, 'El peso no puede exceder 300kg']
    },
    altura: {
      type: Number,
      min: [0.5, 'La altura debe ser mayor a 0.5m'],
      max: [2.5, 'La altura no puede exceder 2.5m']
    },
    genero: {
      type: String,
      enum: ['masculino', 'femenino', 'otro', 'prefiero-no-decir'],
      default: 'prefiero-no-decir'
    },
    actividad: {
      type: String,
      enum: ['sedentario', 'ligera', 'moderada', 'activa', 'muy-activa'],
      default: 'moderada'
    },
    dieta: {
      type: String,
      enum: ['omnivora', 'vegetariana', 'vegana', 'paleo', 'keto', 'mediterranea'],
      default: 'omnivora'
    },
    horasSueno: {
      type: Number,
      min: [4, 'Las horas de sueño deben ser al menos 4'],
      max: [12, 'Las horas de sueño no pueden exceder 12'],
      default: 8
    },
    estres: {
      type: String,
      enum: ['bajo', 'moderado', 'alto', 'muy-alto'],
      default: 'moderado'
    },
    consumo: {
      type: String,
      enum: ['bajo', 'moderado', 'alto'],
      default: 'moderado'
    },
    animo: {
      type: String,
      enum: ['triste', 'neutral', 'feliz', 'muy-feliz'],
      default: 'neutral'
    }
  },
  avatar: {
    equippedClothing: {
      cabeza: String,
      torso: String,
      piernas: String,
      pies: String
    },
    customizations: {
      skinColor: { type: String, default: '#FFDBB4' },
      hairColor: { type: String, default: '#8B4513' },
      eyeColor: { type: String, default: '#4A90E2' }
    }
  },
  health: {
    currentHealth: { type: Number, default: 50, min: 0, max: 100 },
    maxHealth: { type: Number, default: 100 },
    lifeExpectancy: { type: Number, default: 75 },
    healthStatus: { type: String, default: 'Neutro', enum: ['Muy Malo', 'Malo', 'Neutro', 'Bueno', 'Muy Bueno', 'Excelente'] },
    healthEmoji: { type: String, default: '😐' },
    avatarMood: { type: String, default: 'happy', enum: ['sad', 'neutral', 'happy', 'excited'] }
  },
  planet: {
    currentPlanetHealth: { type: Number, default: 45, min: 0, max: 100 },
    planetStatus: { type: String, default: 'Mejorando', enum: ['Empeorando', 'Estable', 'Mejorando', 'Excelente'] },
    planetEmoji: { type: String, default: '🌱' }
  },
  habits: [{
    id: Number,
    name: String,
    impact: Number,
    icon: String,
    category: { type: String, enum: ['health', 'planet'], required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  actions: [{
    id: Number,
    name: String,
    impact: Number,
    icon: String,
    category: { type: String, enum: ['health', 'planet'], required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  achievements: [{
    id: Number,
    name: String,
    icon: String,
    description: String,
    unlocked: { type: Boolean, default: false },
    unlockedAt: Date,
    category: { type: String, enum: ['health', 'planet', 'general'] }
  }],
  progress: {
    totalHealthPoints: { type: Number, default: 0 },
    totalPlanetPoints: { type: Number, default: 0 },
    daysActive: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    streakDays: { type: Number, default: 0 }
  },
  preferences: {
    theme: { type: String, default: 'light', enum: ['light', 'dark'] },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'es', enum: ['es', 'en'] }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar rendimiento
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'health.currentHealth': -1 });
userSchema.index({ 'planet.currentPlanetHealth': -1 });

// Virtual para calcular BMI
userSchema.virtual('bmi').get(function() {
  if (this.profile.peso && this.profile.altura) {
    return (this.profile.peso / (this.profile.altura * this.profile.altura)).toFixed(1);
  }
  return null;
});

// Virtual para calcular edad en años
userSchema.virtual('ageInYears').get(function() {
  if (this.profile.edad) {
    return this.profile.edad;
  }
  return null;
});

// Middleware para encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para actualizar salud
userSchema.methods.updateHealth = function(impact) {
  this.health.currentHealth = Math.max(0, Math.min(100, this.health.currentHealth + impact));
  
  // Actualizar estado de salud basado en puntos
  if (this.health.currentHealth >= 80) {
    this.health.healthStatus = 'Excelente';
    this.health.healthEmoji = '😄';
    this.health.avatarMood = 'excited';
  } else if (this.health.currentHealth >= 60) {
    this.health.healthStatus = 'Muy Bueno';
    this.health.healthEmoji = '😊';
    this.health.avatarMood = 'happy';
  } else if (this.health.currentHealth >= 40) {
    this.health.healthStatus = 'Bueno';
    this.health.healthEmoji = '🙂';
    this.health.avatarMood = 'happy';
  } else if (this.health.currentHealth >= 20) {
    this.health.healthStatus = 'Neutro';
    this.health.healthEmoji = '😐';
    this.health.avatarMood = 'neutral';
  } else if (this.health.currentHealth >= 10) {
    this.health.healthStatus = 'Malo';
    this.health.healthEmoji = '😕';
    this.health.avatarMood = 'sad';
  } else {
    this.health.healthStatus = 'Muy Malo';
    this.health.healthEmoji = '😢';
    this.health.avatarMood = 'sad';
  }
  
  return this.health;
};

// Método para actualizar salud del planeta
userSchema.methods.updatePlanetHealth = function(impact) {
  this.planet.currentPlanetHealth = Math.max(0, Math.min(100, this.planet.currentPlanetHealth + impact));
  
  // Actualizar estado del planeta basado en puntos
  if (this.planet.currentPlanetHealth >= 80) {
    this.planet.planetStatus = 'Excelente';
    this.planet.planetEmoji = '🌍';
  } else if (this.planet.currentPlanetHealth >= 60) {
    this.planet.planetStatus = 'Mejorando';
    this.planet.planetEmoji = '🌱';
  } else if (this.planet.currentPlanetHealth >= 40) {
    this.planet.planetStatus = 'Estable';
    this.planet.planetEmoji = '🌿';
  } else if (this.planet.currentPlanetHealth >= 20) {
    this.planet.planetStatus = 'Empeorando';
    this.planet.planetEmoji = '🌪️';
  } else {
    this.planet.planetStatus = 'Crítico';
    this.planet.planetEmoji = '🔥';
  }
  
  return this.planet;
};

// Método para agregar logro
userSchema.methods.addAchievement = function(achievementId, name, icon, description, category) {
  const existingAchievement = this.achievements.find(a => a.id === achievementId);
  
  if (!existingAchievement) {
    this.achievements.push({
      id: achievementId,
      name,
      icon,
      description,
      unlocked: true,
      unlockedAt: new Date(),
      category
    });
    return true;
  }
  
  return false;
};

// Método para actualizar progreso diario
userSchema.methods.updateDailyProgress = function() {
  const today = new Date().toDateString();
  const lastActive = this.progress.lastActiveDate.toDateString();
  
  if (today !== lastActive) {
    this.progress.daysActive += 1;
    this.progress.lastActiveDate = new Date();
    
    // Verificar streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActive === yesterday.toDateString()) {
      this.progress.streakDays += 1;
    } else {
      this.progress.streakDays = 1;
    }
  }
};

export default mongoose.model('User', userSchema); 