import { File, Paths } from "expo-file-system";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const favoritesFile = new File(Paths.document, "favorites.json");

interface FavoritesContextType {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const loaded = useRef(false);

  // Load from file on mount
  useEffect(() => {
    if (favoritesFile.exists) {
      favoritesFile
        .text()
        .then((raw) => {
          try {
            setFavorites(JSON.parse(raw));
          } catch {
            // ignore corrupt data
          }
        })
        .finally(() => {
          loaded.current = true;
        });
    } else {
      loaded.current = true;
    }
  }, []);

  // Persist whenever favorites change (skip initial load)
  useEffect(() => {
    if (!loaded.current) return;
    favoritesFile.write(JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
