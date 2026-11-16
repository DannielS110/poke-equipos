import { Component, computed, inject, signal } from '@angular/core';
import { Buscador } from './components/buscador/buscador';
import { PokemonDetalle } from './components/pokemon-detalle/pokemon-detalle';
import { TipoDetalle } from './components/tipo-detalle/tipo-detalle';
import { HabilidadDetalle } from './components/habilidad-detalle/habilidad-detalle';
import { Equipo } from './components/equipo/equipo';
import { AnalisisEquipo } from './components/analisis-equipo/analisis-equipo';
import { Especie, Pokemon } from './models/pokemon';
import { PokeApiService } from './services/pokeapi';
import { EquipoService } from './services/equipo';

@Component({
  selector: 'app-root',
  imports: [Buscador, PokemonDetalle, TipoDetalle, HabilidadDetalle, Equipo, AnalisisEquipo],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private api = inject(PokeApiService);
  protected equipo = inject(EquipoService);

  readonly pokemon = signal<Pokemon | null>(null);
  readonly especie = signal<Especie | null>(null);
  readonly errorEspecie = signal('');
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');

  readonly tipoAbierto = signal<string | null>(null);
  readonly habilidadAbierta = signal<string | null>(null);

  readonly enEquipo = computed(() => {
    const p = this.pokemon();
    return !!p && this.equipo.miembros().some((m) => m.id === p.id);
  });

  private busquedaActual = 0;

  async buscar(texto: string) {
    const id = ++this.busquedaActual;
    this.cargando.set(true);
    this.error.set('');
    this.mensaje.set('');
    this.tipoAbierto.set(null);
    this.habilidadAbierta.set(null);
    try {
      const p = await this.api.getPokemon(texto);
      if (id !== this.busquedaActual) return; // llegó una búsqueda más nueva
      this.pokemon.set(p);
      this.cargarEspecie(p.especie, id);
    } catch (e) {
      if (id !== this.busquedaActual) return;
      this.pokemon.set(null);
      this.error.set((e as Error).message);
    } finally {
      if (id === this.busquedaActual) this.cargando.set(false);
    }
  }

  private async cargarEspecie(nombre: string, id: number) {
    this.especie.set(null);
    this.errorEspecie.set('');
    try {
      const e = await this.api.getEspecie(nombre);
      if (id === this.busquedaActual) this.especie.set(e);
    } catch (e) {
      if (id === this.busquedaActual) this.errorEspecie.set((e as Error).message);
    }
  }

  agregarAlEquipo() {
    const p = this.pokemon();
    if (!p) return;
    const problema = this.equipo.agregar(p);
    this.mensaje.set(problema ?? `¡${p.nombre} se unió a tu equipo!`);
    setTimeout(() => this.mensaje.set(''), 3000);
  }

  abrirTipo(tipo: string) {
    this.habilidadAbierta.set(null);
    this.tipoAbierto.set(tipo);
  }

  abrirHabilidad(nombre: string) {
    this.tipoAbierto.set(null);
    this.habilidadAbierta.set(nombre);
  }
}
