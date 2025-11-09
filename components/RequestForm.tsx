// components/RequestForm.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../lib/supabase';

export default function RequestForm() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get the captured image URI from camera screen or use placeholder
  const { imageUri } = route.params || {};
  const initialImageUri = imageUri || 'https://research.ucalgary.ca/sites/default/files/styles/ucws_image_desktop/public/2024-05/Ahead-of-Tomorrow-Hero_NEW-2_0.jpg?h=e400bdbf&itok=OCp5p7r9';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: null,
    imageUri: initialImageUri,
  });

  const [errors, setErrors] = useState({
    title: '',
    type: '',
    image: ''
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Potholes', value: 'Potholes' },
    { label: 'Cracked Pavement', value: 'Cracked Pavement' },
    { label: 'Roadway Flooding', value: 'Roadway Flooding' },
    { label: 'Sinkholes', value: 'Sinkholes' },
    { label: 'Blocked Access', value: 'Blocked Access' },
    { label: 'Broken Traffic Lights', value: 'Broken Traffic Lights' },
    { label: 'Damaged Street Signs', value: 'Damaged Street Signs' },
    { label: 'Missing Street Signs', value: 'Missing Street Signs' },
    { label: 'Abandoned Vehicles', value: 'Abandoned Vehicles' },
    { label: 'Illegal Parking', value: 'Illegal Parking' },
    { label: 'Snow Piles Blocking Driveways', value: 'Snow Piles Blocking Driveways' },
    { label: 'Bike Lane Obstructions', value: 'Bike Lane Obstructions' },
    { label: 'Damaged Bike Racks', value: 'Damaged Bike Racks' },
    { label: 'Faded Crosswalk Markings', value: 'Faded Crosswalk Markings' },
    { label: 'Bus Stop Damage', value: 'Bus Stop Damage' },
    { label: 'Damaged Sidewalk Ramps', value: 'Damaged Sidewalk Ramps' },
    { label: 'Missing Sidewalk Ramps', value: 'Missing Sidewalk Ramps' },
    { label: 'Damaged Trees', value: 'Damaged Trees' },
    { label: 'Broken Playground Equipment', value: 'Broken Playground Equipment' },
    { label: 'Graffiti', value: 'Graffiti' },
    { label: 'Vandalism', value: 'Vandalism' },
  ]);

  const validateForm = () => {
    const newErrors = {
      title: '',
      type: '',
      image: ''
    };

    let isValid = true;

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    // Validate type
    if (!formData.type) {
      newErrors.type = 'Please select an incident type';
      isValid = false;
    }

    // Validate image (check if it's still the placeholder)
    // if (formData.imageUri.includes('placeholder.com')) {
    //   newErrors.image = 'Please capture an image before submitting';
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    // Dismiss keyboard first
    Keyboard.dismiss();

    // Validate form
    if (!validateForm()) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields before submitting.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // Prepare data for backend
      const submissionData = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        image_url: formData.imageUri,
        created_at: new Date().toISOString(),
      };

      console.log('Submitting data:', submissionData);

      // TODO: Replace with your actual backend API URL
      const { data, error } = await supabase
      .from('requests') // Your table name
      .insert([submissionData])
      .select(); // This returns the inserted data

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Inserted data:', data);

     Alert.alert(
      'Success!',
      'Your request has been submitted successfully.',
      [
        { 
          text: 'OK', 
          onPress: () => {
            // Reset form after user clicks OK
            setFormData({ 
              title: '', 
              description: '', 
              type: null,
              imageUri: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Camera+Image+Here'
            });
            setValue(null);
            navigation.goBack();
          }
        }
      ]
    );

    console.log('Inserted data:', data);

  } catch (error) {
    console.error('Supabase submission error:', error);
    Alert.alert(
      'Error',
      'Failed to submit request. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-5">
          <Text className="text-2xl font-bold mb-5">Submit Request</Text>
          
          <View className="mb-5">
            <Text className="text-lg font-semibold mb-2">Captured Image *</Text>
            <View className={`border-2 border-dashed rounded-lg bg-gray-50 ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}>
              <Image 
                source={{ uri: formData.imageUri }} 
                className="w-full h-64"
                resizeMode="cover"
              />
            </View>
            {errors.image ? (
              <Text className="text-red-500 text-sm mt-1">{errors.image}</Text>
            ) : (
              <Text className="text-gray-500 text-sm mt-2 text-center">
                {formData.imageUri.includes('placeholder.com') 
                  ? 'Image from camera will appear here' 
                  : 'Image ready for submission'
                }
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-lg font-medium mb-2">Title *</Text>
            <TextInput
              className={`border rounded-lg p-4 text-lg ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter request title"
              placeholderTextColor="gray"
              value={formData.title}
              onChangeText={(text) => {
                setFormData({...formData, title: text});
                clearError('title');
              }}
            />
            {errors.title ? (
              <Text className="text-red-500 text-sm mt-1">{errors.title}</Text>
            ) : null}
          </View>

          <View className="mb-4 z-50">
            <Text className="text-lg font-medium mb-2">Type *</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select an incident type"
              searchable={true}
              searchPlaceholder="Type to search incidents..."
              listMode="SCROLLVIEW"
              onChangeValue={(selectedValue) => {
                setFormData({...formData, type: selectedValue});
                clearError('type');
              }}
              // Improved keyboard handling with scrollbar
              autoScroll={true}
              scrollViewProps={{
                keyboardShouldPersistTaps: 'handled',
                nestedScrollEnabled: true,
                showsVerticalScrollIndicator: true,
                indicatorStyle: 'black',
                scrollIndicatorInsets: { right: 1 },
              }}
              searchTextInputProps={{
                autoFocus: false,
                autoCorrect: false,
              }}
              onPress={() => {
                if (!open) {
                  setOpen(true);
                }
              }}
              onClose={() => {
                Keyboard.dismiss();
              }}
              style={{
                borderColor: errors.type ? '#ef4444' : '#d1d5db',
                backgroundColor: '#f9fafb',
              }}
              dropDownContainerStyle={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
                maxHeight: 200,
              }}
              textStyle={{
                fontSize: 16,
              }}
              placeholderStyle={{
                color: '#9ca3af',
              }}
            />
            {errors.type ? (
              <Text className="text-red-500 text-sm mt-1">{errors.type}</Text>
            ) : null}
          </View>

          <View className="mb-4">
            <Text className="text-lg font-medium mb-2">Description (Optional)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-lg h-32"
              placeholder="Enter request description"
              placeholderTextColor="gray"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
            />
          </View>

          <TouchableOpacity 
            className="bg-[#FF3103] py-4 rounded-lg mt-4"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-bold text-lg">Submit Request</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-gray-500 py-4 rounded-lg mt-3"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white text-center font-bold text-lg">Back to Camera</Text>
          </TouchableOpacity>

          <Text className="text-gray-500 text-sm mt-4 text-center">
            * Required fields
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}