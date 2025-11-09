import '@/global.css';
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="history" />
      <Stack.Screen name="report-info" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="request-form" />
    </Stack>
  )
}
