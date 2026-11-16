import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { FilaAnalisis, Pokemon, Tipo } from '../models/pokemon';
import { LISTA_TIPOS } from '../models/tipos';
import { PokeApiService } from './pokeapi';

export const MAX_EQUIPO = 6;
const CLAVE_STORAGE = 'poke-equipos:equipo';

/**
 * Lógica propia del constructor de equipos:
 * agrega/quita miembros y calcula las debilidades del equipo
 * a partir de las relaciones de daño de /type.
 */
@Injectable({ providedIn: 'root' })
export class EquipoService {
  private api = inject(PokeApiService);

  readonly miembros = signal<Pokemon[]>([]);
  readonly tiposCargados = signal<Record<string, Tipo>>({});
  readonly errorAnalisis = signal('');

  readonly lleno = computed(() => this.miembros().length >= MAX_EQUIPO);

  /** Promedio de cada estadística base del equipo */
  readonly promedios = computed(() => {
    const equipo = this.miembros();
    if (!equipo.length) return [];
    return equipo[0].estadisticas.map((s, i) => ({
      nombre: s.nombre,
      valor: Math.round(
        equipo.reduce((suma, p) => suma + p.estadisticas[i].valor, 0) / equipo.length,
      ),
    }));
  });

  /**
   * Para cada tipo atacante cuenta cuántos miembros reciben daño x2 o más,
   * cuántos lo resisten y cuántos son inmunes.
   */
  readonly analisis = computed<FilaAnalisis[]>(() => {
    const equipo = this.miembros();
    const tipos = this.tiposCargados();
    if (!equipo.length) return [];
    const necesarios = new Set(equipo.flatMap((p) => p.tipos));
    if ([...necesarios].some((t) => !tipos[t])) return [];

    return LISTA_TIPOS.map((atacante) => {
      let debiles = 0;
      let resistentes = 0;
      let inmunes = 0;
      for (const p of equipo) {
        const m = this.multiplicador(atacante, p.tipos, tipos);
        if (m === 0) inmunes++;
        else if (m > 1) debiles++;
        else if (m < 1) resistentes++;
      }
      const balance = debiles - resistentes - inmunes;
      const nivel: FilaAnalisis['nivel'] =
        debiles >= 3 && balance > 0 ? 'peligro' : balance > 0 ? 'alerta' : 'ok';
      return { tipo: atacante, debiles, resistentes, inmunes, nivel };
    }).sort(
      (a, b) => b.debiles - b.resistentes - b.inmunes - (a.debiles - a.resistentes - a.inmunes),
    );
  });

  constructor() {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      if (guardado) this.miembros.set(JSON.parse(guardado));
    } catch {
      /* almacenamiento no disponible */
    }
    effect(() => {
      const equipo = this.miembros();
      try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(equipo));
      } catch {
        /* ignorar */
      }
      this.cargarTipos(equipo);
    });
  }

  /** Devuelve un mensaje de error o null si se agregó */
  agregar(pokemon: Pokemon): string | null {
    if (this.miembros().some((p) => p.id === pokemon.id)) {
      return `${pokemon.nombre} ya está en tu equipo.`;
    }
    if (this.lleno()) {
      return `El equipo ya tiene ${MAX_EQUIPO} Pokémon. Quita uno para agregar otro.`;
    }
    this.miembros.update((lista) => [...lista, pokemon]);
    return null;
  }

  quitar(id: number): void {
    this.miembros.update((lista) => lista.filter((p) => p.id !== id));
  }

  vaciar(): void {
    this.miembros.set([]);
  }

  /** Multiplicador de daño de un tipo atacante contra un Pokémon de uno o dos tipos */
  multiplicador(atacante: string, defensores: string[], tipos: Record<string, Tipo>): number {
    return defensores.reduce((total, defensor) => {
      const t = tipos[defensor];
      if (!t) return total;
      if (t.sinDanoDe.includes(atacante)) return total * 0;
      if (t.dobleDanoDe.includes(atacante)) return total * 2;
      if (t.mitadDanoDe.includes(atacante)) return total * 0.5;
      return total;
    }, 1);
  }

  private async cargarTipos(equipo: Pokemon[]): Promise<void> {
    const faltantes = [...new Set(equipo.flatMap((p) => p.tipos))].filter(
      (t) => !this.tiposCargados()[t],
    );
    if (!faltantes.length) return;
    try {
      this.errorAnalisis.set('');
      const resultados = await Promise.all(faltantes.map((t) => this.api.getTipo(t)));
      this.tiposCargados.update((actual) => {
        const nuevo = { ...actual };
        resultados.forEach((t) => (nuevo[t.nombre] = t));
        return nuevo;
      });
    } catch (e) {
      this.errorAnalisis.set((e as Error).message);
    }
  }
}
