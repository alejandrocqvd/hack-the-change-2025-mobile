import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

function Dropdown({ label, options, selected, onSelect }: { label: string; options: string[]; selected: string; onSelect: (value: string) => void; }) {
  const [open, setOpen] = useState(false);
  return (
    <View className="flex-1 mx-1">
      <Text className="text-xs font-semibold text-gray-600 mb-1">{label}</Text>
      <Pressable onPress={() => setOpen(true)} className="flex-row justify-between items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
        <Text className="text-sm text-gray-800" numberOfLines={1}>{selected}</Text>
        <ChevronDown size={16} color="#666" />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/30" onPress={() => setOpen(false)}>
          <View className="absolute top-1/3 left-6 right-6 bg-white rounded-xl p-4 shadow-lg">
            <Text className="text-lg font-semibold mb-2">{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable onPress={() => { onSelect(item); setOpen(false); }} className={`px-3 py-2 rounded-lg ${selected === item ? "bg-green-100" : "bg-white"}`}>
                  <Text className={`text-base ${selected === item ? "text-green-600 font-semibold" : "text-gray-700"}`}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function FilterRow({ selectedStatus, setSelectedStatus, selectedDate, setSelectedDate, selectedLocation, setSelectedLocation }: {
  selectedStatus: string; setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: string; setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  selectedLocation: string; setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [status, setStatus] = useState(selectedStatus ?? "All");
  const [date, setDate] = useState(selectedDate ?? "Any");
  const [location, setLocation] = useState(selectedLocation ?? "All");
  const handleStatus = (v: string) => { setStatus(v); setSelectedStatus(v); };
  const handleDate = (v: string) => { setDate(v); setSelectedDate(v); };
  const handleLocation = (v: string) => { setLocation(v); setSelectedLocation(v); };
  return (
    <View className="flex-row justify-between items-start mx-5 border-b border-gray-300 pb-6">
      <Dropdown label="Status" options={["All", "Open", "Closed"]} selected={status} onSelect={handleStatus} />
      <Dropdown label="Date" options={["Any", "Today", "This Week", "This Month"]} selected={date} onSelect={handleDate} />
      <Dropdown label="Location" options={["All", "Downtown", "Chaparral", "Silverado"]} selected={location} onSelect={handleLocation} />
    </View>
  );
}
