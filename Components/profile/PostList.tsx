import { Dimensions, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/types/navigation";
import { Post } from "../../utils/types/post";
import { Receita } from "../../utils/types/receitas";

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface PostListProps {
  posts: Receita[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = Dimensions.get("window");

  // Retirar quando a api tiver funcionando
  const randomImageSeed = useMemo(
    () => Math.floor(Math.random() * 1000) + 1,
    []
  );

  // Função que renderiza cada item da lista
  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      className="border-r border-b border-[#B8B8B8]"
      style={{ width: width / 3 - 1 }}
      onPress={() =>
        navigation.navigate("PostDetails", {
          id: item.id,
          imageUrl: item.fotos[0] || "",
          titulo: item.titulo,
          conteudo: item.conteudo,
        })
      }
    >
      <Image
        source={{
          uri: `https://picsum.photos/300/300?random=${randomImageSeed}`,
        }} // dando erro por conta do any em navigation
        className="w-[140.33px] h-[140.33px]"
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderPostItem}
      numColumns={3}
      scrollEnabled={false}
    />
  );
};

export default PostList;
