import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import sequelize from './config/database.js';
import ventasRoutes from './routes/ventas.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Confiar en el proxy (nginx) para headers como X-Forwarded-For
app.set('trust proxy', 1);

/**
 * MIDDLEWARE DE SEGURIDAD
 */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));


// Configurar orígenes permitidos para CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://grassehouse.co',
  'https://www.grassehouse.co',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permitir envío de cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));


// Rate Limiting - Protección contra ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.'
});
app.use('/api/', limiter);

/**
 * MIDDLEWARE DE PARSEO
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/**
 * MIDDLEWARE DE LOGGING
 */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * RUTAS DE LA API
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Microservicio ERP - Grasse',
    version: '1.0.0',
    endpoints: {
      ventas: '/api/erp/ventas',
      logistica: '/api/erp/logistica (próximamente)',
      produccion: '/api/erp/produccion (próximamente)'
    }
  });
});

// Rutas de ventas
app.use('/api/erp/ventas', ventasRoutes);

/**
 * MANEJO DE ERRORES 404
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

/**
 * MANEJO DE ERRORES GLOBAL
 */
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/**
 * INICIAR SERVIDOR
 */
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ [svc-ERP] Conexión a la base de datos establecida correctamente.');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║       🏢 MICROSERVICIO ERP - GRASSE 🏢        ║
║                                                ║
║  Puerto: ${PORT}                                   ║
║  Entorno: ${process.env.NODE_ENV || 'development'}                      ║
║  Base de datos: ${process.env.DB_NAME || 'grasse_db'}                    ║
║                                                ║
║  ✅ Servidor corriendo correctamente           ║
║                                                ║
╚════════════════════════════════════════════════╝
      `);
      console.log(`📍 API disponible en: http://localhost:${PORT}`);
      console.log(`📍 Ventas: http://localhost:${PORT}/api/erp/ventas`);
    });
  } catch (error) {
    console.error('❌ [svc-ERP] Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM recibido. Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT recibido. Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

startServer();
