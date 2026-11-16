import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Tipo } from '../../models/pokemon';
import { colorTipo, tipoEs } from '../../models/tipos';
import { PokeApiService } from '../../services/pokeapi';

/** Panel que consulta /type/{nombre} y muestra sus relaciones de daño */
@Component({
  selector: 'app-tipo-detalle',
  templateUrl: './tipo-detalle.html',
})
export class TipoDetalle {
  private api = inject(PokeApiService);

  readonly nombre = input.required<string>();
  readonly cerrar = output<void>();
  readonly cambiarTipo = output<string>();

  readonly tipo = signal<Tipo | null>(null);
  readonly cargando = signal(false);
  readonly error = signal('');

  readonly secciones = computed(() => {
    const t = this.tipo();
    if (!t) return [];
    return [
      { titulo: '⚔️ Atacando es súper eficaz contra', tipos: t.dobleDanoA },
      { titulo: '🛡️ Recibe daño doble de', tipos: t.dobleDanoDe },
      { titulo: '💪 Resiste ataques de', tipos: t.mitadDanoDe },
      { titulo: '🚫 Inmune a', tipos: t.sinDanoDe },
    ];
  });

  protected readonly tipoEs = tipoEs;
  protected readonly colorTipo = colorTipo;

  constructor() {
    effect(() => this.cargar(this.nombre()));
  }

  async cargar(nombre: string) {
    this.cargando.set(true);
    this.error.set('');
    this.tipo.set(null);
    try {
      const t = await this.api.getTipo(nombre);
      if (nombre === this.nombre()) this.tipo.set(t);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.cargando.set(false);
    }
  }
}
