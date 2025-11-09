import { getUserNotifications, updateAllNotificationsToRead } from "@/lib/notification";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function NavBar({ canGoBack = false, hasNotification = false }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [notificationsStale, setNotificationsStale] = useState(true);

  function formatDate(inputDate: string): string {
  const date = new Date(inputDate)
  return date.toLocaleDateString("en-US", {
    timeZone: "America/Denver", year: "numeric", month: "short", day: "numeric",
  })
}

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getUserNotifications();
      if (!mounted) return;
      setNotifications(data);
      setNotificationsStale(false);
      setHasUnread(data.some(n => !n.is_read));
    })();
    return () => { mounted = false; };
  }, []);

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
          onPress={async () => {
            const next = !showDropdown;
            setShowDropdown(next);
            if (!next) {
              await updateAllNotificationsToRead();
              setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
              setNotificationsStale(true);
              setHasUnread(false);
            }
          }}
          className="p-2 rounded-full active:bg-gray-200"
        >
          <Bell size={28} color="#111" />
        </Pressable>
        {hasUnread && !notificationsStale && (
          <View className="absolute bottom-2 right-2 w-3 h-3 bg-red-500 rounded-full border border-white" />
        )}
        {showDropdown && (
          <View className="absolute top-20 right-0 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            {notifications.length === 0 ? (
              <Text className="text-gray-500 text-center py-4">No notifications</Text>
            ) : (
              notifications.map(n => (
                <TouchableOpacity
                  key={n.id}
                  className={`px-4 py-3 border-b border-gray-100 ${!n.is_read ? "bg-gray-50" : "bg-white"}`}
                  onPress={() => {
                    setShowDropdown(false);
                    router.push(`/report-info/${n.request_id}`);
                  }}
                >
                  <Text className={`text-sm ${!n.is_read ? "font-extrabold" : "font-semibold"} text-gray-800`}>{n.title || n.message}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{formatDate(n.created_at)}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>
    </View>
  );
}
