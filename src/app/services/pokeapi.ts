import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Especie, Habilidad, Pokemon, Tipo } from '../models/pokemon';

const API = 'https://pokeapi.co/api/v2';

/**
 * Servicio que consume PokéAPI.
 * Endpoints usados: /pokemon, /pokemon-species, /type y /ability.
 * Guarda las respuestas en memoria para no repetir consultas.
 */
@Injectable({ providedIn: 'root' })
export class PokeApiService {
  private http = inject(HttpClient);
  private cache = new Map<string, Promise<unknown>>();

  /** GET /pokemon/{nombre o id} */
  async getPokemon(nombreOId: string | number): Promise<Pokemon> {
    const clave = String(nombreOId).trim().toLowerCase();
    if (!clave) {
      throw new Error('Escribe el nombre o número de un Pokémon.');
    }
    const data = await this.get<any>(`/pokemon/${encodeURIComponent(clave)}`, 'Pokémon');
    return {
      id: data.id,
      nombre: data.name,
      imagen:
        data.sprites?.other?.['official-artwork']?.front_default ??
        data.sprites?.front_default ??
        null,
      tipos: data.types.map((t: any) => t.type.name),
      habilidades: data.abilities.map((a: any) => ({
        nombre: a.ability.name,
        oculta: a.is_hidden,
      })),
      estadisticas: data.stats.map((s: any) => ({ nombre: s.stat.name, valor: s.base_stat })),
      altura: data.height / 10,
      peso: data.weight / 10,
      especie: data.species.name,
    };
  }

  /** GET /pokemon?limit=... — lista de nombres para las sugerencias del buscador */
  async getNombres(): Promise<string[]> {
    const data = await this.get<any>('/pokemon?limit=1025', 'lista');
    return data.results.map((r: any) => r.name);
  }

  /** GET /pokemon-species/{nombre} */
  async getEspecie(nombre: string): Promise<Especie> {
    const data = await this.get<any>(`/pokemon-species/${nombre}`, 'especie');
    const texto =
      this.enIdioma(data.flavor_text_entries, 'es')?.flavor_text ??
      this.enIdioma(data.flavor_text_entries, 'en')?.flavor_text ??
      'Sin descripción disponible.';
    return {
      descripcion: texto.replace(/[\n\f\r]/g, ' '),
      categoria:
        this.enIdioma(data.genera, 'es')?.genus ?? this.enIdioma(data.genera, 'en')?.genus ?? '',
      legendario: data.is_legendary,
      mitico: data.is_mythical,
      habitat: data.habitat?.name ?? null,
    };
  }

  /** GET /type/{nombre} */
  async getTipo(nombre: string): Promise<Tipo> {
    const data = await this.get<any>(`/type/${nombre}`, 'tipo');
    const r = data.damage_relations;
    const nombres = (lista: any[]) => lista.map((x) => x.name);
    return {
      nombre: data.name,
      dobleDanoDe: nombres(r.double_damage_from),
      mitadDanoDe: nombres(r.half_damage_from),
      sinDanoDe: nombres(r.no_damage_from),
      dobleDanoA: nombres(r.double_damage_to),
      mitadDanoA: nombres(r.half_damage_to),
      sinDanoA: nombres(r.no_damage_to),
    };
  }

  /** GET /ability/{nombre} */
  async getHabilidad(nombre: string): Promise<Habilidad> {
    const data = await this.get<any>(`/ability/${nombre}`, 'habilidad');
    const efecto =
      this.enIdioma(data.flavor_text_entries, 'es')?.flavor_text ??
      this.enIdioma(data.effect_entries, 'en')?.short_effect ??
      'Sin descripción disponible.';
    return {
      nombre: data.name,
      nombreEs: this.enIdioma(data.names, 'es')?.name ?? data.name,
      efecto: efecto.replace(/[\n\f\r]/g, ' '),
      totalPokemon: data.pokemon.length,
    };
  }

  // ---------- utilidades privadas ----------

  private get<T>(ruta: string, recurso: string): Promise<T> {
    if (!this.cache.has(ruta)) {
      const peticion = firstValueFrom(this.http.get<T>(API + ruta)).catch(
        (err: HttpErrorResponse) => {
          this.cache.delete(ruta); // si falla, permitir reintentar
          if (err.status === 404) {
            throw new Error(
              `No se encontró ese ${recurso}. Revisa el nombre e inténtalo otra vez.`,
            );
          }
          if (err.status === 0) {
            throw new Error('No se pudo conectar con PokéAPI. Revisa tu conexión a internet.');
          }
          throw new Error(`PokéAPI respondió con un error (${err.status}).`);
        },
      );
      this.cache.set(ruta, peticion);
    }
    return this.cache.get(ruta) as Promise<T>;
  }

  /** Busca la última entrada en un idioma dado (las más recientes van al final). */
  private enIdioma(lista: any[], idioma: string): any {
    return [...lista].reverse().find((e) => e.language.name === idioma);
  }
}
