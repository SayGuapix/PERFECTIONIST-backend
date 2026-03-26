# PERFECTIONIST Backend

API REST para gestión financiera personal. Backend desarrollado en .NET 8 con Entity Framework Core.

## Tecnologías

- **.NET 8** - Framework principal
- **Entity Framework Core** - ORM para base de datos
- **JWT** - Autenticación y autorización
- **AutoMapper** - Mapeo de objetos
- **FluentValidation** - Validación de datos
- **SQL Server** - Base de datos (configurable)

## Estructura del proyecto

```
src/
├── Perfectionist.Api/          # API REST (capa de presentación)
├── Perfectionist.Application/  # Lógica de negocio
├── Perfectionist.Domain/       # Entidades y dominio
└── Perfectionist.Infrastructure/ # Persistencia y servicios externos
```

## Endpoints principales

- **Autenticación**: `/api/auth`
- **Categorías**: `/api/categories`
- **Transacciones**: `/api/transactions`
- **Metas**: `/api/goals`
- **Proyectos**: `/api/projects`
- **Gastos fijos**: `/api/fixed-expenses`
- **Dashboard**: `/api/dashboard`

## Como compilar y ejecutar

### Requisitos previos

- .NET 8 SDK instalado
- SQL Server (o cualquier base de datos compatible con EF Core)

### Compilación

```bash
# Desde la raíz del proyecto
dotnet build
```

### Ejecución

```bash
# Opción 1: Desde la raíz
dotnet run --project src/Perfectionist.Api/Perfectionist.Api.csproj

# Opción 2: Navegando al directorio del API
cd src/Perfectionist.Api
dotnet run
```

### URL de acceso

- **API**: http://localhost:5230
- **Swagger UI**: http://localhost:5230/swagger

## Pruebas

### Verificar que el servidor está corriendo

```bash
curl http://localhost:5230/swagger
```

### Explorar endpoints

Accede a http://localhost:5230/swagger para ver todos los endpoints disponibles y probarlos directamente desde el navegador.

### Pruebas básicas

1. **Health check**: `GET http://localhost:5230/swagger` (debe devolver HTML de Swagger)
2. **Documentación**: Visita http://localhost:5230/swagger para ver la documentación completa de la API

## Configuración

La configuración principal se encuentra en `src/Perfectionist.Api/appsettings.json` donde puedes modificar:
- Conexión a base de datos
- Configuración de JWT
- Otros parámetros de la aplicación

## Desarrollo

Para desarrollo, se recomienda usar el perfil "Development" que incluye configuraciones especiales para desarrollo y debugging.