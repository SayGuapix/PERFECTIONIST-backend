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

## Inicio rapido

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

## Como se conecta el frontend con la API

La app calcula la URL automaticamente en `mobile/src/config/env.ts`:

- Web usa `http://localhost:5230/api`.
- Expo Go en celular usa la IP LAN que Expo detecta, por ejemplo `http://192.168.1.19:5230/api`.
- Emulador Android, si Expo no entrega una IP LAN, usa `http://10.0.2.2:5230/api`.

Normalmente no necesitas editar `mobile/app.json`.

Solo define `expo.extra.apiBaseUrl` si quieres forzar manualmente una URL especifica:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://TU_IP_LOCAL:5230/api"
    }
  }
}
```

No dejes una IP fija antigua en `app.json`, porque cambia cuando cambias de red y rompe web o Expo Go.

## Si aparece "No se pudo conectar con el servidor"

Revisa en este orden:

1. El backend debe estar corriendo con el perfil `http`.
2. Swagger debe abrir en `http://localhost:5230/swagger`.
3. PC y celular deben estar en la misma red Wi-Fi si usas `--lan`.
4. Windows Firewall debe permitir conexiones entrantes a .NET en el puerto `5230`.
5. Si la red bloquea LAN, inicia Expo con `npx expo start --tunnel --clear`.

## Si Expo Go muestra "Something went wrong"

Prueba este arranque limpio:

```bash
cd mobile
npx expo start --lan --clear
```

Si sigue fallando:

```bash
npx expo-doctor
npx tsc --noEmit
npm run lint
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

```text
src/
  Perfectionist.Api/             API REST
  Perfectionist.Application/     Logica de negocio
  Perfectionist.Domain/          Entidades y dominio
  Perfectionist.Infrastructure/  Persistencia y servicios externos

mobile/                          App Expo
```
