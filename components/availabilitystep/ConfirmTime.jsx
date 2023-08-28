import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { CalendarIcon, ClockIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import { Input } from "react-native-elements";
import { TextInput } from "react-native";
import { createMeeting } from "../../utils/create-room";
import { scheduleASession } from "../../hooks/useContract";

const ConfirmTime = ({ selectedDate, time, handleClick }) => {
  const [mentor, setMentor] = useState("");
  const [question, setQuestion] = useState();
  const [price, setPrice] = useState();
  console.log(selectedDate);

  const handleTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);

    // Create a new Date object with today's date and the specified time
    const currentDate = new Date();
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    // Get the time value in milliseconds
    const timeInMilliseconds = currentDate.getTime();

    console.log(timeInMilliseconds); // Output: 1692057600000
    return timeInMilliseconds;
  };

  const handleScheduleSession = async () => {
    const meeting = await createMeeting();
    console.log(meeting);
    if (meeting) {
      scheduleASession(mentor, handleTime(time), meeting, price);
    }
  };
  return (
    <View className="mx-[24px] mt-[16px]">
      <Pressable
        onPress={() => router.back()}
        className="flex-row items-center space-x-4 "
      >
        <ChevronLeftIcon onPress={() => router.back()} color="#fff" size={25} />
        <Text className="text-[20px] font-semibold text-[#fff] leading-normal">
          Confirm your booking
        </Text>
      </Pressable>
      <View className="gap-[16px] mt-[24px] space-y-[16px]">
        <View className="flex-row items-center space-x-[16px]">
          <CalendarIcon color="#AAAAAAAA" size={25} />
          <Text className="text-[16px] font-normal leading-[22px] text-[#fff]">
            {selectedDate.dateString}
          </Text>
        </View>
        <View className="flex-row items-center space-x-[16px]">
          <ClockIcon color="#AAAAAAAA" size={25} />
          <Text className="text-[16px] font-normal leading-[22px] text-[#fff]">
            {handleTime(time)}
          </Text>
        </View>
      </View>
      {/** availablit form */}
      <View className="mt-[24px] space-y-[24px] w-full">
        <View className="items-start space-y-6">
          <Text className="text-[16px] font-normal leading-[22px] text-[#fff]">
            Mentor Address
          </Text>
          <TextInput
            value={mentor}
            onChangeText={(text) => setMentor(text)}
            placeholder="Enter Mentor address or Ens name"
            className="bg-[#000] text-[#fff] px-4 border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
          />
        </View>
        <View className="items-start space-y-6">
          <Text className="text-[16px] font-normal leading-[22px] text-[#fff]">
            Price
          </Text>
          <TextInput
            value={price}
            onChangeText={(text) => setPrice(text)}
            placeholder="Enter price you wanna pays"
            placeholderTextColor="#fff"
            className="bg-[#000] text-[#fff] px-4 border-2 border-[#ccca] w-[358px] h-[48px] rounded-[5px]"
          />
        </View>
        <View className="items-start space-y-4">
          <Text className="text-[16px] font-normal leading-[22px] text-[#fff]">
            Add your question to this booking
          </Text>
          <TextInput
            value={question}
            onChangeText={(text) => setQuestion(text)}
            placeholder="Enter Mentor address or Ens name"
            className="bg-[#000] text-[#fff] px-4 border-2 border-[#ccca] w-[358px] h-[108px] rounded-[5px]"
            multiline
          />
        </View>
      </View>
      <Pressable
        onPress={handleScheduleSession}
        className="bg-[#F70] w-full mt-[127px]  py-[16px] rounded-[8px] items-center justify-center"
      >
        <Text className="text-[16px] text-white font-bold leading-normal">
          Continue
        </Text>
      </Pressable>
    </View>
  );
};

export default ConfirmTime;
