import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

/**
 * Importar modelos compartidos del backend principal
 * Estos modelos apuntan a las mismas tablas que el backend principal
 */
const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  order_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'), defaultValue: 'confirmed' },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  shipping_address: { type: DataTypes.JSON, allowNull: false },
  billing_address: { type: DataTypes.JSON, allowNull: true },
  delivery_method: { type: DataTypes.ENUM('envio', 'pickup'), defaultValue: 'pickup' },
  payment_method: { type: DataTypes.ENUM('pse', 'mercadopago', 'wompi', 'efectivo', 'transferencia', 'credito'), allowNull: false },
  payment_responsible: { type: DataTypes.ENUM('Esteban', 'Susana', 'Javier'), allowNull: true },
  payment_status: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), defaultValue: 'paid' },
  payment_preference_id: { type: DataTypes.STRING(100), allowNull: true },
  payment_id: { type: DataTypes.STRING(100), allowNull: true },
  payment_details: { type: DataTypes.JSON, allowNull: true },
  customer_email: { type: DataTypes.STRING(255), allowNull: true },
  newsletter_consent: { type: DataTypes.BOOLEAN, defaultValue: false },
  notes: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'orders',
  underscored: true,
  timestamps: true
});

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  variant_id: { type: DataTypes.INTEGER, allowNull: true },
  house_name: { type: DataTypes.STRING(100), allowNull: false },
  fragrance_name: { type: DataTypes.STRING(150), allowNull: false },
  gender: { type: DataTypes.STRING(20), allowNull: false },
  volume: { type: DataTypes.STRING(50), allowNull: false },
  category: { type: DataTypes.STRING(100), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  fragrance_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  fragrance_purchased: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'order_items',
  underscored: true,
  timestamps: true
});

const ProductVariant = sequelize.define('ProductVariant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fragrance_id: { type: DataTypes.INTEGER, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  volume: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount_percentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'product_variants', underscored: true });

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  volume: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount_percentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  gender: { type: DataTypes.ENUM('masculino', 'femenino', 'unisex'), defaultValue: 'unisex' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  fragrance_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true }
}, { tableName: 'products', underscored: true });

const Fragrance = sequelize.define('Fragrance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  house_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  gender: { type: DataTypes.ENUM('masculino', 'femenino', 'unisex'), allowNull: false }
}, { tableName: 'fragrances', underscored: true });

const House = sequelize.define('House', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false }
}, { tableName: 'houses', underscored: true });

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  type: { type: DataTypes.ENUM('normal'), defaultValue: 'normal' },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  type_size_id: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'categories', underscored: true });

const TypeVolume = sequelize.define('TypeVolume', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: DataTypes.STRING(100), allowNull: false },
  abbreviation: { type: DataTypes.STRING(10), allowNull: false }
}, { tableName: 'type_volumes', underscored: true });

// Asociaciones
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
ProductVariant.belongsTo(Fragrance, { foreignKey: 'fragrance_id' });
ProductVariant.belongsTo(Category, { foreignKey: 'category_id' });
Fragrance.hasMany(ProductVariant, { foreignKey: 'fragrance_id' });
Category.hasMany(ProductVariant, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });
Category.belongsTo(TypeVolume, { foreignKey: 'type_size_id', as: 'typeSize' });
TypeVolume.hasMany(Category, { foreignKey: 'type_size_id' });
Fragrance.belongsTo(House, { foreignKey: 'house_id' });
House.hasMany(Fragrance, { foreignKey: 'house_id' });

/**
 * Genera un número de orden único
 */
const generateOrderNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const prefix = `ORD-${year}${month}${day}`;

  // Buscar el último número de orden del día
  const lastOrder = await Order.findOne({
    where: {
      order_number: {
        [sequelize.Sequelize.Op.like]: `${prefix}%`
      }
    },
    order: [['created_at', 'DESC']]
  });

  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.order_number.split('-').pop());
    sequence = lastSequence + 1;
  }

  return `${prefix}-${String(sequence).padStart(4, '0')}`;
};

/**
 * GET /api/erp/ventas/categorias
 * Obtener todas las categorías disponibles
 */
export const getCategorias = async (req, res) => {
  try {
    const categorias = await Category.findAll({
      where: { type: 'normal' },
      include: [
        {
          model: TypeVolume,
          as: 'typeSize',
          attributes: ['id', 'description', 'abbreviation']
        }
      ],
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { categorias }
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías'
    });
  }
};

/**
 * GET /api/erp/ventas/casas
 * Obtener todas las casas/marcas disponibles
 */
