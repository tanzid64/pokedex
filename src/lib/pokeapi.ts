import { PokemonDetail, PokemonListResponse } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(
  offset = 0,
  limit = 20,
): Promise<PokemonListResponse> {
  const res = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`,
  );
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
  return res.json();
}

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon #${id}`);
  return res.json();
}

/** Extract the numeric ID from a PokeAPI resource URL */
export function getIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return Number(parts[parts.length - 1]);
}

/** Get the official artwork sprite URL for a Pokémon by ID */
export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
