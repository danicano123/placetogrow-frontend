# Changelog

## [Released]

### [1.2.0] - 2024-08-04

#### Added
- Implementación de variable de entorno `VITE_API_URL` para configurar la URL del backend, permitiendo que se ejecute en cualquier puerto.
- Botón "Go Back" en el `PaymentsDashboard` para redirigir a la ruta `../../`.
- Funcionalidad para listar pagos por micrositio en `PaymentsDashboard`.
- Rutas para la gestión de formularios, campos de formularios y pagos con grupos de rutas y protección de rutas basada en permisos.
- Botón para visualizar pagos desde la tabla de micrositios.

#### Improved
- Configuración de Docker para frontend y backend separados.
- Configuración de `docker-compose` para descargar repositorios de backend y frontend y correrlos con un solo comando.

#### Fixed
- Correcciones en la lógica de navegación y gestión del estado.
- Corrección en la obtención de roles y permisos relacionados en las consultas de usuarios.

## [1.0.0] - 2024-07-XX

#### Added
- Implementación de la navegación con parámetros de estado.
- Protección de rutas basada en roles.
- Configuración de Redux para la gestión del estado.

#### Improved
- Configuración de Docker para el frontend.
- Configuración de GitHub Actions para CI/CD.

#### Fixed
- Correcciones en la lógica de navegación y gestión del estado.