export const getCasas = async (req, res) => {
  try {
    const casas = await House.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { casas }
    });
  } catch (error) {
    console.error('Error obteniendo casas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener casas'
    });
  }
};

/**
 * GET /api/erp/ventas/productos-por-categoria/:categoryId
 * Obtener productos de una categoría específica
 */
export const getProductosPorCategoria = async (req, res) => {
  try {
    const { categoryId } = req.params;

    console.log('📦 [VENTAS] Obteniendo productos para categoría ID:', categoryId);

    const productos = await Product.findAll({
      where: {
        category_id: categoryId,
        is_active: true
      },
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'type_size_id'],
          include: [
            {
              model: TypeVolume,
              as: 'typeSize',
              attributes: ['id', 'description', 'abbreviation']
            }
          ]
        }
      ],
      attributes: ['id', 'name', 'volume', 'price', 'discount_percentage', 'gender'],
      order: [['volume', 'ASC']]
    });

    console.log('📦 [VENTAS] Productos encontrados:', productos.length);

    res.json({
      success: true,
      data: { productos }
    });
  } catch (error) {
    console.error('❌ [VENTAS] Error obteniendo productos por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos'
    });
  }
};

/**
 * GET /api/erp/ventas/fragancias/:houseId
 * Obtener fragancias de una casa específica (INDEPENDIENTE de categoría)
 */
export const getFraganciasPorCasa = async (req, res) => {
  try {
    const { houseId } = req.params;

    console.log('📦 [VENTAS] Obteniendo fragancias para casa ID:', houseId);

    const fragancias = await Fragrance.findAll({
      where: { house_id: houseId },
      include: [
        {
          model: House,
          attributes: ['id', 'name']
        }
      ],
      attributes: ['id', 'name', 'gender'],
      order: [['name', 'ASC']]
    });

    console.log('📦 [VENTAS] Fragancias encontradas:', fragancias.length);

    res.json({
      success: true,
      data: { fragancias }
    });
  } catch (error) {
    console.error('❌ [VENTAS] Error obteniendo fragancias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener fragancias'
    });
  }
};

/**
 * POST /api/erp/ventas/crear
 * Crear una venta manual desde el módulo de ventas
 */
export const crearVentaManual = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      items,           // Array de items de la orden
      customer_email,
      customer_name,
      customer_phone,
      customer_address,
      payment_method = 'efectivo',
      payment_responsible,
      notes
    } = req.body;

    // Validaciones
    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Debe agregar al menos un producto a la venta'
      });
    }

    if (!customer_name) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El nombre del cliente es obligatorio'
      });
    }

    if (!customer_phone) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El teléfono del cliente es obligatorio'
      });
    }

    if (!customer_address) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'La dirección del cliente es obligatoria'
      });
    }

    if (!payment_method) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El método de pago es obligatorio'
      });
    }

    if (!payment_responsible) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El responsable de pago es obligatorio'
      });
    }

    // Calcular totales (sin verificar stock, es infinito)
    let subtotal = 0;
    let discount_amount = 0;
    const orderItems = [];

    for (const item of items) {
      // Obtener producto para precio y detalles
      const product = await Product.findByPk(item.product_id, {
        include: [
          {
            model: Category,
            include: [
              {
                model: TypeVolume,
                as: 'typeSize',
                attributes: ['abbreviation']
              }
            ]
          }
        ],
        transaction
      });

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${item.product_id} no encontrado`
        });
      }

      console.log('🔍 [VENTAS] Producto consultado:', {
        id: product.id,
        name: product.name,
        fragrance_amount: product.fragrance_amount,
        fragrance_amount_type: typeof product.fragrance_amount
      });

      // Obtener fragancia para detalles
      const fragrance = await Fragrance.findByPk(item.fragrance_id, {
        include: [{ model: House }],
        transaction
      });

      if (!fragrance) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Fragancia con ID ${item.fragrance_id} no encontrada`
        });
      }

      // El precio viene del producto
      const unit_price = parseFloat(product.price);
      const item_discount = parseFloat(item.discount_percentage || 0);
      const discount_amount_item = (unit_price * item_discount) / 100;
      const final_unit_price = unit_price - discount_amount_item;

      const itemTotal = final_unit_price * item.quantity;
      subtotal += itemTotal;
      discount_amount += discount_amount_item * item.quantity;

      // Formatear volumen con unidad de medida
      const volume = `${product.volume}${product.Category?.typeSize?.abbreviation || ''}`;

      orderItems.push({
        variant_id: null, // No usamos variantes
        house_name: fragrance.House.name,
        fragrance_name: fragrance.name,
        gender: fragrance.gender,
        volume: volume,
        category: product.Category.name,
        quantity: item.quantity,
        unit_price: final_unit_price,
        total_price: itemTotal,
        fragrance_amount: product.fragrance_amount || null
      });

      console.log('📦 [VENTAS] Item procesado:', {
        product: product.name,
        fragrance: fragrance.name,
        price: unit_price,
        discount: item_discount,
        final_price: final_unit_price,
        quantity: item.quantity,
        total: itemTotal,
        fragrance_amount: product.fragrance_amount
      });
    }

    const total = subtotal;

    // Generar número de orden
    const orderNumber = await generateOrderNumber();

    // Crear la orden
    const order = await Order.create({
      user_id: req.user.id, // Usuario de ventas que crea la orden
      order_number: orderNumber,
      status: 'confirmed',
      subtotal,
      discount_amount,
      total,
      shipping_address: {
        name: customer_name || customer_phone,
        phone: customer_phone,
        address: customer_address,
        city: 'N/A',
        department: 'N/A',
        country: 'Colombia'
      },
      delivery_method: 'pickup',
      payment_method,
      payment_responsible,
      payment_status: 'paid',
      customer_email: customer_email || null,
      notes: notes || `Venta manual creada por ${req.user.email}`
    }, { transaction });

    // Crear los items de la orden
    for (const item of orderItems) {
      const orderItemData = {
        order_id: order.id,
        ...item
      };

      console.log('📝 [VENTAS] Creando OrderItem con datos:', JSON.stringify(orderItemData, null, 2));

      await OrderItem.create(orderItemData, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: {
        order: {
          id: order.id,
          order_number: order.order_number,
          total: order.total,
          items: orderItems
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creando venta manual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la venta'
    });
  }
};

