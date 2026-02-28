import { Colors } from "@/constants/colors";
import { useEffect } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

/** A single pulsing placeholder block. */
export function Skeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, // infinite
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: Colors.border,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/** Skeleton matching a Pokemon list card (sprite + id + name). */
export function PokemonCardSkeleton() {
  return (
    <View style={cardStyles.card}>
      <Skeleton width={68} height={68} borderRadius={12} />
      <View style={cardStyles.info}>
        <Skeleton width={50} height={13} borderRadius={4} />
        <Skeleton
          width={100}
          height={16}
          borderRadius={4}
          style={{ marginTop: 6 }}
        />
      </View>
    </View>
  );
}

/** Full skeleton for the Pokédex list (search bar + card list). */
export function PokedexListSkeleton() {
  return (
    <View style={listStyles.screen}>
      {/* Search bar skeleton */}
      <View style={listStyles.searchBar}>
        <Skeleton width={18} height={18} borderRadius={9} />
        <Skeleton
          width="70%"
          height={16}
          borderRadius={4}
          style={{ marginLeft: 8 }}
        />
      </View>

      {/* Card skeletons */}
      <View style={listStyles.list}>
        {Array.from({ length: 8 }).map((_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </View>
    </View>
  );
}

/** Skeleton for the detail page (hero + about + name + stats + abilities). */
export function DetailSkeleton() {
  return (
    <View style={detailStyles.container}>
      {/* Hero */}
      <View style={detailStyles.hero}>
        <Skeleton width={220} height={220} borderRadius={24} />
      </View>

      {/* About card */}
      <View style={detailStyles.aboutCard}>
        <View style={detailStyles.aboutRow}>
          <Skeleton width={60} height={14} borderRadius={4} />
          <View style={detailStyles.divider} />
          <Skeleton width={60} height={14} borderRadius={4} />
        </View>
      </View>

      {/* Name & types */}
      <View style={detailStyles.nameSection}>
        <Skeleton width={140} height={24} borderRadius={6} />
        <Skeleton
          width={60}
          height={14}
          borderRadius={4}
          style={{ marginTop: 6 }}
        />
        <View style={detailStyles.typesRow}>
          <Skeleton width={72} height={24} borderRadius={16} />
          <Skeleton width={72} height={24} borderRadius={16} />
        </View>
      </View>

      {/* Stats */}
      <View style={detailStyles.section}>
        <Skeleton width={100} height={18} borderRadius={4} />
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={detailStyles.statRow}>
            <Skeleton width={40} height={12} borderRadius={3} />
            <Skeleton width={28} height={12} borderRadius={3} />
            <Skeleton
              width="60%"
              height={6}
              borderRadius={3}
              style={{ marginLeft: 10 }}
            />
          </View>
        ))}
      </View>

      {/* Abilities */}
      <View style={detailStyles.section}>
        <Skeleton width={80} height={18} borderRadius={4} />
        <View style={detailStyles.abilitiesRow}>
          <Skeleton width={100} height={32} borderRadius={20} />
          <Skeleton width={80} height={32} borderRadius={20} />
        </View>
      </View>
    </View>
  );
}

/** Skeleton for the favorites list. */
export function FavoritesListSkeleton() {
  return (
    <View style={listStyles.list}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={favStyles.card}>
          <Skeleton width={68} height={68} borderRadius={12} />
          <View style={favStyles.info}>
            <Skeleton width={50} height={16} borderRadius={4} />
          </View>
          <Skeleton width={20} height={20} borderRadius={10} />
        </View>
      ))}
    </View>
  );
}

/* ─── Card styles ────────────────────────────────────────── */

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  info: {
    marginLeft: 14,
    flex: 1,
  },
});

const listStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  list: {
    padding: 12,
  },
});

/* ─── Detail styles ──────────────────────────────────────── */

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: Colors.border,
  },
  aboutCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 24,
    marginTop: -40,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  nameSection: {
    alignItems: "center",
    marginTop: 16,
  },
  typesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  section: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  abilitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

/* ─── Favorites skeleton styles ──────────────────────────── */

const favStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
  },
  info: {
    marginLeft: 14,
    flex: 1,
  },
});
