import { Component, inject, output } from '@angular/core';
import { EquipoService, MAX_EQUIPO } from '../../services/equipo';
import { colorTipo, tipoEs } from '../../models/tipos';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.html',
  styleUrl: './equipo.css',
})
export class Equipo {
  protected equipo = inject(EquipoService);
  readonly seleccionar = output<string>();

  protected readonly max = MAX_EQUIPO;
  protected readonly tipoEs = tipoEs;
  protected readonly colorTipo = colorTipo;

  get espaciosVacios() {
    return Array.from({ length: MAX_EQUIPO - this.equipo.miembros().length });
  }
}
