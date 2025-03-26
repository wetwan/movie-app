import MovieCard from "@/components/MovieCard";
import Searchbar from "@/components/Searchbar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { FetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const {
    data: movies,
    loading,
    error,
    refetch,
    reset,
  } = useFetch(() => FetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await refetch();
      } else {
        reset();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0 "
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        className="px-5"
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? ` No movies found for ${searchQuery}`
                  : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <Searchbar
                placeholder="Search movies......"
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}
            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}
            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className=" text-xl text-white font-bold">
                Search Result for
                <Text className="text-accent"> {searchQuery}</Text>
              </Text>
            )}
          </>
        }
      />
    </View>
  );
};

export default Search;
