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

- `http://10.0.2.2:5269/api` para emulador Android.

Para cambiarla, agrega `expo.extra.apiBaseUrl` en `app.json`.

## Scripts de calidad

```bash
npm run lint
npm run test
```
