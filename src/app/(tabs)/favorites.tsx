import { Colors } from "@/constants/colors";
import { useFavorites } from "@/hooks/use-favorites";
import { getSpriteUrl } from "@/lib/pokeapi";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="heart-outline"
          size={64}
          color={Colors.tabBarInactive}
        />
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap the heart icon on a Pokémon's details page to add it here.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: number }) => {
    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/pokedex/${item}` as any)}
      >
        <Image
          source={{ uri: getSpriteUrl(item) }}
          style={styles.sprite}
          contentFit="contain"
          transition={200}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.pokemonId}>#{String(item).padStart(3, "0")}</Text>
        </View>
        <Pressable
          style={styles.removeButton}
          onPress={() => toggleFavorite(item)}
        >
          <Ionicons name="heart-dislike" size={20} color={Colors.primary} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => String(item)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
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
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  removeButton: {
    padding: 8,
  },
});
