import { Colors } from "@/constants/colors";
import { Text, View } from "react-native";

export default function FavoritesScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
      }}
    >
      <Text style={{ color: Colors.text, fontSize: 16 }}>Favorites</Text>
    </View>
  );
}
