import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    trim: true,
    maxlength: [500, 'El contenido no puede exceder 500 caracteres']
  },
  category: {
    type: String,
    enum: ['salud', 'planeta', 'general'],
    required: true
  },
  subcategory: {
    type: String,
    enum: ['nutricion', 'ejercicio', 'sueño', 'estres', 'reciclaje', 'energia', 'transporte', 'agua', 'biodiversidad', 'bienestar', 'productividad', 'social'],
    required: true
  },
  impact: {
    health: {
      type: Number,
      min: -50,
      max: 50,
      default: 0
    },
    planet: {
      type: Number,
      min: -50,
      max: 50,
      default: 0
    }
  },
  difficulty: {
    type: String,
    enum: ['facil', 'moderado', 'dificil'],
    default: 'moderado'
  },
  timeRequired: {
    type: String,
    enum: ['5min', '15min', '30min', '1hora', 'diario'],
    default: '15min'
  },
  icon: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  source: {
    name: String,
    url: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Índices para mejorar rendimiento
tipSchema.index({ category: 1, subcategory: 1 });
tipSchema.index({ isActive: 1, isFeatured: 1 });
tipSchema.index({ tags: 1 });
tipSchema.index({ 'rating.average': -1 });
tipSchema.index({ usageCount: -1 });

// Método para incrementar uso
tipSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
};

// Método para agregar rating
tipSchema.methods.addRating = function(rating) {
  const totalRating = this.rating.average * this.rating.count + rating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
};

// Método para obtener tips aleatorios
tipSchema.statics.getRandomTips = async function(category, limit = 5) {
  const query = { isActive: true };
  if (category) {
    query.category = category;
  }
  
  return await this.aggregate([
    { $match: query },
    { $sample: { size: limit } }
  ]);
};

// Método para obtener tips por impacto
tipSchema.statics.getTipsByImpact = async function(category, impactType, limit = 10) {
  const query = { isActive: true };
  if (category) {
    query.category = category;
  }
  
  const sortField = `impact.${impactType}`;
  
  return await this.find(query)
    .sort({ [sortField]: -1 })
    .limit(limit);
};

export default mongoose.model('Tip', tipSchema); 