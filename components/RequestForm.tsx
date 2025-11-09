// components/RequestForm.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  
  // Handle photoUri which might be string or string[]
  const actualPhotoUri = Array.isArray(photoUri) ? photoUri[0] : photoUri;
  const initialImageUri = actualPhotoUri || null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: null,
    imageUri: initialImageUri,
  });

  const [errors, setErrors] = useState({
    title: '',
    type: '',
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

  const [uploading, setUploading] = useState(false);

  // Upload image to Supabase Storage - FIXED VERSION
  const uploadImageToSupabase = async (fileUri: string) => {
    try {
      console.log('Uploading image:', fileUri);
      
      // Use FormData - this works in React Native
      const formData = new FormData();
      const filename = fileUri.split('/').pop() || `photo-${Date.now()}.jpg`;
      
      formData.append('file', {
        uri: fileUri,
        type: 'image/jpeg', 
        name: filename,
      } as any);
      
      const storageFileName = `requests/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(storageFileName, formData);

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(storageFileName);

      console.log('Upload successful, public URL:', urlData.publicUrl);
      return urlData.publicUrl;

    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      type: '',
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

    setUploading(true);

    try {
      let finalImageUrl = null;

      // Upload image if it's a local file:// URI
      if (formData.imageUri && formData.imageUri.startsWith('file://')) {
        try {
          finalImageUrl = await uploadImageToSupabase(formData.imageUri);
          console.log('Image uploaded successfully:', finalImageUrl);
        } catch (uploadError) {
          console.error('Image upload failed, continuing without image:', uploadError);
          // Continue without image if upload fails
          finalImageUrl = null;
        }
      } else if (formData.imageUri) {
        // If it's already a web URL, use it as-is
        finalImageUrl = formData.imageUri;
      }

      // Prepare data for backend
      const submissionData: any = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        created_at: new Date().toISOString(),
      };

      // Only add image_url if we have one
      if (finalImageUrl) {
        submissionData.image_url = finalImageUrl;
      }

      console.log('Submitting data:', submissionData);

      const { data, error } = await supabase
        .from('requests')
        .insert([submissionData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

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
                imageUri: null,
              });
              setValue(null);
              router.back();
            }
          }
        ]
      );

      console.log('Inserted data:', data);

    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Error',
        'Failed to submit request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    router.back();
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
            <Text className="text-lg font-semibold mb-2">Captured Image (Optional)</Text>
            {formData.imageUri ? (
              <View className="border-2 border-dashed border-gray-300 rounded-lg bg-black overflow-hidden">
                <Image 
                  source={{ uri: formData.imageUri }} 
                  className="w-full h-64"
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 h-64 justify-center items-center">
                <Text className="text-gray-500 text-center">No image captured</Text>
                <Text className="text-gray-400 text-sm text-center mt-2">
                  You can submit without an image
                </Text>
              </View>
            )}
            <Text className="text-gray-500 text-sm mt-2 text-center">
              {formData.imageUri ? 
                (formData.imageUri.startsWith('file://') ? 
                  'Image will be uploaded when you submit' : 
                  'Image ready for submission') : 
                'Optional - no image will be submitted'
              }
            </Text>
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
            className={`py-4 rounded-lg mt-4 ${
              uploading ? 'bg-gray-400' : 'bg-[#FF3103]'
            }`}
            onPress={handleSubmit}
            disabled={uploading}
          >
            <Text className="text-white text-center font-bold text-lg">
              {uploading ? 'Uploading...' : 'Submit Request'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-gray-500 py-4 rounded-lg mt-3"
            onPress={handleBack}
            disabled={uploading}
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