/**
 * GET /api/erp/ventas/mis-ventas
 * Obtener ventas creadas por el usuario actual
 */
export const getMisVentas = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const ventas = await Order.findAll({
      where: {
        user_id: req.user.id
      },
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Order.count({
      where: { user_id: req.user.id }
    });

    res.json({
      success: true,
      data: {
        ventas,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas'
    });
  }
};

/**
 * GET /api/erp/pedidos/todos
 * Obtener TODOS los pedidos (para rol produccion y admin)
 *
 * Producción solo puede ver pedidos en estados: confirmed, processing, finished
 * Admin puede ver todos los pedidos
 */
export const getTodosPedidos = async (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;
    const userRole = req.user?.role;

    // Construir filtro de búsqueda
    const where = {};

    // Si es producción, solo mostrar pedidos en estados: confirmed, processing, finished
    if (userRole === 'produccion') {
      if (status) {
        // Si se especifica un status, verificar que sea uno permitido para producción
        const estadosPermitidos = ['confirmed', 'processing', 'finished'];
        if (estadosPermitidos.includes(status)) {
          where.status = status;
        } else {
          // Si intenta filtrar por un estado no permitido, retornar vacío
          return res.json({
            success: true,
            data: {
              pedidos: [],
              total: 0,
              limit: parseInt(limit),
              offset: parseInt(offset)
            }
          });
        }
      } else {
        // Si no se especifica status, mostrar solo los estados permitidos
        where.status = {
          [sequelize.Sequelize.Op.in]: ['confirmed', 'processing', 'finished']
        };
      }
    } else {
      // Para admin, aplicar filtro normal
      if (status) {
        where.status = status;
      }
    }

    const pedidos = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Order.count({ where });

    res.json({
      success: true,
      data: {
        pedidos,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedidos'
    });
  }
};

/**
 * GET /api/erp/compras/necesidades-fragancias
 * Calcular cuánta fragancia se necesita comprar según pedidos confirmados
 * Solo para rol compras y admin
 *
 * IMPORTANTE: Solo se consideran pedidos en estado 'confirmed'
 */
export const getNecesidadesFragancias = async (req, res) => {
  try {
    // Obtener solo los pedidos confirmados (confirmed)
    const pedidosActivos = await Order.findAll({
      where: {
        status: 'confirmed'
      },
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ]
    });

    // Agrupar fragancias por casa y fragancia
    // SOLO incluir items donde fragrance_purchased = false
    const necesidades = {};

    for (const pedido of pedidosActivos) {
      for (const item of pedido.items) {
        // Saltar items que ya fueron comprados
        if (item.fragrance_purchased) {
          continue;
        }

        // Usar fragrance_amount (en gramos) para calcular necesidades
        const fragranceAmount = item.fragrance_amount && !isNaN(parseFloat(item.fragrance_amount))
          ? parseFloat(item.fragrance_amount)
          : 0;

        // Crear clave única: casa + fragancia
        const key = `${item.house_name}|${item.fragrance_name}`;

        if (!necesidades[key]) {
          const fechaPedido = pedido.created_at || pedido.createdAt;
          necesidades[key] = {
            house_name: item.house_name,
            fragrance_name: item.fragrance_name,
            gender: item.gender,
            category: item.category,
            total_cantidad: 0,
            total_gramos_fragancia: 0,
            unidad: 'gr', // Siempre en gramos
            fecha_pedido_mas_antiguo: fechaPedido, // Fecha del primer pedido
            pedidos: []
          };
        }

        // Actualizar fecha si este pedido es más antiguo
        const fechaPedido = pedido.created_at || pedido.createdAt;
        if (fechaPedido && new Date(fechaPedido) < new Date(necesidades[key].fecha_pedido_mas_antiguo)) {
          necesidades[key].fecha_pedido_mas_antiguo = fechaPedido;
        }

        // Sumar cantidades
        necesidades[key].total_cantidad += item.quantity;
        necesidades[key].total_gramos_fragancia += fragranceAmount * item.quantity;
        necesidades[key].pedidos.push({
          order_number: pedido.order_number,
          quantity: item.quantity,
          volume: item.volume,
          fragrance_amount: fragranceAmount,
          status: pedido.status,
          created_at: fechaPedido
        });
      }
    }

    // Convertir objeto a array y ordenar por fecha (más antigua primero = mayor prioridad)
    const necesidadesArray = Object.values(necesidades).sort(
      (a, b) => new Date(a.fecha_pedido_mas_antiguo) - new Date(b.fecha_pedido_mas_antiguo)
    );

    // Calcular total de productos
    const totalProductos = necesidadesArray.reduce((sum, item) => sum + item.total_cantidad, 0);

    res.json({
      success: true,
      data: {
        necesidades: necesidadesArray,
        total_fragancias: necesidadesArray.length,
        total_pedidos_activos: pedidosActivos.length,
        total_productos: totalProductos
      }
    });
  } catch (error) {
    console.error('Error calculando necesidades de fragancias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al calcular necesidades de fragancias'
    });
  }
};

