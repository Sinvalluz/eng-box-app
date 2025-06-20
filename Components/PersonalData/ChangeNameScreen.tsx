import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, Text, TextInput, View } from "react-native";
import { getApiAxios } from "../../services/axios";
// import { getUserDetails } from '../../utils/session/user-data';
import { userStore } from "../../utils/stores/user";
import GoBackButton from "../GoBackButton";
import HandleSaveButton from "./HandleSaveButton";
import SuccessModal from "./SuccessModal";
import { useUser } from "../profile/UserContext";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../utils/types/navigation";

const ChangeNameScreen = () => {
  const [isChanged, setIsChanged] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const { userProfile, setUserProfile, getUserDetails } = useUser();
  const navigation = useNavigation<NavigationProp>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userProfile?.nome ?? "",
    },
  });

  const capitalizeName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const onSubmit = async (data: { name: string | undefined }) => {
    try {
      if (!userProfile) {
        await getUserDetails();
      } else {
        if (data?.name) {
          const formattedName = capitalizeName(data.name);

          const api = await getApiAxios();
          await api.put(`/api/usuario/${userProfile.id}`, {
            nome: formattedName,
          });

          setUserProfile((prevUserProfile) => ({
            ...prevUserProfile,
            nome: formattedName,
          }));
          setIsChanged(false);
          setModalVisible(true);

          setTimeout(() => setModalVisible(false), 1000);
          navigation.navigate("PersonalData");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 mt-4">
      <GoBackButton title="Nome" />
      <Text
        className="text-sm text-[#767676] ml-9 mt-8 mb-2"
        style={{ fontFamily: "poppins-medium" }}
      >
        Para alterar o nome, clique aqui
      </Text>
      <View className="flex items-center flex-1">
        <View className="flex-row w-10/12 h-14 items-center border-2 rounded-xl border-[#767676] pl-2">
          <Ionicons name="text" size={30} color={"#76767670"} />

          <Controller
            control={control}
            name="name"
            rules={{
              required: "Nome é obrigatório",
              minLength: {
                value: 3,
                message: "O nome deve ter pelo menos três letras",
              },
              maxLength: {
                value: 51,
                message: "O nome deve ter no máximo 51 letras",
              },
              pattern: {
                value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
                message:
                  "O nome só pode conter letras, acentos e espaços. Caracteres especiais são inválidos.",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                placeholder="Digite seu nome"
                onChangeText={(text) => {
                  onChange(text);
                  setIsChanged(text !== userProfile?.nome);
                }}
                onBlur={onBlur}
                className="w-11/12 h-full pl-2 text-[#767676] text-lg"
                style={{ fontFamily: "poppins-medium" }}
              />
            )}
          />
        </View>
        {errors.name && (
          <Text
            className="text-red-500 ml-5 text-justify"
            style={{ fontFamily: "poppins-regular" }}
          >
            {errors.name.message}
          </Text>
        )}

        <HandleSaveButton
          onPress={handleSubmit(onSubmit)}
          isChanged={isChanged}
        />
      </View>

      <SuccessModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ChangeNameScreen;
