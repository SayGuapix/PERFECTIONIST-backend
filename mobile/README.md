# Perfectionist Mobile

App movil construida con Expo + React Native + Tamagui.

## Requisitos

- Node.js 20+
- Expo Go en dispositivo o emulador Android/iOS

## Instalacion

```bash
npm install
```

## Ejecutar

```bash
npm run start
npm run android
npm run ios
```

## Configuracion de API

La app usa por defecto:

- `http://10.0.2.2:5230/api` para emulador Android.

Para cambiarla, agrega `expo.extra.apiBaseUrl` en `app.json`.

## Ejecutar junto al backend

1. Levanta el backend en otra terminal:

```bash
dotnet run --project ../src/Perfectionist.Api/Perfectionist.Api.csproj --launch-profile http
```

2. Levanta Expo en esta carpeta:

```bash
npx expo start --lan --clear
```

Si falla la conexion de red en celular:

```bash
npx expo start --tunnel --clear
```

## Scripts de calidad

```bash
npm run lint
npm run test
```
