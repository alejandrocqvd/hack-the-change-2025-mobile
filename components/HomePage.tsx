import NavBar from "@/components/ui/navbar";
import { calculateImpactScore, getUserRequests, getUserRequestStreak } from "@/lib/requests";
import { supabase } from "@/lib/supabase";
import { getUserId } from "@/lib/users";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import ReportCard from "./ui/ReportCard";

const width = Dimensions.get("window").width;

function ReportInfoGroup(title: string, value: number, valueColor: string) {
  return (
    <View className="my-2 flex flex-col justify-center items-center w-28">
      <Text className="text-gray-500">{title}</Text>
      <Text className="text-lg font-semibold" style={{ color: `#${valueColor}` }}>{value}</Text>
    </View>
  );
}

function Highlight(icon: string, title: string, value: string) {
  return (
    <View className="w-28 h-44 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 items-center justify-center">
      <View className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 shadow-inner">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Text className="text-sm font-semibold text-gray-700 text-center mb-1">{title}</Text>
      <Text className="text-lg font-bold text-gray-900 text-center">{value}</Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const totalReports = reports.length;
  const openReports = reports.filter(r => r.state === "Open").length;
  const resolvedReports = reports.filter(r => r.state === "Closed").length;
  const rank = 1;
  const impactScore = calculateImpactScore(streak, totalReports, rank)


  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = await getUserId()
        if (!userId) throw new Error("No user found")
        const [requests, streakValue] = await Promise.all([
          getUserRequests(userId),
          getUserRequestStreak(userId)
        ])
        setReports(requests || [])
        setStreak(streakValue || 0)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, []);

  return (
    <View className="flex flex-col justify-start items-center bg-white w-screen h-screen">
      <NavBar canGoBack={false} hasNotification={true} />
      <View className="flex flex-row justify-between items-center w-[90%] px-5">
        <Text className="mb-4 mt-8 font-bold text-2xl">Your Reports</Text>
        <TouchableOpacity onPress={() => router.push("/history")}>
          <Text className="mb-4 mt-8 font-bold">See All</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#DC2626" className="mt-10" />
      ) : reports.length > 0 ? (
        <Carousel loop={false} width={width} height={195} autoPlay={false} data={reports} scrollAnimationDuration={800}
          renderItem={({ item }) => (
            <View className="flex-1 mx-4">
              {ReportCard(item.id, item.type, item.title, item.created_at, item.state, item.community)}
            </View>
          )}
        />
      ) : (
        <Text className="text-gray-500 text-base my-10">You haven&apos;t submitted any reports yet.</Text>
      )}
      <TouchableOpacity onPress={() => router.push("/camera")} className="my-4 bg-green-500 w-48 px-6 py-3 rounded-xl flex justify-center items-center">
        <Text className="text-white text-xl font-bold">+ New Report</Text>
      </TouchableOpacity>
      <View className="flex flex-row w-full justify-center items-center my-8 gap-4">
        {ReportInfoGroup("Total Reports", totalReports, "000000")}
        {ReportInfoGroup("Open", openReports, "34C759")}
        {ReportInfoGroup("Resolved", resolvedReports, "FF3B30")}
      </View>
      <View className="flex flex-row w-full justify-center items-center gap-4 mb-10">
        {Highlight("🔥", "Streak", `${streak} days`)}
        {Highlight("🏆", "Rank", `${rank} in Calgary`)}
        {Highlight("🎯", "Impact Score", `${impactScore}`)}
      </View>
      <TouchableOpacity onPress={handleSignOut} className="mb-10 w-48 px-6 py-3 rounded-xl flex justify-center items-center">
        <Text className="text-lg font-bold text-red-600 underline">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
