# Frontend - Mi Boleta

## Requisitos

- Node.js 16 o superior
- npm (incluido con Node.js)

## Instalación

1. Clonar el repositorio o acceder al directorio del proyecto.

2. Instalar dependencias:
```
npm install
```

## Desarrollo

Para iniciar el servidor de desarrollo:
```
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Build Producción

Para crear una compilación optimizada para producción:
```
npm run build
```

Luego, para ejecutar la aplicación en modo producción:
```
npm start
```

## Linting

Para verificar el código TypeScript y eslint:
```
npm run lint
```

## Variables de Entorno

La API está configurada en `src/api/client.ts` con la URL base:
```
https://mi-boleta-api-y9dv.onrender.com/api/v1
```

Si necesitas cambiar la URL de la API, edita la línea correspondiente en ese archivo.

## Estructura del Proyecto

- `src/app/` - Páginas y rutas (Next.js app router)
- `src/components/` - Componentes reutilizables
- `src/context/` - Context API (autenticación)
- `src/api/` - Configuración del cliente HTTP
- `src/types.ts` - Tipos TypeScript
- `tailwind.config.ts` - Configuración de Tailwind CSS

## Funcionalidades

- Autenticación (login y registro)
- Panel de usuario para gestionar tickets
- Panel de administrador para ver todos los tickets
- Crear, editar y eliminar tickets
- Filtrado y búsqueda de tickets
- Paginación de resultados
