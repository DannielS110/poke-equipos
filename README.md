# PokéEquipos

Práctica 02 de Programación y Plataformas Web (UPS). Es una app en Angular que usa PokéAPI para armar un equipo de hasta 6 Pokémon y ver contra qué tipos queda débil.

La idea salió de algo que pasa mucho al jugar: eliges Pokémon que te gustan y después te das cuenta de que la mitad del equipo cae contra el mismo tipo. La app te avisa de eso mientras armas el equipo.


![Pantalla principal de PokéEquipos](docs/captura.png)

## Qué se puede hacer

- Buscar un Pokémon por nombre o número. El buscador sugiere nombres mientras escribes y también hay un botón para sacar uno al azar.
- Ver su ficha: imagen, tipos, altura, peso, descripción en español, si es legendario o mítico, y sus estadísticas base.
- Tocar un tipo para ver a qué le hace daño doble, de qué recibe daño doble, qué resiste y a qué es inmune. Desde ahí se puede saltar a otro tipo.
- Tocar una habilidad para ver qué hace.
- Agregar hasta 6 Pokémon al equipo, quitarlos o vaciarlo. El equipo se queda guardado en el navegador aunque recargues.
- Ver el análisis del equipo: para cada uno de los 18 tipos cuenta cuántos miembros son débiles, cuántos resisten y cuántos son inmunes. Si un tipo le pega fuerte a 3 o más, sale marcado en rojo. Abajo aparece el promedio de estadísticas del equipo.

Si buscas algo que no existe, se cae la conexión o algo está cargando, la app lo muestra en pantalla en lugar de quedarse en blanco.

## Cómo está organizado

```
src/app/
  models/       interfaces y la tabla de tipos en español con sus colores
  services/     pokeapi.ts (peticiones con HttpClient) y equipo.ts (estado del equipo y cálculo)
  components/   buscador, pokemon-detalle, tipo-detalle, habilidad-detalle, equipo, analisis-equipo
  app.ts        componente principal que une todo
```

## Despliegue

Después abre http://localhost:4200





Daniel Sanchez – Universidad Politécnica Salesiana, Cuenca
