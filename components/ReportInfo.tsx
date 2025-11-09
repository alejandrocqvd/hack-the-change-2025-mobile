import ConfirmModal from "@/components/ui/ConfirmationPopup";
import NavBar from "@/components/ui/navbar";
import { Calendar, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ReportInfoPage() {
  const [showConfirm, setShowConfirm] = useState(false);

  const type = "Fence";
  const title = "Broken Fence";
  const date = "Nov 8 • 7:20 PM";
  const location = "Chaparral";
  const status = "Open";
  const imageUrl =
    "https://media.istockphoto.com/id/1322903308/photo/wooden-garden-fenced-blown-down-by-strong-winds.jpg?s=612x612&w=0&k=20&c=dBGMLsNSErOudQRH0eApGjzQTwOkY2hAcC3e9w8sHn4=";
  const description =
    "A wooden fence panel has collapsed near the playground area. It poses a safety hazard for kids and needs repair as soon as possible.";

  const handleDelete = () => {
    setShowConfirm(false);
    console.log("Report deleted!");
  };

  const statusColor =
    status === "Open"
      ? "bg-green-100 text-green-700 border-green-200"
      : status === "Closed"
      ? "bg-gray-100 text-gray-700 border-gray-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <View className="flex-1 bg-white">
      <NavBar canGoBack={true} />
      <ScrollView showsVerticalScrollIndicator={false} className="p-5">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-xs font-semibold py-1 text-red-500 uppercase tracking-wide">{type}</Text>
          <View className={`px-3 py-1 rounded-full border ${statusColor}`}>
            <Text className="text-xs font-semibold">{status}</Text>
          </View>
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-4">{title}</Text>
        <Image source={{ uri: imageUrl }} className="w-full h-52 rounded-xl mb-6" resizeMode="cover" />
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Calendar size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1">{date}</Text>
          </View>
          <View className="flex-row items-center">
            <MapPin size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1">{location}</Text>
          </View>
        </View>
        <Text className="text-base text-gray-700 leading-6 mb-8">{description}</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity className="flex-1 bg-gray-200 rounded-xl py-3 mr-2">
            <Text className="text-center text-gray-800 font-semibold text-lg">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-red-500 rounded-xl py-3 ml-2" onPress={() => setShowConfirm(true)}>
            <Text className="text-center text-white font-semibold text-lg">Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showConfirm}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </View>
  );
}
