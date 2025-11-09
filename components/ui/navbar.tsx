import { useRouter } from "expo-router";
import { ArrowLeft, Bell } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function NavBar({ canGoBack = false, hasNotification = false }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const notifications = [
    { id: 1, title: "Report #132 resolved", time: "2h ago" },
    { id: 2, title: "New comment on your report", time: "5h ago" },
    { id: 3, title: "City update: Road work near Main St.", time: "1d ago" },
  ];

  return (
    <View className="flex-row items-center justify-between w-full px-5 pt-[4.75rem] pb-4 bg-red-600 relative">
      {canGoBack ? (
        <Pressable onPress={() => router.back()} className="p-3 rounded-full bg-gray-100 active:bg-gray-200">
          <ArrowLeft size={22} color="#111" />
        </Pressable>
      ) : (
        <View className="w-12" />
      )}

      <Image source={require("@/assets/images/logo.png")} className="w-24 h-10" resizeMode="contain" />

      <View className="relative">
        <Pressable
          onPress={() => setShowDropdown(!showDropdown)}
          className="p-2 rounded-full active:bg-gray-200"
        >
          <Bell size={28} color="#111" />
        </Pressable>
        {hasNotification && (
          <View className="absolute bottom-2 right-2 w-3 h-3 bg-red-500 rounded-full border border-white" />
        )}

        {showDropdown && (
          <View className="absolute top-20 right-0 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            {notifications.length === 0 ? (
              <Text className="text-gray-500 text-center py-4">No new notifications</Text>
            ) : (
              notifications.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                  onPress={() => {
                    setShowDropdown(false);
                    router.push("/report-info");
                  }}
                >
                  <Text className="text-sm font-semibold text-gray-800">{n.title}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{n.time}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>
    </View>
  );
}
