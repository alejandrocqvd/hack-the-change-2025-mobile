import FilterRow from "@/components/ui/dropdown";
import NavBar from "@/components/ui/navbar";
import ReportCard from "@/components/ui/ReportCard";
import { Search } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("Any");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const reports = [
    { id: 1, type: "Fence", title: "Broken fence", date: "Nov 8 • 7:20 PM", status: "Open", location: "Chaparral" },
    { id: 2, type: "Road Hazard", title: "Pothole on Main St.", date: "Nov 7 • 5:45 PM", status: "In Progress", location: "Main St. & 3rd Ave" },
    { id: 3, type: "Lighting", title: "Streetlight out", date: "Nov 5 • 10:10 PM", status: "Closed", location: "Downtown" },
    { id: 4, type: "Waste", title: "Overflowing bin", date: "Nov 4 • 3:00 PM", status: "Open", location: "Eau Claire" },
  ];

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;
    const matchesLocation = selectedLocation === "All" || r.location === selectedLocation;
    const matchesDate = selectedDate === "Any";
    return matchesSearch && matchesStatus && matchesDate && matchesLocation;
  });

  return (
    <View className="flex-1 bg-white">
      <NavBar canGoBack={true} hasNotification={true} />  
      <Text className="text-2xl font-bold mb-4 mx-5 mt-8">History</Text>

      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4 mx-5">
        <TextInput
          placeholder="Search reports..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 text-base text-gray-800 mx-5"
        />
        <Search size={20} color="#666" />
      </View>

      <FilterRow
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredReports.map((item) => (
          <View key={item.id}>
            {ReportCard(item.type, item.title, item.date, item.status, item.location, () =>
              console.log("Viewing", item.title)
            )}
          </View>
        ))}
        {filteredReports.length === 0 && (
          <Text className="text-center mx-5 text-gray-500 mt-10">No reports found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
