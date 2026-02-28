import { Colors } from "@/constants/colors";
import { fetchPokemonList, getIdFromUrl, getSpriteUrl } from "@/lib/pokeapi";
import { PokemonListItem } from "@/types/pokemon";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PAGE_SIZE = 20;

export default function PokedexScreen() {
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPokemon = useCallback(async (currentOffset: number) => {
    try {
      const data = await fetchPokemonList(currentOffset, PAGE_SIZE);
      setPokemon((prev) =>
        currentOffset === 0 ? data.results : [...prev, ...data.results],
      );
      setHasMore(data.next !== null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPokemon(0);
  }, [loadPokemon]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    loadPokemon(nextOffset);
  };

  const renderItem = ({ item }: { item: PokemonListItem }) => {
    const id = getIdFromUrl(item.url);
    return (
      <Pressable
        style={styles.card}
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
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={pokemon}
      keyExtractor={(item) => item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={{ paddingVertical: 16 }}
          />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  list: {
    padding: 12,
    backgroundColor: Colors.background,
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
