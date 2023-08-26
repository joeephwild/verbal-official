import { View, Text, Pressable, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getAccount } from "@rly-network/mobile-sdk";
import { register } from "../hooks/useContract";
// import { ethers } from "ethers";
// import { getWallet } from "@rly-network/mobile-sdk";
// import EnsRegsitar from "../constants/EnsRegsitar.json";
// import * as Crypto from "expo-crypto";

const mintProfile = () => {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  // const { register } = useContract();

  // const handleRegister = async () => {
  //   await register(name, account);
  //   Alert.alert("Done succesfully");
  // };

  useEffect(() => {
    const getWallet = async () => {
      const address = await getAccount();
      setAccount(address);
    };
    getWallet();
  });

  // const register = async (name, owner) => {
  //   const contract = connectWithContract(
  //     resolver,
  //     ABI
  //   );
  //   const isNameAvailable = await contract.available(name);
  //   if (!isNameAvailable) {
  //     return Alert.alert(`${name}.eth is not available`);
  //   }

  //   //generate a random secret
  //   const secret = "0x" + Crypto.getRandomBytes(32).toString("hex");
  //   console.log(`your secret is: ${secret}`);

  //   //make a commitment
  //   const commitment = await contract.makeCommitmentWithConfig(
  //     name,
  //     owner,
  //     secret,
  //     resolver,
  //     owner
  //   );
  //   const commit = await contract.commit(commitment);
  //   console.log(
  //     `Commitment pending: https://goerli.etherscan.io/tx/${commit.hash}`
  //   );
  //   await commit.wait();

  //   //wait for commitment to be confirmed
  //   const minCommmitmentAge = Number(await contract.minCommitmentAge());
  //   console.log(
  //     `Commitment successful, waiting ${minCommmitmentAge} seconds....`
  //   );

  //   //Get the price per name

  //   const priceWei = Number(await contract.rentPrice(name, durationToRegister));

  //   const priceInEth = priceWei / Number(ethers.constants.WeiPerEther);

  //   //Register a name
  //   const register = await contract.registerWithConfig(
  //     name,
  //     owner,
  //     durationToRegister,
  //     secret,
  //     resolver,
  //     owner,
  //     {
  //       value: priceWei,
  //     }
  //   );
  //   console.log(
  //     `submitting transaction - https://goerli.etherscan.io/tx/${register.hash}`
  //   );
  //   await register.wait();
  //   console.log(`
  //   ${name}.eth registered succesfully for ${priceInEth.toFixed(
  //     4
  //   )} Eth (not including gas)`);
  //   // const wallet = await getWallet()
  //   // console.log("wallet", wallet);
  // };
  return (
    <View style={{ flex: 1 }}>
      <View className="mx-[24px] pt-[26px]">
        <Pressable className="flex-row items-center space-x-9">
          <ChevronLeftIcon size={25} color="#fff" />
          <Text className="text-[#fff] font-bold text-[20px]">
            Mint UserName
          </Text>
        </Pressable>
        <View className="space-y-[9px] mt-[60px] items-start">
          <Text className="text-[34px] pb-4 font-bold text-[#fff] leading-normal">
            Mint An Ens Name
          </Text>
          <Text className="text-[16px] w-[342px] h-[69px] font-normal text-[#AAAAAAAA]">
            To tailor your experience and help you connect with fellow learners,
            set up your profile today. Let's get started on your learning
            journey!
          </Text>
        </View>
        <View className="mt-[30px] space-y-[24px]">
          <View>
            <Text className="text-[16px] font-bold text-[#ffff] leading-normal">
              Username
            </Text>
            <TextInput
              value={name}
              placeholder="Enter a unique name"
              onChangeText={(text) => setName(text)}
              placeholderTextColor="#fff"
              className="w-full border h-[56px] placeholder:text-[#ccccccaa] px-[24px] py-[16px] items-center justify-center rounded-[8px]  border-[#aaa]"
            />
          </View>
          <View>
            <Text className="text-[16px] font-bold text-[#ffff] leading-normal">
              Duration
            </Text>
            <TextInput
              placeholderTextColor="#fff"
              className="w-full border h-[56px] placeholder:text-[#ccccccaa] px-[24px] py-[16px] items-center justify-center rounded-[8px]  border-[#aaa]"
            />
          </View>
        </View>
        <Pressable
          style={{
            width: wp(90),
          }}
          onPress={() => register(name, account)}
          className="bg-[#F70] mt-[90px] mb-[24px] w-full py-[16px] rounded-[8px] items-center justify-center"
        >
          <Text className="text-[16px] text-white  font-bold leading-normal">
            Mint Name
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default mintProfile;
