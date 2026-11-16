import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Habilidad } from '../../models/pokemon';
import { PokeApiService } from '../../services/pokeapi';

/** Panel que consulta /ability/{nombre} y muestra su efecto */
@Component({
  selector: 'app-habilidad-detalle',
  templateUrl: './habilidad-detalle.html',
})
export class HabilidadDetalle {
  private api = inject(PokeApiService);

  readonly nombre = input.required<string>();
  readonly cerrar = output<void>();

  readonly habilidad = signal<Habilidad | null>(null);
  readonly cargando = signal(false);
  readonly error = signal('');

  constructor() {
    effect(() => this.cargar(this.nombre()));
  }

  async cargar(nombre: string) {
    this.cargando.set(true);
    this.error.set('');
    this.habilidad.set(null);
    try {
      const h = await this.api.getHabilidad(nombre);
      if (nombre === this.nombre()) this.habilidad.set(h);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.cargando.set(false);
    }
  }
}
