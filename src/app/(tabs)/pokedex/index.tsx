import { PokedexListSkeleton } from "@/components/skeleton";
import { Colors } from "@/constants/colors";
import { useFavorites } from "@/hooks/use-favorites";
import { fetchPokemonList, getIdFromUrl, getSpriteUrl } from "@/lib/pokeapi";
import { PokemonListItem } from "@/types/pokemon";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const TOTAL_POKEMON = 150;

export default function PokedexScreen() {
  const router = useRouter();
  const { isFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadAllPokemon = useCallback(async () => {
    try {
      const data = await fetchPokemonList(0, TOTAL_POKEMON);
      setPokemon(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllPokemon();
  }, [loadAllPokemon]);

  const filtered = useMemo(() => {
    if (!search.trim()) return pokemon;
    const query = search.toLowerCase().trim();
    return pokemon.filter((p) => {
      const id = String(getIdFromUrl(p.url));
      return p.name.includes(query) || id.includes(query);
    });
  }, [pokemon, search]);

  const renderItem = ({ item }: { item: PokemonListItem }) => {
    const id = getIdFromUrl(item.url);
    const fav = isFavorite(id);
    return (
      <Pressable
        style={[styles.card, fav && styles.cardFavorite]}
        onPress={() => router.push(`/pokedex/${id}` as any)}
      >
        <Image
          source={{ uri: getSpriteUrl(id) }}
          style={styles.sprite}
          contentFit="contain"
          transition={200}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.pokemonId}>#{String(id).padStart(3, "0")}</Text>
          <Text style={styles.pokemonName}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>
        </View>
        {fav && (
          <Ionicons
            name="heart"
            size={20}
            color={Colors.primary}
            style={styles.favIcon}
          />
        )}
      </Pressable>
    );
  };

  if (loading) {
    return <PokedexListSkeleton />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color={Colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or number..."
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="sad-outline"
              size={48}
              color={Colors.textSecondary}
            />
            <Text style={styles.emptyText}>No Pokémon found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 0,
  },
  list: {
    padding: 12,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  cardFavorite: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: "#FFF5F5",
  },
  favIcon: {
    marginRight: 4,
  },
  sprite: {
    width: 68,
    height: 68,
  },
  cardInfo: {
    marginLeft: 14,
    flex: 1,
  },
  pokemonId: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 2,
  },
});
