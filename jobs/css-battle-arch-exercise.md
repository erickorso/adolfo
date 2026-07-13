# CSS Battle — Arch Bridge (ejercicio perfect-pixel)

> Canvas **400×300** · Fondo `#9076D8` · Tubo `#2A272F` · Grosor **50px**

## Objetivo

Recrear un tubo en forma de arco/puente con:
- Barra superior redondeada
- Dos pilares verticales
- Dos alas horizontales hasta los bordes
- Cuadrado centrado bajo el arco
- **4 coditos** (esquinas cóncavas) con radio fino

## Piezas base (6 divs)

| Clase | left | top | size | border-radius |
|-------|------|-----|------|---------------|
| top | 75 | 75 | 250×50 | 50px 50px 0 0 |
| joint-left | 75 | 125 | 50×50 | — |
| joint-right | 275 | 125 | 50×50 | — |
| wing-left | 0 | 175 | 125×50 | 0 0 50px 0 |
| wing-right | 275 | 175 | 125×50 | 0 0 0 50px |
| square | 175 | 175 | 50×50 | — |

## Técnica del codito (lo importante)

Cada esquina curva = **2 divs anidados**:

```
┌──────────────┐
│ padre .cut   │  → #2A272F (color línea), 15×15
│  ┌─────────┐ │
│  │ .mask   │ │  → #9076D8 (fondo), border-radius en 1 esquina
│  └─────────┘ │
└──────────────┘
```

El `.mask` lila con `border-radius: 50px` en **una esquina** recorta el hijo y deja ver el gris del padre en un arco = **curva cóncava perfect-pixel**.

### Posiciones finales

| Codito | left | top | `.mask` border-radius | Tipo |
|--------|------|-----|------------------------|------|
| cut-tl | 125 | 125 | 50px 0 0 0 | interno sup-izq |
| cut-tr | 260 | 125 | 0 50px 0 0 | interno sup-der |
| cut-bl | 325 | 160 | 0 0 0 50px | externo inf-der |
| cut-br | 60 | 160 | 0 0 50px 0 | externo inf-izq |

> Los coditos inferiores **no** van en (125,175)/(225,175): son codos **externos** en y=160.

## Errores que evitar

- Un solo div lila con border-radius encima del tubo
- Coditos de 50×50 cuando el radio fino pide **15×15**
- Inventar piezas extra (elbows convexos) sin medir en diff
- Asumir simetría de posiciones sin verificar en CSS Battle

## Debug recomendado

1. Colores distintos por pieza + `z-index`
2. Activar **Diff** en CSS Battle
3. Ajustar de a un codito, espejando el que ya funciona

## Archivos

| Archivo | Contenido |
|---------|-----------|
| `css-battle-arch-readable.html` | Solución legible (estudio) |
| `css-battle-arch.html` | Solución minimizada (CSS Battle score) |

## Solución FINAL — CSS Battle #266

**10 `<i>`** · módulo codito con `::before` + `scale` · **~850 chars**

```html
<i class=t></i><i class=jl></i><i class=jr></i><i class=wl></i><i class=wr></i><i class=sq></i><i class="c ctl"><i></i></i><i class="c ctr"><i></i></i><i class="c cbr"><i></i></i><i class="c cbl"><i></i></i>
<style>
body{background:#9076D8}
i{position:absolute;background:#2A272F}
.t{left:75;top:75;width:250;height:50;border-radius:50px 50px 0 0}
.jl,.jr,.sq{width:50;height:50}
.jl{left:75;top:125}
.jr{left:275;top:125}
.sq{left:175;top:175}
.wl,.wr{top:175;width:125;height:50}
.wl{left:0;border-radius:0 0 50px}
.wr{left:275;border-radius:0 0 0 50px}
.c{width:15;height:15;transform-origin:0 0}
.c>i{width:100%;height:100%}
.c>i::before{content:"";position:absolute;inset:0;background:#9076D8;border-radius:50px 0 0 0}
.ctl{left:125;top:125}
.ctr{left:275;top:125;transform:scaleX(-1)}
.cbr{left:325;top:175;transform:scaleY(-1)}
.cbl{left:75;top:175;transform:scale(-1)}
</style>
```

### Coditos finales (espejo de 1 plantilla)

| Clase | Pos | Transform |
|-------|-----|-----------|
| ctl | 125, 125 | — |
| ctr | 275, 125 | scaleX(-1) |
| cbr | 325, 175 | scaleY(-1) |
| cbl | 75, 175 | scale(-1) |
