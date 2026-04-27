# PERFECTIONIST App

Proyecto fullstack para gestion financiera personal:

- Backend API REST en .NET 8
- Frontend movil en React Native + Expo

## Tecnologias

### Backend

- **.NET 8** - Framework principal
- **Entity Framework Core** - ORM para base de datos
- **JWT** - Autenticacion y autorizacion
- **AutoMapper** - Mapeo de objetos
- **FluentValidation** - Validacion de datos
- **PostgreSQL** - Base de datos

### Frontend movil

- **React Native + Expo**
- **Expo Router** - Navegacion
- **Tamagui** - UI moderna
- **React Query** - Cache y consumo de datos
- **Zustand** - Estado global ligero
- **Axios** - Cliente HTTP

## Estructura del proyecto

```text
src/
├── Perfectionist.Api/             # API REST (capa de presentacion)
├── Perfectionist.Application/     # Logica de negocio
├── Perfectionist.Domain/          # Entidades y dominio
└── Perfectionist.Infrastructure/  # Persistencia y servicios externos

mobile/                            # App movil Expo (React Native)
```

## Endpoints principales del backend

- **Autenticacion**: `/api/auth`
- **Categorias**: `/api/categories`
- **Transacciones**: `/api/transactions`
- **Metas**: `/api/goals`
- **Proyectos**: `/api/projects`
- **Gastos fijos**: `/api/fixed-expenses`
- **Dashboard**: `/api/dashboard`

## Como ejecutar (backend + frontend)

### Requisitos previos

- .NET 8 SDK instalado
- PostgreSQL ejecutandose en `localhost:5432`
- Node.js 20+
- Expo Go en celular o emulador Android/iOS

### 1) Levantar backend

```bash
dotnet run --project src/Perfectionist.Api/Perfectionist.Api.csproj --launch-profile http
```

URLs:

- API: `http://localhost:5230`
- Swagger: `http://localhost:5230/swagger`

### 2) Levantar frontend movil

```bash
cd mobile
npm install
npx expo start --lan --clear
```

Si tienes problemas de red en celular:

```bash
npx expo start --tunnel --clear
```

### 3) Conectar app movil al backend

La URL por defecto del frontend esta configurada para emulador Android:

- `http://10.0.2.2:5230/api`

Si necesitas cambiarla, ajusta `expo.extra.apiBaseUrl` en `mobile/app.json`.

## Modulos actuales de la app movil

- Autenticacion (login/registro)
- Dashboard financiero
- Transacciones
- Metas y proyectos
- Perfil y ajustes

## Configuracion

### Backend

La configuracion principal se encuentra en `src/Perfectionist.Api/appsettings.json` donde puedes modificar:

- Conexion a base de datos
- Configuracion de JWT
- Otros parametros de la aplicacion

### Frontend movil

La configuracion principal del frontend esta en:

- `mobile/app.json`
- `mobile/src/config/env.ts`

## Desarrollo

Para desarrollo se recomienda:

- Backend: perfil `http` (Development)
- Frontend: `npx expo start --lan --clear`