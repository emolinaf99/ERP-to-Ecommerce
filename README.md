# svc-ERP - Microservicio ERP para Grasse

Microservicio independiente para gestionar operaciones de ERP (Ventas, Compras y Producción) de Grasse.

## Características

- **Arquitectura de Microservicios**: Independiente del backend principal
- **Autenticación Compartida**: Utiliza el mismo sistema JWT que el backend principal
- **Base de Datos Compartida**: Accede a las mismas tablas que el ecommerce
- **Módulos**:
  - ✅ **Ventas**: Crear ventas manuales de pedidos por Instagram, WhatsApp, etc.
  - 🚧 **Compras**: Gestión de logistica (próximamente)
  - 🚧 **Producción**: Control de producción (próximamente)

## Instalación

```bash
cd svc-ERP
npm install
```

## Configuración

1. Copiar el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Configurar las variables de entorno en `.env`:
   - `PORT`: Puerto del microservicio (por defecto 3001)
   - `DB_*`: Credenciales de la base de datos (debe ser la misma que el backend principal)
   - `JWT_SECRET`: **IMPORTANTE** Debe ser el mismo que el backend principal
   - `FRONTEND_URL`: URL del frontend (para CORS)

## Uso

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

## Endpoints Disponibles

### Módulo de Ventas (`/api/erp/ventas`)

Todos los endpoints requieren autenticación y rol `ventas` o `admin`.

#### Obtener Categorías
```
GET /api/erp/ventas/categorias
```

#### Obtener Casas/Marcas
```
GET /api/erp/ventas/casas
```

#### Obtener Fragancias por Casa
```
GET /api/erp/ventas/fragancias/:houseId
```

#### Obtener Variantes por Fragancia
```
GET /api/erp/ventas/variantes/:fragranceId
```

#### Crear Venta Manual
```
POST /api/erp/ventas/crear
Content-Type: application/json

{
  "items": [
    {
      "variant_id": 1,
      "quantity": 2
    }
  ],
  "customer_email": "cliente@example.com",
  "customer_name": "Juan Pérez",
  "customer_phone": "3001234567",
  "payment_method": "efectivo",
  "notes": "Venta por WhatsApp"
}
```

#### Obtener Mis Ventas
```
GET /api/erp/ventas/mis-ventas?limit=50&offset=0
```

## Arquitectura

### Estructura de Directorios
```
svc-ERP/
├── config/           # Configuración (database, etc.)
├── controllers/      # Lógica de negocio
├── middleware/       # Autenticación, autorización
├── models/          # Modelos compartidos con el backend
├── routes/          # Definición de rutas
├── utils/           # Utilidades
├── App.js           # Servidor principal
├── package.json     # Dependencias
└── .env             # Variables de entorno
```

### Flujo de Autenticación

1. El usuario inicia sesión en el frontend principal
2. El backend principal genera un JWT y lo guarda en cookies
3. El frontend hace peticiones al microservicio ERP
4. El microservicio valida el JWT usando el mismo `JWT_SECRET`
5. Si el token es válido y el rol es correcto, permite el acceso

## Usuarios ERP por Defecto

Al inicializar el backend principal, se crean automáticamente:

| Email | Contraseña | Rol |
|-------|------------|-----|
| ventas@grassehouse.co | Grasse2026* | ventas |
| compras@grassehouse.co | Grasse2026* | compras |
| produccion@grassehouse.co | Grasse2026* | produccion |

## Ventajas de la Arquitectura de Microservicios

1. **Separación de Preocupaciones**: El ERP está completamente separado del ecommerce
2. **Escalabilidad**: Cada servicio puede escalar independientemente
3. **Mantenibilidad**: Código más organizado y fácil de mantener
4. **Venta Independiente**: Puedes vender el ecommerce sin el ERP o viceversa
5. **Desarrollo Paralelo**: Diferentes equipos pueden trabajar en cada servicio

## Notas de Seguridad

- ⚠️ **JWT_SECRET**: DEBE ser el mismo que el backend principal
- ⚠️ **Base de Datos**: Comparte la base de datos con el backend principal
- ⚠️ **CORS**: Configurar correctamente `FRONTEND_URL`
- ⚠️ **Rate Limiting**: Implementado para evitar abuso
