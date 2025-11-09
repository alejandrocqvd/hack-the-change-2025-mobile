import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const getCommunityFromOSM = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    
    const data = await response.json();
    
    if (data.address) {
      return data.address.neighbourhood || 
             data.address.suburb ||
             data.address.city_district ||
             data.address.village ||
             data.address.town ||
             data.address.city ||
             'Unknown Community';
    }
    
    return 'Unknown Community';
  } catch (error) {
    console.error('OSM error:', error);
    return 'Unknown Community';
  }
};

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [community, setCommunity] = useState<string>('');
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [gettingAddress, setGettingAddress] = useState(false);
  const [detectingCommunity, setDetectingCommunity] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (permission?.granted) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          Alert.alert(
            'Location Access Required',
            'This app needs location access to associate photos with communities. Please enable location permissions in settings.',
            [{ text: 'OK' }]
          );
          return;
        }
        
        setLocationPermission(true);
        
        try {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setLocation(location);
          console.log('Location obtained:', location.coords);

          await getAddressAndCommunity(location.coords);
          
        } catch (error) {
          console.log('Error getting location:', error);
        }
      }
    })();
  }, [permission?.granted]);

  const getAddressAndCommunity = async (coords: { latitude: number; longitude: number }) => {
    try {
      setGettingAddress(true);
      setDetectingCommunity(true);

      const addresses = await Location.reverseGeocodeAsync(coords);
      
      if (addresses.length > 0) {
        const addressObj = addresses[0];
        const addressParts = [
          addressObj.street,
          addressObj.city,
          addressObj.region,
          addressObj.postalCode,
          addressObj.country
        ].filter(part => part).join(', ');
        
        setAddress(addressParts);
        console.log('Address found:', addressParts);
      }

      const detectedCommunity = await getCommunityFromOSM(coords.latitude, coords.longitude);
      setCommunity(detectedCommunity);
      console.log('Community detected:', detectedCommunity);
      
    } catch (error) {
      console.log('Error getting address/community:', error);
    } finally {
      setGettingAddress(false);
      setDetectingCommunity(false);
    }
  };

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
        let currentLocation = location;
        let currentAddress = address;
        let currentCommunity = community;
        
        if (locationPermission) {
          try {
            currentLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            setLocation(currentLocation);
            
            await getAddressAndCommunity(currentLocation.coords);
            currentAddress = address;
            currentCommunity = community;
            
          } catch (error) {
            console.log('Error getting fresh location:', error);
          }
        }

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });
        
        setPhoto(photo.uri);
        
        console.log('Photo with location data:', {
          uri: photo.uri,
          location: currentLocation?.coords,
          address: currentAddress,
          community: currentCommunity
        });
        
      } catch (error) {
        console.log('Error taking picture:', error);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  const handleContinue = () => {
    if (photo) {
      router.push({
        pathname: '/request-form',
        params: { 
          photoUri: photo,
          latitude: location?.coords.latitude?.toString(),
          longitude: location?.coords.longitude?.toString(),
          address: address || '',
          community: community || '',
          locationData: location ? JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
            address: address,
            community: community
          }) : undefined
        }
      });
    } else {
      router.push('/request-form');
    }
  };

  const handleCameraReady = () => {
    setCameraReady(true);
  };

  const handleBack = () => {
    router.back();
  };

  if (photo) {
    return (
      <View className="flex-1 bg-black">
        <Image source={{ uri: photo }} className="flex-1" resizeMode="contain" />
        <View className="absolute top-24 left-0 right-0 flex-row justify-between px-5 z-10">
            <TouchableOpacity 
              className="bg-black/50 px-4 py-3 rounded-lg"
              onPress={handleBack} 
            >
              <Text className="text-white text-base font-semibold">Back</Text>
            </TouchableOpacity>
          </View>
        
        <View className="absolute bottom-10 left-0 right-0 flex-row justify-around items-center px-5">
          <TouchableOpacity 
            onPress={retakePicture}
            className="bg-red-500 py-4 px-8 rounded-full min-w-32 items-center"
          >
            <Text className="text-white font-bold text-base">Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleContinue}
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
      
      <View className="flex-1 bg-black">
        <CameraView 
          style={{ flex: 1 }}
          facing={facing} 
          ref={cameraRef}
          onCameraReady={handleCameraReady}
        >
          <View className="absolute top-24 left-0 right-0 flex-row justify-between px-5 z-10">
            <TouchableOpacity 
              className="bg-black/50 px-4 py-3 rounded-lg"
              onPress={handleBack} 
            >
              <Text className="text-white text-base font-semibold">Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-black/50 px-4 py-3 rounded-lg"
              onPress={toggleCameraFacing}
            >
              <Text className="text-white text-base font-semibold">Flip Camera</Text>
            </TouchableOpacity>
          </View>
          
          {!cameraReady && (
            <View className="absolute inset-0 justify-center items-center bg-black">
              <Text className="text-white text-lg bg-black/70 px-6 py-4 rounded-xl">
                Starting Camera...
              </Text>
            </View>
          )}
        </CameraView>
      </View>
      
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