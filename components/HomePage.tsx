import NavBar from "@/components/ui/navbar";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";




const width = Dimensions.get("window").width;

function ReportCard(type: string, title: string, date: string, status: string, location: string, onPress: () => void) {
  const statusColor =
    status === "Open"
      ? "bg-green-100 text-green-700 border border-green-200"
      : status === "Closed"
      ? "bg-gray-100 text-gray-600 border border-gray-200"
      : "bg-yellow-100 text-yellow-700 border border-yellow-200";

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 my-2 w-[90%] self-center">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-xs font-semibold text-red-500 uppercase tracking-wide">{type}</Text>
        <View className={`px-3 py-1 rounded-full ${statusColor}`}>
          <Text className="text-xs font-semibold">{status}</Text>
        </View>
      </View>
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-500 mb-2">{date}</Text>
      <View className="flex-row items-center mb-4">
        <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
        <Text className="text-sm text-gray-700">{location}</Text>
      </View>
      <TouchableOpacity
        onPress={onPress}
        className="bg-red-500 py-2 rounded-full flex justify-center items-center"
      >
        <Text className="text-white font-semibold text-base">View request</Text>
      </TouchableOpacity>
    </View>
  );
}


function ReportInfoGroup(title: string, value: string, valueColor: string, link: string) {
  return (
    <View className="my-2 flex flex-col justify-center items-center w-28">
      <Text className="text-gray-500">{title}</Text> 
    <Text className="text-lg font-semibold" style={{ color: `#${valueColor}` }}>
        {value}
      </Text>
    </View>
  )
}

function Highlight(icon: string, title: string, value: string) {
  return (
    <View className="w-28 h-44 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 items-center justify-center">
      <View className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 shadow-inner">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Text className="text-sm font-semibold text-gray-700 text-center mb-1">
        {title}
      </Text>
      <Text className="text-lg font-bold text-gray-900 text-center">
        {value}
      </Text>
    </View>
  );
}

export default function Home() {
  const reports = [
  {
    type: "Fence",
    title: "Broken fence",
    date: "Nov 8 • 7:20 PM",
    status: "Open",
    location: "Chaparral",
  },
  {
    type: "Road Hazard",
    title: "Pothole on Main St.",
    date: "Nov 7 • 5:45 PM",
    status: "In Progress",
    location: "Main St. & 3rd Ave",
  },
  {
    type: "Lighting",
    title: "Streetlight out",
    date: "Nov 5 • 10:10 PM",
    status: "Closed",
    location: "Downtown",
  },
];

  return (
    <View className="flex flex-col justify-start items-center bg-white w-screen h-screen">
      <NavBar canGoBack={true} hasNotification={true} />
      <Text className="mb-4 mt-8 font-bold text-2xl">Your Reports</Text>
      <Carousel
        loop={false}
        width={width}
        height={195}
        autoPlay={false}
        data={reports}
        scrollAnimationDuration={800}
        renderItem={({ item }) => (
          <View className="flex-1 mx-4">
            {ReportCard(item.type, item.title, item.date, item.status, item.location, () => {})}
          </View>
        )}
      />
      <TouchableOpacity onPress={() => {}} className="my-4 bg-green-500 w-48 px-6 py-3 rounded-xl flex justify-center items-center">
        <Text className="text-white text-xl font-bold">+    New Report</Text>
      </TouchableOpacity>
      <View className="flex flex-row w-full justify-center items-center my-8 gap-4">
        {ReportInfoGroup("Total Reports", "24", "000000", "")}
        {ReportInfoGroup("Open", "18", "34C759", "")}
        {ReportInfoGroup("Resolved", "6", "FF3B30", "")} 
      </View>
      <View className="flex flex-row w-full justify-center items-center gap-4">
        {Highlight("🔥", "Streak", "12 days")}
        {Highlight("🏆", "Rank", "8 in Calgary")}
        {Highlight("🎯", "Impact Score", "112")}
      </View>
    </View>
  );
}
