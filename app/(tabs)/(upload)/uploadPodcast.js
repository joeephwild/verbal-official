import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon, PhotoIcon } from "react-native-heroicons/solid";
import { CheckBox } from "react-native-elements";
import { router } from "expo-router";
import { pickImage } from "../../../lib/services/userService";

const uploadPodcast = () => {
  const [image, setImage] = useState("");

  const handleImageUpload = async () => {
    const result = await pickImage();
    setImage(result);
  };
  return (
    <SafeAreaView>
      <ScrollView className="mt-[6px] mx-[24px]">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center space-x-4 "
        >
          <ChevronLeftIcon color="#fff" size={25} />
          <Text className="text-[20px] font-semibold text-[#fff] leading-normal">
            Upload Podcast
          </Text>
        </Pressable>
        <View className="space-y-[6px] mt-[28px]">
          <Pressable
            onPress={handleImageUpload}
            className="border border-[#ccca] w-full h-[20%] py-[16px] rounded-[8px] items-center justify-center"
          >
            <PhotoIcon size={25} color="#fff" />
            <Text className="text-[16px] text-start font-semibold text-[#fff]">
              Upload A Image
            </Text>
          </Pressable>
          <View className="space-y-[8px] items-start">
            <Text className="text-[16px] text-start font-semibold text-[#fff]">
              Podcast Title
            </Text>
            <TextInput
              placeholder=""
              className="bg-[#000] border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
            />
          </View>
          <View className="space-y-[8px] items-start">
            <Text className="text-[16px] text-start font-semibold text-[#fff]">
              Podcast Url
            </Text>
            <TextInput
              placeholder=""
              className="bg-[#000] border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
            />
          </View>
          <View className="space-y-[8px] items-start">
            <Text className="text-[16px] text-start font-semibold text-[#fff]">
              Add Thumbnail
            </Text>
            <TextInput
              placeholder=""
              errorMessage=""
              className="bg-[#000] border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
            />
          </View>
          <View className="space-y-[8px] items-start">
            <Text className="text-[16px] text-start font-semibold text-[#fff]">
              Add Podcast
            </Text>
            <TextInput
              placeholder=""
              className="bg-[#000] border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
            />
          </View>
          <View className="space-y-[8px] items-start">
            <Text className="text-[16px] text-start font-semibold text-[#fff]">
              Category
            </Text>
            <TextInput
              placeholder=""
              className="bg-[#000] border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
            />
          </View>
        </View>
        <Pressable
          // onPress={() => router.push("/CreateAccount")}
          className="bg-[#F70] w-full py-[16px] mt-[15px] rounded-[8px] items-center justify-center"
        >
          <Text className="text-[16px] text-white font-bold leading-normal">
            Get Started
          </Text>
        </Pressable>
        <View className="flex-row space-X-[8px] justify-center items-center">
          <CheckBox
            checkedColor="#fff"
            className="border-[#fff] border-5 w-[28px] h-[28px] rounded-[5px]"
          />
          <Text className="text-[12px] w-[254px] h-[44px] leading-[22px] tracking-[-0.408px] text-start font-semibold text-[#AAAAAAAA]">
            This Podcast does not contain Explicit contents. You agree to our
            <Text className="text-[#fff]"> Terms</Text> and
            <Text className="text-[#fff]">Conditions</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default uploadPodcast;
