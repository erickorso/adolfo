# CSS Battle #266 — Golf vs perfect-pixel

## Dos filosofías

| Enfoque | Chars | Elementos | Uso |
|---------|-------|-----------|-----|
| **Perfect-pixel** (nuestro) | ~970 | 10 | Aprender geometría, coditos anidados |
| **Golf leaderboard** | ~165 | 1–2 | `box-shadow` clona rectángulos |

Los del leaderboard **no construyen pieza a pieza**. Clonan un rectángulo con sombras.

## Técnica golf: 1 `<a>` + box-shadow

Base: cuadrado **50×50** en el pilar izquierdo `(75,125)`. Cada sombra = otra pieza del tubo.

```
box-shadow:
  0 -50px 0 100px   → top 250×50  (spread 100 → 50+200=250)
  200px 0           → pilar der
  -75px 50px 0 37.5px → ala izq 125×50
  200px 50px 0 37.5px → ala der
  100px 50px        → cuadrado centro
```

### Trucos de ahorro

1. **`+` en lugar de espacios** en `style` → sin comillas
2. **Sin `px`** donde el browser lo permita
3. **`color:#2A272F`** + sombras sin color (heredan `currentColor`)
4. **Sin `<div>`** — tag suelto `<p>` o `<a>` sin cerrar
5. **Sin `position:absolute`** — solo `margin:125 0 0 75`
6. **`* { background:#9076D8 }`** en vez de body explícito

### Borrador ~148–170 chars (solo rectángulos)

```html
<a style=margin:125+0+0+75;width:50;height:50;color:#2A272F;background:currentColor;box-shadow:0+-50+0+100,200+0,-75+50+0+37.5,200+50+0+37.5,100+50>
```

> Sin `border-radius` en top, alas ni coditos cóncavos — no da 100% match del target.

## Qué falta para 100% a ~165 chars

Los **coditos** y curvas externas obligan a:

- `border-radius` en el elemento base (afecta **todas** las sombras), o
- `radial-gradient` en `background` (espacio negativo), o
- 1–2 elementos extra mínimos solo para curvas

Los top players combinan `box-shadow` + **1 gradiente** o aceptan `border-radius` global con offsets milimétricos.

## Referencias

- [CSS Battle — Getting Started (golf)](https://cssbattle.dev/blog/getting-started)
- [Box-shadow battles](https://anamartins.github.io/blog/posts/css-battles/)
- [CSS-Tricks golfing](https://css-tricks.com/a-css-golfing-exercise/)

## Archivos

| Archivo | Enfoque |
|---------|---------|
| `css-battle-arch-readable.html` | Didáctico, coditos 2-div |
| `css-battle-arch.html` | Minimizado multi-div (~970) |
| `css-battle-arch-golf.html` | Experimento 1-elemento |
