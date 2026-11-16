/** Datos de un Pokémon obtenidos de /pokemon/{nombre} */
export interface Pokemon {
  id: number;
  nombre: string;
  imagen: string | null;
  tipos: string[];
  habilidades: HabilidadResumen[];
  estadisticas: Estadistica[];
  altura: number; // en metros
  peso: number; // en kilogramos
  especie: string;
}

export interface HabilidadResumen {
  nombre: string;
  oculta: boolean;
}

export interface Estadistica {
  nombre: string;
  valor: number;
}

/** Datos de /pokemon-species/{nombre} */
export interface Especie {
  descripcion: string;
  categoria: string;
  legendario: boolean;
  mitico: boolean;
  habitat: string | null;
}

/** Datos de /type/{nombre} */
export interface Tipo {
  nombre: string;
  dobleDanoDe: string[];
  mitadDanoDe: string[];
  sinDanoDe: string[];
  dobleDanoA: string[];
  mitadDanoA: string[];
  sinDanoA: string[];
}

/** Datos de /ability/{nombre} */
export interface Habilidad {
  nombre: string;
  nombreEs: string;
  efecto: string;
  totalPokemon: number;
}

/** Resultado del análisis de debilidades del equipo */
export interface FilaAnalisis {
  tipo: string;
  debiles: number;
  resistentes: number;
  inmunes: number;
  nivel: 'peligro' | 'alerta' | 'ok';
}
