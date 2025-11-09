import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Image, Pressable, View } from "react-native";

export default function NavBar({ canGoBack = false, hasNotification = false }) {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between w-full px-5 pt-[4.75rem] pb-4 bg-red-600">
      {canGoBack ? (
        <Pressable onPress={() => router.back()} className="p-3 rounded-full bg-gray-100 active:bg-gray-200">
          <ArrowLeft size={22} color="#111" />
        </Pressable>
      ) : (
        <View className="w-10" />
      )}
      <Image source={require("@/assets/images/logo.png")} className="w-24 h-10" resizeMode="contain" />
      <View className="relative">
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=3" }}
          className="w-12 h-12 rounded-full border border-gray-300"
        />
        {hasNotification && (
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white" />
        )}
      </View>
    </View>
  );
}
