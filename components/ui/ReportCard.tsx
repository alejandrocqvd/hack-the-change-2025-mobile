import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

function formatDate(inputDate: string): string {
  const date = new Date(inputDate)
  return date.toLocaleDateString("en-US", {
    timeZone: "America/Denver", year: "numeric", month: "short", day: "numeric",
  })
}

export default function ReportCard(id: string, type: string, title: string, date: string, status: string, location: string) {
  const statusColor =
    status === "Open"
      ? "bg-green-100 text-green-700 border border-green-200"
      : status === "Closed"
      ? "bg-gray-100 text-gray-600 border border-gray-200"
      : "bg-yellow-100 text-yellow-700 border border-yellow-200";
  const router = useRouter();

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 my-2 w-[90%] self-center">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-xs font-semibold text-red-500 uppercase tracking-wide">{type}</Text>
        <View className={`px-3 py-1 rounded-full ${statusColor}`}>
          <Text className="text-xs font-semibold">{status}</Text>
        </View>
      </View>
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-500 mb-2">{formatDate(date)}</Text>
      <View className="flex-row items-center mb-4">
        <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
        <Text className="text-sm text-gray-700">{location}</Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push(`/report-info/${id}`)}
        className="bg-red-500 py-2 rounded-full flex justify-center items-center"
      >
        <Text className="text-white font-semibold text-base">View request</Text>
      </TouchableOpacity>
    </View>
  );
}