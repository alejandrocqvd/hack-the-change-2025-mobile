import FilterRow from "@/components/ui/dropdown"
import NavBar from "@/components/ui/navbar"
import ReportCard from "@/components/ui/ReportCard"
import { getUserRequests } from "@/lib/requests"
import { getUserId } from "@/lib/users"
import { Search } from "lucide-react-native"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, Text, TextInput, View } from "react-native"

export default function History() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedDate, setSelectedDate] = useState("Any")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      try {
        const userId = await getUserId()
        if (!userId) throw new Error("No user found")
        const data = await getUserRequests(userId)
        setReports(data || [])
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

const filteredReports = reports.filter(r => {
  const matchesSearch =
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.community.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesStatus = selectedStatus === "All" || r.state === selectedStatus;
  const matchesLocation = selectedLocation === "All" || r.community.toLowerCase() === selectedLocation.toLowerCase();

  let matchesDate = true;
  if (selectedDate !== "Any" && r.created_at) {
    const created = new Date(r.created_at);
    const now = new Date();

    if (selectedDate === "Today") {
      matchesDate = created.toDateString() === now.toDateString();
    } else if (selectedDate === "This Week") {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      matchesDate = created >= sevenDaysAgo && created <= now;
    } else if (selectedDate === "This Month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      matchesDate = created >= startOfMonth && created < endOfMonth;
    }
  }

  return matchesSearch && matchesStatus && matchesDate && matchesLocation;
});


  return (
    <View className="flex-1 bg-white">
      <NavBar canGoBack={true} hasNotification={true} />
      <Text className="text-2xl font-bold mb-4 mx-5 mt-8">History</Text>
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4 mx-5">
        <TextInput placeholder="Search reports..." placeholderTextColor="#888" value={searchQuery} onChangeText={setSearchQuery} className="flex-1 text-base text-gray-800 mx-5" />
        <Search size={20} color="#666" />
      </View>
      <FilterRow selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
      {loading ? <ActivityIndicator size="large" color="#DC2626" className="mt-10" /> : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredReports.map(item => (
            <View key={item.id}>{ReportCard(item.id, item.type, item.title, item.created_at, item.state, item.community)}</View>
          ))}
          {filteredReports.length === 0 && <Text className="text-center mx-5 text-gray-500 mt-10">No reports found.</Text>}
        </ScrollView>
      )}
    </View>
  )
}
