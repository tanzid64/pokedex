import { Colors } from "@/constants/colors";
import { StatLabels, TypeColors } from "@/constants/pokemon";
import { useFavorites } from "@/hooks/use-favorites";
import { fetchPokemonDetail, getSpriteUrl } from "@/lib/pokeapi";
import { PokemonDetail } from "@/types/pokemon";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function StatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const maxStat = 255;
  const percentage = Math.min((value / maxStat) * 100, 100);

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statBarBg}>
        <View
          style={[
            styles.statBarFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

function TypeBadge({ type }: { type: string }) {
  const color = TypeColors[type] ?? Colors.textSecondary;
  return (
    <View style={[styles.typeBadge, { backgroundColor: color }]}>
      <Text style={styles.typeBadgeText}>{capitalize(type)}</Text>
    </View>
  );
}

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const numericId = Number(id);
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPokemonDetail(Number(id));
        setPokemon(data);
      } catch {
        setError("Failed to load Pokémon details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useLayoutEffect(() => {
    if (pokemon) {
      navigation.setOptions({ title: capitalize(pokemon.name) });
    }
  }, [pokemon, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Something went wrong."}</Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const primaryColor = TypeColors[primaryType] ?? Colors.primary;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Hero section */}
      <View style={[styles.heroSection, { backgroundColor: primaryColor }]}>
        <Pressable
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(numericId)}
        >
          <Ionicons
            name={isFavorite(numericId) ? "heart" : "heart-outline"}
            size={28}
            color={
              isFavorite(numericId) ? Colors.primary : "rgba(255,255,255,0.8)"
            }
          />
        </Pressable>
        <Image
          source={{ uri: getSpriteUrl(pokemon.id) }}
          style={styles.heroImage}
          contentFit="contain"
          transition={300}
        />
      </View>

      {/* About card overlapping hero */}
      <View style={styles.aboutCard}>
        <View style={styles.aboutRow}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutValue}>
              {(pokemon.height / 10).toFixed(1)} m
            </Text>
            <Text style={styles.aboutLabel}>Height</Text>
          </View>
          <View style={styles.aboutDivider} />
          <View style={styles.aboutItem}>
            <Text style={styles.aboutValue}>
              {(pokemon.weight / 10).toFixed(1)} kg
            </Text>
            <Text style={styles.aboutLabel}>Weight</Text>
          </View>
        </View>
      </View>

      {/* Name & types */}
      <View style={styles.nameSection}>
        <Text style={styles.pokemonName}>{capitalize(pokemon.name)}</Text>
        <Text style={styles.pokemonId}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
        <View style={styles.typesRow}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </View>
      </View>

      {/* Stats section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Base Stats</Text>
        {pokemon.stats.map((s) => (
          <StatBar
            key={s.stat.name}
            label={StatLabels[s.stat.name] ?? s.stat.name}
            value={s.base_stat}
            color={primaryColor}
          />
        ))}
        <StatBar
          label="TOT"
          value={pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
          color={primaryColor}
        />
      </View>

      {/* Abilities section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abilities</Text>
        <View style={styles.abilitiesRow}>
          {pokemon.abilities.map((a) => (
            <View key={a.ability.name} style={styles.abilityBadge}>
              <Text style={styles.abilityText}>
                {capitalize(a.ability.name.replace("-", " "))}
                {a.is_hidden ? (
                  <Text style={styles.abilityHidden}> (Hidden)</Text>
                ) : null}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 32,
  },

  // Hero
  heroSection: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    padding: 8,
  },
  heroImage: {
    width: 220,
    height: 220,
  },

  // About card (overlaps hero)
  aboutCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 24,
    marginTop: -40,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Name & types
  nameSection: {
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  pokemonName: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.text,
  },
  pokemonId: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  typesRow: {
    flexDirection: "row",
    gap: 8,
  },

  // Type badges
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeBadgeText: {
    color: Colors.textLight,
    fontSize: 13,
    fontWeight: "700",
  },

  // Sections
  section: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  aboutItem: {
    flex: 1,
    alignItems: "center",
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  aboutLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  aboutDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },

  // Stats
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    width: 52,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  statValue: {
    width: 36,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "right",
    marginRight: 10,
  },
  statBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  statBarFill: {
    height: 6,
    borderRadius: 3,
  },

  // Abilities
  abilitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  abilityBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  abilityText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  abilityHidden: {
    fontWeight: "400",
    fontStyle: "italic",
    color: Colors.textSecondary,
  },
});
