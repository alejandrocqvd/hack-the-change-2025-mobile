import ConfirmModal from "@/components/ui/ConfirmationPopup"
import NavBar from "@/components/ui/navbar"
import { getRequestById } from "@/lib/requests"
import { useLocalSearchParams } from "expo-router"
import { Calendar, MapPin } from "lucide-react-native"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native"

export default function ReportInfoPage() {
  const { id } = useLocalSearchParams()
  const [showConfirm, setShowConfirm] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReport() {
      try {
        const data = await getRequestById(id as string)
        setReport(data)
      } catch (error) {
        console.error("Error fetching report:", error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchReport()
  }, [id])

  const handleDelete = () => {
    setShowConfirm(false)
    console.log("Report deleted!")
  }

  if (loading) return <View className="flex-1 items-center justify-center bg-white"><ActivityIndicator size="large" color="#DC2626" /></View>
  if (!report) return <View className="flex-1 items-center justify-center bg-white"><Text className="text-gray-500">Report not found.</Text></View>

  const statusColor =
    report.state === "Open" ? "bg-green-100 text-green-700 border-green-200"
    : report.state === "Closed" ? "bg-gray-100 text-gray-700 border-gray-200"
    : "bg-yellow-100 text-yellow-700 border-yellow-200"

  return (
    <View className="flex-1 bg-white">
      <NavBar canGoBack={true} />
      <ScrollView showsVerticalScrollIndicator={false} className="p-5">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-xs font-semibold py-1 text-red-500 uppercase tracking-wide">{report.type}</Text>
          <View className={`px-3 py-1 rounded-full border ${statusColor}`}>
            <Text className="text-xs font-semibold">{report.state}</Text>
          </View>
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-4">{report.title}</Text>
        {report.image_url && <Image source={{ uri: report.image_url }} className="w-full h-52 rounded-xl mb-6" resizeMode="cover" />}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Calendar size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1">{new Date(report.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</Text>
          </View>
          <View className="flex-row items-center">
            <MapPin size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1">{report.community}</Text>
          </View>
        </View>
        <Text className="text-base text-gray-700 leading-6 mb-8">{report.description}</Text>
      </ScrollView>
      <ConfirmModal visible={showConfirm} title="Delete Report" message="Are you sure you want to delete this report? This action cannot be undone." confirmText="Delete" cancelText="Cancel" onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
    </View>
  )
}