/**
 * POST /api/erp/ventas/cambiar-estado-pedidos-activos
 * Cambiar el estado de todos los pedidos activos (confirmed)
 * Solo para rol compras y admin
 *
 * Si hay fragancias_agotadas, los pedidos que contienen esas fragancias
 * se mantienen en 'confirmed' y NO se cambian a 'processing'
 */
export const cambiarEstadoPedidosActivos = async (req, res) => {
  try {
    const { nuevo_estado, fragancias_agotadas } = req.body;

    // Validar que se proporcionó un nuevo estado
    if (!nuevo_estado) {
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado es requerido'
      });
    }

    // Validar que el nuevo estado es válido
    const estadosValidos = ['pending', 'confirmed', 'processing', 'finished', 'shipped', 'delivered', 'cancelled'];
    if (!estadosValidos.includes(nuevo_estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }

    let pedidosActualizados = 0;
    let itemsMarcadosComoPurchased = 0;

    // Si hay fragancias agotadas, marcar solo las NO agotadas como purchased
    if (fragancias_agotadas && fragancias_agotadas.length > 0) {
      console.log(`⚠️ [COMPRAS] Fragancias agotadas recibidas:`, fragancias_agotadas);

      // Parsear las fragancias agotadas (formato: "fragrance_name / house_name")
      const fraganciasParseadas = fragancias_agotadas.map(str => {
        const partes = str.split(' / ').map(p => p.trim());
        return {
          fragrance_name: partes[0],
          house_name: partes[1]
        };
      });

      console.log(`🔍 [COMPRAS] Fragancias parseadas:`, fraganciasParseadas);

      // Obtener todos los pedidos confirmed
      const pedidosConfirmed = await Order.findAll({
        where: { status: 'confirmed' },
        include: [{
          model: OrderItem,
          as: 'items'
        }]
      });

      // Marcar como purchased los items que NO están en la lista de agotadas
      for (const pedido of pedidosConfirmed) {
        for (const item of pedido.items) {
          // Verificar si este item está en la lista de agotadas
          const estaAgotada = fraganciasParseadas.some(f =>
            f.fragrance_name === item.fragrance_name &&
            f.house_name === item.house_name
          );

          // Si NO está agotada y NO ha sido marcada como purchased, marcarla
          if (!estaAgotada && !item.fragrance_purchased) {
            await item.update({ fragrance_purchased: true });
            itemsMarcadosComoPurchased++;
          }
        }
      }

      console.log(`✅ [COMPRAS] ${itemsMarcadosComoPurchased} item(s) marcado(s) como purchased`);

      // Ahora actualizar el estado de los pedidos que ya no tienen items pendientes
      for (const pedido of pedidosConfirmed) {
        // Recargar items para obtener valores actualizados
        await pedido.reload({ include: [{ model: OrderItem, as: 'items' }] });

        // Verificar si TODOS los items de este pedido ya fueron purchased
        const todosPurchased = pedido.items.every(item => item.fragrance_purchased);

        if (todosPurchased) {
          await pedido.update({ status: nuevo_estado });
          pedidosActualizados++;
          console.log(`📦 [COMPRAS] Pedido ${pedido.order_number} cambiado a "${nuevo_estado}" (todos los items purchased)`);
        } else {
          console.log(`⏸️ [COMPRAS] Pedido ${pedido.order_number} mantenido en "confirmed" (aún hay items pendientes)`);
        }
      }
    } else {
      // Si no hay fragancias agotadas, marcar TODOS los items como purchased
      const pedidosConfirmed = await Order.findAll({
        where: { status: 'confirmed' },
        include: [{
          model: OrderItem,
          as: 'items'
        }]
      });

      for (const pedido of pedidosConfirmed) {
        for (const item of pedido.items) {
          if (!item.fragrance_purchased) {
            await item.update({ fragrance_purchased: true });
            itemsMarcadosComoPurchased++;
          }
        }
      }

      console.log(`✅ [COMPRAS] ${itemsMarcadosComoPurchased} item(s) marcado(s) como purchased`);

      // Cambiar todos los pedidos confirmed a nuevo estado
      [pedidosActualizados] = await Order.update(
        { status: nuevo_estado },
        { where: { status: 'confirmed' } }
      );

      console.log(`📦 [COMPRAS] ${pedidosActualizados} pedido(s) cambiado(s) a "${nuevo_estado}"`);
    }

    res.json({
      success: true,
      data: {
        pedidos_actualizados: pedidosActualizados,
        items_marcados_como_purchased: itemsMarcadosComoPurchased,
        nuevo_estado,
        fragancias_agotadas: fragancias_agotadas || []
      }
    });
  } catch (error) {
    console.error('Error cambiando estado de pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado de los pedidos'
    });
  }
};

