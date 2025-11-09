import { useNavigation } from '@react-navigation/native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (permission?.granted) {
      console.log('Camera permission granted');
    }
  }, [permission]);

  if (!permission) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-center text-lg">Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-5">
        <Text className="text-white text-center text-lg mb-5">
          We need your permission to use the camera
        </Text>
        <TouchableOpacity 
          onPress={requestPermission} 
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold text-base">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });
        setPhoto(photo.uri);
        console.log('Photo taken:', photo.uri);
      } catch (error) {
        console.log('Error taking picture:', error);
      }
    } else {
      console.log('Camera not ready');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  const handleCameraReady = () => {
    console.log('Camera is ready');
    setCameraReady(true);
  };

   if (photo) {
    return (
      <View className="flex-1 bg-black">
        <Image source={{ uri: photo }} className="flex-1" resizeMode="contain" />
        <View className="absolute bottom-10 left-0 right-0 flex-row justify-around items-center px-5">
          <TouchableOpacity 
            onPress={retakePicture}
            className="bg-red-500 py-4 px-8 rounded-full min-w-32 items-center"
          >
            <Text className="text-white font-bold text-base">Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push("/request-form")}
            className="bg-green-500 py-4 px-8 rounded-full min-w-32 items-center"
          >
            <Text className="text-white font-bold text-base">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar backgroundColor="black" barStyle="light-content" />
      
      {/* Camera View - Force full screen */}
      <View className="flex-1 bg-black">
        <CameraView 
          style={{ flex: 1 }}
          facing={facing} 
          ref={cameraRef}
          onCameraReady={handleCameraReady}
          onMountError={(error) => {
            console.log('Camera mount error:', error);
          }}
        >
          {/* Flip button positioned safely */}
          <View className="absolute top-12 right-5 z-10">
            <TouchableOpacity 
              onPress={toggleCameraFacing}
              className="bg-black/50 px-4 py-3 rounded-lg"
            >
              <Text className="text-white text-base font-semibold">Flip Camera</Text>
            </TouchableOpacity>
          </View>
          
          {/* Camera status - only show if not ready */}
          {!cameraReady && (
            <View className="absolute inset-0 justify-center items-center bg-black">
              <Text className="text-white text-lg bg-black/70 px-6 py-4 rounded-xl">
                Starting Camera...
              </Text>
            </View>
          )}
        </CameraView>
      </View>
      
      {/* Capture button */}
      <View className="absolute bottom-10 left-0 right-0 items-center justify-center">
        <TouchableOpacity 
          className={`w-20 h-20 rounded-full justify-center items-center border-4 ${
            cameraReady ? 'bg-white border-gray-200' : 'bg-gray-600 border-gray-400'
          }`}
          onPress={takePicture}
          disabled={!cameraReady}
        >
          <View className={`w-16 h-16 rounded-full border-2 ${
            cameraReady ? 'bg-white border-gray-300' : 'bg-gray-400 border-gray-500'
          }`} />
        </TouchableOpacity>
      </View>
    </View>
  );
}