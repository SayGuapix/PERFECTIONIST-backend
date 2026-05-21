# PERFECTIONIST App

Proyecto fullstack para gestion financiera personal.

- Backend API REST en .NET 8
- Frontend movil/web en React Native + Expo
- Base de datos PostgreSQL

## Requisitos

- .NET 8 SDK
- Node.js 20 o superior
- PostgreSQL en `localhost:5432`
- Expo Go en el celular, o un emulador Android/iOS

La conexion por defecto de PostgreSQL esta en:

```text
src/Perfectionist.Api/appsettings.json
```

Por defecto usa:

```text
Host=localhost;Port=5432;Database=perfectionist;Username=postgres;Password=postgres
```

## Inicio de la aplicacionnnnn

Abre dos terminales desde la raiz del proyecto.

### Terminal 1: backend

```bash
dotnet run --project src/Perfectionist.Api/Perfectionist.Api.csproj --launch-profile http
```

La API queda disponible en:

- PC local: `http://localhost:5230`
- Celular en la misma red Wi-Fi: `http://TU_IP_LOCAL:5230`
- Swagger: `http://localhost:5230/swagger`

El perfil `http` escucha en `0.0.0.0:5230`, por eso Expo Go puede llamar la API desde otro dispositivo de la misma red.

### Terminal 2: frontend

La primera vez instala dependencias:

```bash
cd mobile
npm install
```

Luego inicia Expo:

```bash
npx expo start --lan --clear
```

Escanea el QR con Expo Go. Si el celular no logra abrir la app por restricciones de red, usa tunnel:

```bash
npx expo start --tunnel --clear
```

Para abrir en navegador:

```bash
npx expo start --web --clear
```

## Endpoints principales

- Autenticacion: `/api/auth`
- Categorias: `/api/categories`
- Transacciones: `/api/transactions`
- Metas: `/api/goals`
- Proyectos: `/api/projects`
- Gastos fijos: `/api/fixed-expenses`
- Dashboard: `/api/dashboard`

## Estructura

src/
  Perfectionist.Api/             API REST
  Perfectionist.Application/     Logica de negocio
  Perfectionist.Domain/          Entidades y dominio
  Perfectionist.Infrastructure/  Persistencia y servicios externos

mobile/App Expo

