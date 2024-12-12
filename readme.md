# E-commerce MERN Stack

## Descripción
Sistema de comercio electrónico desarrollado con el stack MERN (MongoDB, Express.js, React y Node.js). El proyecto implementa funcionalidades completas de un e-commerce moderno, incluyendo gestión de usuarios, productos, carritos de compra y órdenes.

## Características Principales
- 🔐 Autenticación y autorización con JWT
- 🛍️ Gestión de productos y categorías
- 🛒 Carrito de compras en tiempo real
- 📦 Sistema de órdenes y seguimiento
- 👤 Perfiles de usuario personalizables
- 📱 Diseño responsivo
- 🔑 Panel de administración

## Requisitos Previos
- Node.js (v14 o superior)
- MongoDB
- NPM o Yarn

## Instalación

### Backend
```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor de desarrollo
npm run dev
```

### Frontend
```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor de desarrollo
npm run dev
```

## Estructura del Proyecto

### Backend
- `/config` - Configuraciones de la aplicación
- `/controllers` - Lógica de negocio
- `/middleware` - Middleware personalizado
- `/models` - Modelos de MongoDB
- `/routes` - Definición de rutas
- `/utils` - Utilidades y helpers

### Frontend
- `/src/components` - Componentes React reutilizables
- `/src/context` - Contextos de React (Auth, Cart)
- `/src/pages` - Páginas de la aplicación
- `/src/services` - Servicios y llamadas a API
- `/src/utils` - Utilidades y helpers

## API Endpoints

### Usuarios
- `POST /api/users/register` - Registro de usuarios
- `POST /api/users/login` - Inicio de sesión
- `GET /api/users/profile` - Obtener perfil de usuario

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto específico
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (admin)
- `DELETE /api/categories/:id` - Eliminar categoría (admin)

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Añadir producto al carrito
- `DELETE /api/cart/:productId` - Eliminar producto del carrito

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders` - Listar órdenes del usuario
- `GET /api/orders/:id` - Obtener orden específica

## Tecnologías Utilizadas

### Backend
- Express.js
- MongoDB con Mongoose
- JWT para autenticación
- Bcrypt para encriptación
- Multer para upload de archivos

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (iconos)
- Context API para gestión de estado

## Scripts Disponibles
```bash
# Desarrollo
npm run dev      # Inicia tanto backend como frontend en modo desarrollo

# Backend
npm run backend  # Inicia solo el servidor backend

# Frontend
npm run frontend # Inicia solo el cliente frontend
```

## Contribución
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia
Este proyecto está bajo la Licencia ISC.

## Autor
TuNombre - [Sitio Web](http://tusitio.com)

## Agradecimientos
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)