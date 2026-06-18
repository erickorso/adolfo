# e2e/temp — pruebas E2E experimentales (NO versionadas)

Carpeta de trabajo para specs de Playwright en desarrollo o de un solo uso.

- Todo lo que pongas acá está **gitignoreado** (salvo este README y `.gitkeep`).
- Playwright igual las corre (`testDir` apunta a `/e2e`, que incluye esta subcarpeta),
  así que podés experimentar localmente sin ensuciar el repo.
- Cuando una prueba se vuelva **esencial**, movela a `/e2e` (un nivel arriba)
  para que quede trackeada por git y corra en CI.

> En CI esta carpeta no existe (no se commitea), por lo que solo se ejecutan
> las pruebas esenciales versionadas en `/e2e`.
