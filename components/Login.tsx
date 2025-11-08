import "@/global.css";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Login() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="items-center mt-20 mb-12">
        <Text className="text-3xl font-bold text-gray-800">
          Placeholder Project Name
        </Text>
      </View>

      <View className="flex-1 justify-center items-center px-5">
        <TouchableOpacity className="w-full max-w-xs bg-[#FF3103] py-4 rounded-2xl mb-4 items-center">
          <Text className="text-white text-lg font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="w-full max-w-xs bg-[#FF3103] py-4 rounded-2xl items-center">
          <Text className="text-white text-lg font-semibold">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}