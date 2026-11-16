# PokéEquipos – Constructor de equipos Pokémon

Aplicación web desarrollada con **Angular 22** que consume **[PokéAPI](https://pokeapi.co)**.
Permite buscar Pokémon, consultar su información y **armar un equipo de hasta 6 Pokémon**,
analizando automáticamente contra qué tipos es débil o resistente el equipo.

**Sitio desplegado:** _URL_VERCEL_

> Práctica 02 – Programación y Plataformas Web · Universidad Politécnica Salesiana

## Propósito

Ayudar a un jugador a construir un equipo equilibrado: no basta con elegir Pokémon fuertes,
hay que evitar que muchos miembros compartan la misma debilidad. La aplicación cruza los
tipos de cada miembro con las relaciones de daño de PokéAPI y señala los tipos atacantes
que más amenazan al equipo.

## Funcionalidades

- **Buscador** por nombre o número, con sugerencias de autocompletado y botón 🎲 de Pokémon aleatorio.
- **Ficha del Pokémon**: imagen oficial, número, categoría, tipos, altura, peso, descripción en español,
  estadísticas base con barras y total, e indicador de legendario/mítico.
- **Detalle de tipos**: al tocar un tipo se muestran sus ventajas, debilidades, resistencias e inmunidades;
  se puede navegar de un tipo a otro.
- **Detalle de habilidades**: al tocar una habilidad se muestra su nombre en español y lo que hace.
- **Constructor de equipo**: agregar (máx. 6, sin repetidos), quitar, vaciar y ver miembros. El equipo se
  guarda en el navegador (localStorage).
- **Análisis del equipo** (lógica propia): para cada uno de los 18 tipos atacantes calcula el multiplicador
  de daño contra cada miembro (×0, ×¼, ×½, ×1, ×2, ×4) y cuenta cuántos son débiles, resistentes o inmunes.
  Marca en rojo los tipos que amenazan a 3 o más miembros y muestra el promedio de estadísticas del equipo.
- **Estados de interfaz**: mensajes de carga, Pokémon inexistente (404), errores de conexión con opción de
  reintentar, y diseño adaptable a móvil.

## Endpoints de PokéAPI utilizados

| Endpoint                        | Uso en la aplicación                                                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /pokemon/{nombre o id}`    | Datos del Pokémon buscado: imagen, tipos, habilidades, estadísticas, altura y peso. También `GET /pokemon?limit=1025` para las sugerencias del buscador. |
| `GET /pokemon-species/{nombre}` | Descripción en español (flavor text), categoría (genus) y si es legendario o mítico.                                                                     |
| `GET /type/{nombre}`            | Relaciones de daño (`damage_relations`) de cada tipo. Se usan en el panel de tipos y en el **cálculo de debilidades del equipo**.                        |
| `GET /ability/{nombre}`         | Nombre en español y efecto de cada habilidad del Pokémon.                                                                                                |

Las respuestas se guardan en memoria (caché) dentro del servicio para no repetir consultas.

## Estructura del proyecto

```
src/app/
├── models/
│   ├── pokemon.ts          # Interfaces: Pokemon, Especie, Tipo, Habilidad, FilaAnalisis
│   └── tipos.ts            # Nombres en español y colores de los 18 tipos
├── services/
│   ├── pokeapi.ts          # Consumo de los endpoints con HttpClient
│   └── equipo.ts           # Estado del equipo y cálculo de debilidades (signals)
├── components/
│   ├── buscador/           # Formulario de búsqueda
│   ├── pokemon-detalle/    # Ficha del Pokémon
│   ├── tipo-detalle/       # Panel de relaciones de daño de un tipo
│   ├── habilidad-detalle/  # Panel de una habilidad
│   ├── equipo/             # Ranuras del equipo
│   └── analisis-equipo/    # Tabla de debilidades y promedios
├── app.ts / app.html       # Componente raíz que coordina todo
└── app.config.ts           # provideHttpClient()
```

## Ejecución local

Requisitos: Node.js 20.19+ (o 22+) y npm.

```bash
git clone https://github.com/DannielS110/poke-equipos.git
cd poke-equipos
npm install
npm start
```

Abrir <http://localhost:4200>. Para generar la versión de producción: `npm run build`
(la salida queda en `dist/poke-equipos/browser`).

## Despliegue

El repositorio está importado en **Vercel** con el preset de Angular
(build: `npm run build`, salida: `dist/poke-equipos/browser`). No necesita backend ni base de datos:
todas las consultas se hacen directamente a PokéAPI desde el navegador.
