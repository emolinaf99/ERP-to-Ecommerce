import jwt from 'jsonwebtoken';

/**
 * Middleware de autenticación compartida con el backend principal
 * Verifica el token JWT en las cookies
 */
export const authenticate = (req, res, next) => {
  try {
    console.log('🔐 [ERP AUTH] Cookies recibidas:', Object.keys(req.cookies));
    console.log('🔐 [ERP AUTH] Cookie token existe:', !!req.cookies.token);
    console.log('🔐 [ERP AUTH] Todas las cookies:', req.cookies);

    const token = req.cookies.token || req.cookies.authToken;

    if (!token) {
      console.error('🔐 [ERP AUTH] ❌ No se encontró token en cookies');
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado. Token no proporcionado.'
      });
    }

    console.log('🔐 [ERP AUTH] ✅ Token encontrado, verificando...');

    // Verificar el token usando el mismo JWT_SECRET que el backend principal
    console.log('🔐 [ERP AUTH] JWT_SECRET configurado:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('🔐 [ERP AUTH] ✅ Token verificado, usuario:', decoded.email, 'rol:', decoded.role);

    // Agregar información del usuario al request
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role,
      first_name: decoded.first_name,
      last_name: decoded.last_name
    };

    console.log('🔐 [ERP AUTH] ✅ Usuario autenticado:', req.user.email);
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor inicia sesión nuevamente.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido.'
    });
  }
};

/**
 * Middleware de autorización por roles
 * Permite el acceso solo a los roles especificados
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Usuario no autenticado.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};
