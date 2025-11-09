import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

export default function ConfirmationPopup({ visible, title, message, confirmText = "Delete", cancelText = "Cancel", onConfirm, onCancel }: { visible: boolean; title: string; message: string; confirmText?: string; cancelText?: string; onConfirm: () => void; onCancel: () => void; }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable className="flex-1 bg-black/40 justify-center items-center px-6" onPress={onCancel}>
        <Pressable className="bg-white w-full rounded-2xl p-6 shadow-md" onPress={(e) => e.stopPropagation()}>
          <Text className="text-xl font-bold text-gray-900 mb-2">{title}</Text>
          <Text className="text-gray-700 mb-6">{message}</Text>
          <View className="flex-row justify-between">
            <Pressable onPress={onCancel} className="flex-1 bg-gray-200 py-3 rounded-xl mr-2">
              <Text className="text-center text-gray-800 font-semibold text-base">{cancelText}</Text>
            </Pressable>
            <Pressable onPress={onConfirm} className="flex-1 bg-red-500 py-3 rounded-xl ml-2">
              <Text className="text-center text-white font-semibold text-base">{confirmText}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
