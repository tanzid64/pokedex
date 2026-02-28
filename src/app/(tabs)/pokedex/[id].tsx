import { Colors } from "@/constants/colors";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
      }}
    >
      <Text style={{ color: Colors.text, fontSize: 18, fontWeight: "bold" }}>
        Pokémon #{id}
      </Text>
    </View>
  );
}
