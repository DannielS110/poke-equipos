import { Component, computed, inject, output } from '@angular/core';
import { EquipoService } from '../../services/equipo';
import { NOMBRES_STATS, colorTipo, tipoEs } from '../../models/tipos';

/** Muestra el análisis de debilidades/resistencias del equipo */
@Component({
  selector: 'app-analisis-equipo',
  templateUrl: './analisis-equipo.html',
  styleUrl: './analisis-equipo.css',
})
export class AnalisisEquipo {
  protected equipo = inject(EquipoService);
  readonly verTipo = output<string>();

  readonly peligros = computed(() => this.equipo.analisis().filter((f) => f.nivel === 'peligro'));

  protected readonly tipoEs = tipoEs;
  protected readonly colorTipo = colorTipo;
  protected readonly nombresStats = NOMBRES_STATS;
}
