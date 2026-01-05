import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getCategorias,
  getCasas,
  getProductosPorCategoria,
  getFraganciasPorCasa,
  crearVentaManual,
  getMisVentas,
  getTodosPedidos,
  getNecesidadesFragancias,
  cambiarEstadoPedidosActivos,
  cambiarEstadoPedido
} from '../controllers/ventasController.js';

const router = express.Router();

/**
 * Todas las rutas de ventas requieren autenticación
 * Solo los usuarios con rol 'ventas' o 'admin' pueden acceder
 */

// Rutas para obtener datos necesarios para crear ventas
// Flujo SIMPLIFICADO:
//   1. Categoría → Producto (con precio y stock)
//   2. Casa → Fragancia (independiente, solo etiqueta)
//   3. Producto + Fragancia = Venta (precio viene del producto)

// Paso 1: Seleccionar categoría y obtener productos (con precio)
router.get('/categorias', authenticate, authorize('ventas', 'admin'), getCategorias);
router.get('/productos-por-categoria/:categoryId', authenticate, authorize('ventas', 'admin'), getProductosPorCategoria);

// Paso 2: Seleccionar casa y obtener fragancias (independiente)
router.get('/casas', authenticate, authorize('ventas', 'admin'), getCasas);
router.get('/fragancias/:houseId', authenticate, authorize('ventas', 'admin'), getFraganciasPorCasa);

// Rutas para gestionar ventas
router.post('/crear', authenticate, authorize('ventas', 'admin'), crearVentaManual);
router.get('/mis-ventas', authenticate, authorize('ventas', 'admin'), getMisVentas);

// Ruta para obtener todos los pedidos (producción y admin)
router.get('/todos-pedidos', authenticate, authorize('produccion', 'admin'), getTodosPedidos);

// Ruta para obtener necesidades de fragancias (logistica y admin)
router.get('/necesidades-fragancias', authenticate, authorize('logistica', 'admin'), getNecesidadesFragancias);

// Ruta para cambiar el estado de pedidos activos (logistica y admin)
router.post('/cambiar-estado-pedidos-activos', authenticate, authorize('logistica', 'admin'), cambiarEstadoPedidosActivos);

// Ruta para cambiar el estado de un pedido individual (producción y admin)
router.put('/pedido/:orderId/estado', authenticate, authorize('produccion', 'admin'), cambiarEstadoPedido);

export default router;