/**
 * PUT /api/erp/ventas/pedido/:orderId/estado
 * Cambiar el estado de un pedido individual
 * Solo para rol produccion y admin
 */
export const cambiarEstadoPedido = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { nuevo_estado } = req.body;

    // Validar que se proporcionó un nuevo estado
    if (!nuevo_estado) {
      return res.status(400).json({
        success: false,
        message: 'El nuevo estado es requerido'
      });
    }

    // Validar que el nuevo estado es válido
    const estadosValidos = ['pending', 'confirmed', 'processing', 'finished', 'shipped', 'delivered', 'cancelled'];
    if (!estadosValidos.includes(nuevo_estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }

    // Buscar el pedido con sus items
    const pedido = await Order.findByPk(orderId, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    // ⚠️ VALIDACIÓN: Si el nuevo estado es "finished", verificar que NO haya fragancias agotadas
    if (nuevo_estado === 'finished') {
      const fraganciasAgotadas = pedido.items.filter(item => !item.fragrance_purchased);

      if (fraganciasAgotadas.length > 0) {
        // Construir mensaje con las fragancias agotadas
        const listaAgotadas = fraganciasAgotadas.map(item =>
          `${item.fragrance_name} / ${item.house_name}`
        ).join(', ');

        console.log(`⚠️ [PRODUCCIÓN] No se puede marcar como "finished" el pedido ${pedido.order_number}. Fragancias agotadas: ${listaAgotadas}`);

        return res.status(400).json({
          success: false,
          message: `No se puede marcar como finalizado. Las siguientes fragancias están agotadas y pendientes de compra: ${listaAgotadas}`,
          fragancias_agotadas: fraganciasAgotadas.map(item => ({
            fragrance_name: item.fragrance_name,
            house_name: item.house_name,
            quantity: item.quantity
          }))
        });
      }
    }

    const estadoAnterior = pedido.status;

    // Actualizar el estado
    await pedido.update({ status: nuevo_estado });

    console.log(`📦 [PRODUCCIÓN] Pedido ${pedido.order_number} cambiado de "${estadoAnterior}" a "${nuevo_estado}"`);

    res.json({
      success: true,
      data: {
        order_id: pedido.id,
        order_number: pedido.order_number,
        estado_anterior: estadoAnterior,
        nuevo_estado: nuevo_estado
      }
    });
  } catch (error) {
    console.error('Error cambiando estado del pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del pedido'
    });
  }
};
