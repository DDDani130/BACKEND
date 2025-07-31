import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para proteger rutas
export const protect = async (req, res, next) => {
  let token;

  // Verificar si el token existe en el header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          error: 'Token no válido',
          message: 'El usuario asociado a este token no existe'
        });
      }

      next();
    } catch (error) {
      console.error('Error verificando token:', error);
      return res.status(401).json({
        error: 'Token no válido',
        message: 'No autorizado para acceder a esta ruta'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      error: 'Token no proporcionado',
      message: 'No autorizado para acceder a esta ruta'
    });
  }
};

// Middleware para roles específicos
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Debes iniciar sesión para acceder a esta ruta'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para acceder a esta ruta'
      });
    }

    next();
  };
};

// Middleware para verificar si el usuario es el propietario del recurso
export const checkOwnership = (resourceField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autorizado',
        message: 'Debes iniciar sesión para acceder a esta ruta'
      });
    }

    // Verificar si el usuario es admin o el propietario del recurso
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceUserId = req.params[resourceField] || req.body[resourceField];
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos para modificar este recurso'
      });
    }

    next();
  };
};

// Middleware para verificar si el usuario está verificado
export const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'No autorizado',
      message: 'Debes iniciar sesión para acceder a esta ruta'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      error: 'Cuenta no verificada',
      message: 'Debes verificar tu cuenta para acceder a esta funcionalidad'
    });
  }

  next();
};

// Middleware para actualizar último login
export const updateLastLogin = async (req, res, next) => {
  if (req.user) {
    try {
      req.user.lastLogin = new Date();
      await req.user.save();
    } catch (error) {
      console.error('Error actualizando último login:', error);
    }
  }
  next();
};

// Middleware para verificar token opcional (para rutas públicas que pueden mostrar info adicional si estás logueado)
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Si el token es inválido, simplemente continuamos sin usuario
      console.log('Token opcional inválido:', error.message);
    }
  }

  next();
}; 