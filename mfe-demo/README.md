# Adolfo — Module Federation demo

Proyecto paralelo que demuestra **Webpack Module Federation** con un shell (host) y tres micro-frontends independientes.

## Arquitectura

| App | Puerto | Rol |
|-----|--------|-----|
| **host** | 3100 | Shell principal: layout, outlet de contenido, orquesta remotes |
| **remote-auth** | 3101 | Panel de login/logout (mock) |
| **remote-navbar** | 3102 | Navbar configurable vía props (`NavbarConfig`) |
| **remote-sidebar** | 3103 | Sidebar colapsable — placeholder para futuro AI chatbot |

```
┌─────────────────────────────────────────────────┐
│  remote-navbar (configurable items)             │
├──────────┬────────────────────────────────────┤
│ remote-  │  remote-auth                         │
│ sidebar  │  ─────────────────────────────────   │
│ (AI slot)│  host main template / content outlet │
└──────────┴────────────────────────────────────┘
```

## Desarrollo

```bash
cd mfe-demo
npm install
npm run dev
```

Abrir http://localhost:3100 — los remotes deben estar en 3101–3103.

## Build producción

```bash
npm run build
```

## Stack

- Webpack 5 Module Federation
- React 19 (shared singleton)
- TypeScript
- CSS BEM (sin inline styles)

## Relación con Adolfo

Demo de portfolio / entrevistas (ING, microfrontends). No comparte runtime con la app Next.js principal; es un laboratorio aislado en `mfe-demo/`.
