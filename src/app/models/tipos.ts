/** Nombres en español y colores de los 18 tipos de Pokémon */
export const TIPOS: Record<string, { es: string; color: string }> = {
  normal: { es: 'Normal', color: '#9fa19f' },
  fire: { es: 'Fuego', color: '#e62829' },
  water: { es: 'Agua', color: '#2980ef' },
  electric: { es: 'Eléctrico', color: '#e0b000' },
  grass: { es: 'Planta', color: '#3fa129' },
  ice: { es: 'Hielo', color: '#3dcef3' },
  fighting: { es: 'Lucha', color: '#ff8000' },
  poison: { es: 'Veneno', color: '#9141cb' },
  ground: { es: 'Tierra', color: '#915121' },
  flying: { es: 'Volador', color: '#81b9ef' },
  psychic: { es: 'Psíquico', color: '#ef4179' },
  bug: { es: 'Bicho', color: '#91a119' },
  rock: { es: 'Roca', color: '#afa981' },
  ghost: { es: 'Fantasma', color: '#704170' },
  dragon: { es: 'Dragón', color: '#5060e1' },
  dark: { es: 'Siniestro', color: '#624d4e' },
  steel: { es: 'Acero', color: '#60a1b8' },
  fairy: { es: 'Hada', color: '#ef70ef' },
};

export const LISTA_TIPOS = Object.keys(TIPOS);

export const NOMBRES_STATS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

export function tipoEs(tipo: string): string {
  return TIPOS[tipo]?.es ?? tipo;
}

export function colorTipo(tipo: string): string {
  return TIPOS[tipo]?.color ?? '#777';
}
