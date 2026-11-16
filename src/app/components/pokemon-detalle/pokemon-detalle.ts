import { Component, computed, input, output } from '@angular/core';
import { Especie, Pokemon } from '../../models/pokemon';
import { NOMBRES_STATS, colorTipo, tipoEs } from '../../models/tipos';

@Component({
  selector: 'app-pokemon-detalle',
  templateUrl: './pokemon-detalle.html',
  styleUrl: './pokemon-detalle.css',
})
export class PokemonDetalle {
  readonly pokemon = input.required<Pokemon>();
  readonly especie = input<Especie | null>(null);
  readonly errorEspecie = input('');
  readonly enEquipo = input(false);
  readonly equipoLleno = input(false);

  readonly verTipo = output<string>();
  readonly verHabilidad = output<string>();
  readonly agregar = output<void>();

  readonly total = computed(() =>
    this.pokemon().estadisticas.reduce((suma, s) => suma + s.valor, 0),
  );

  protected readonly tipoEs = tipoEs;
  protected readonly colorTipo = colorTipo;
  protected readonly nombresStats = NOMBRES_STATS;

  porcentaje(valor: number) {
    return Math.min(100, (valor / 200) * 100);
  }
}
