import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeftIcon,
  ChevronUpDownIcon,
  PhotoIcon,
} from "react-native-heroicons/solid";
import { CheckBox } from "react-native-elements";
import { router } from "expo-router";
import { pickImage, uploadJson } from "../../../lib/services/userService";
import { uploadAPodcast } from "../../../hooks/useContract";
import { SelectList } from "react-native-dropdown-select-list";
import { ethers } from "ethers";

const uploadPodcast = () => {
  const [image, setImage] = useState(""); // State for the image
  const [podcastTitle, setPodcastTitle] = useState(""); // State for the Podcast Title
  const [podcastUrl, setPodcastUrl] = useState(""); // State for the Podcast URL
  const [price, setPrice] = useState(); // State for the Thumbnail
  const [podcast, setPodcast] = useState(""); // State for the Podcast
  const [category, setCategory] = useState(""); // State for the Category

  const accountType = [
    { key: "1", value: "Korean" },
    { key: "2", value: "Spanish" },
    { key: "3", value: "German" },
    { key: "4", value: "Hindu" },
    { key: "5", value: "Chinese" },
    { key: "6", value: "Yoruba" },
  ];

  const handleImageUpload = async () => {
    try {
      const result = await pickImage();
      let url = `https://gateway.pinata.cloud/ipfs/${result}`;
      setImage(url);
    } catch (error) {
      // Handle any upload errors here
      console.error("Upload failed:", error);
    }
  };

  const handleUpload = async () => {
    if (
      !image ||
      !image.includes("https://") ||
      !podcastTitle ||
      !podcastUrl ||
      !price
    )
      return Alert.alert("Fill up required fields");

    const object = {
      podcast_img: image,
      podcast_Title: podcastTitle,
      podcast_url: podcastUrl,
      podcast_price: price,
      podcast_cate: category,
    };

    try {
      const hash = await uploadJson(object);
      if (hash) {
        const result = await uploadAPodcast(
          hash,
          price
        );
        if (result) {
          console.log("Successful contract call");
          // Handle success
        } else {
          console.error("Failed contract call");
          // Handle failure
        }
      }
    } catch (error) {
      console.error("Error uploading podcast:", error.message);
      // Handle error
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <View className="space-y-[16px] mt-[98px]">
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
              value={podcastTitle}
              onChangeText={(text) => setPodcastTitle(text)}
              placeholder="Korean Alphabets(Hangul)"
              placeholderTextColor="#fff"
              className="bg-[#000] text-[#fff] px-4 border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
            />
          </View>
          <View className="space-y-[8px] items-start">
            <Text className="text-[16px] text-start font-semibold text-[#fff]">
              Podcast Url
            </Text>
            <TextInput
              value={podcastUrl}
              onChangeText={(text) => setPodcastUrl(text)}
              placeholder="Enter valid url"
              placeholderTextColor="#fff"
              className="bg-[#000] text-[#fff] px-4 border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
            />
          </View>
          <View className="space-y-[8px] items-start">
            <Text className="text-[16px] text-start font-semibold text-[#fff]">
              Price
            </Text>
            <TextInput
              value={price}
              onChangeText={(text) => setPrice(text)}
              placeholder="Enter price in Ethers e.g 2.0"
              inputMode="decimal"
              placeholderTextColor="#fff"
              className="bg-[#000] text-[#fff] px-4 border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
            />
          </View>
          <View className="space-y-[8px] items-start">
            <Text className="text-[16px] text-start font-semibold text-[#fff]">
              Category
            </Text>
            <SelectList
              setSelected={(val) => setCategory(val)}
              data={accountType}
              save="value"
              // boxStyles={{
              //   width: "66%",
              // }}
              dropdownItemStyles={{
                borderColor: "#AAAAAAAA",
                backgroundColor: "#000",
                marginTop: 8,
              }}
              search={false}
              arrowicon={<ChevronUpDownIcon size={25} color="#fff" />}
              dropdownTextStyles={{ color: "#fff" }}
              inputStyles={{ color: "#fff" }}
              placeholder="Select a Podcast Category"
            />
          </View>
        </View>
        <Pressable
          onPress={handleUpload}
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
