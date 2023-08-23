import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableNativeFeedback,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { Community, MyLessons, Speakers } from "../../../components";
import { Link, router } from "expo-router";
import { useEnsName, useEnsAvatar } from "wagmi";
import { useAuth } from "../../../context/auth";
import { useAccount } from "../../../context/account";
import { collection, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { getAccount } from "@rly-network/mobile-sdk";

const Home = () => {
  const [wallet, setWallet] = useState("");
  const [allCommunities, setAllCommunity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    const user = auth.currentUser;
    setProfile(user);
    const fetchCommunity = async () => {
      const address = await getAccount();

      setWallet(address);
      setIsLoading(true);
      const q = query(collection(db, "community"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let communities = [];
        querySnapshot.forEach((doc) => {
          communities.push({ ...doc.data(), id: doc.id });
        });
        // console.log("tutor", communities);
        setAllCommunity(communities);
        setIsLoading(false);
      });
      return () => unsubscribe();
    };
    fetchCommunity();
  }, []);

  const { data: name } = useEnsName({
    address: wallet,
  });
  return (
    <ScrollView
      centerContent={true}
      contentContainerStyle={{ flex: 1, gap: 9 }}
      className="flex-1"
    >
      <StatusBar style="light" />
      <SafeAreaView className="bg-[#F70] w-full h-[311px] rounded-b-[50px]">
        <View contentContainerStyle={{ flex: 1 }}>
          <View className="flex-row items-center py-[20px] justify-between px-[24px] w-full">
            <View className="flex-row space-x-4 items-center">
              <Pressable onPress={() => router.push("/Profile")}>
                {profile && profile.photoURL ? (
                  <Image
                    source={{
                      uri: profile.photoURL,
                    }}
                    className="w-[50px] bg-gray-500/75 h-[50px] rounded-full"
                  />
                ) : (
                  <Image
                    source={{
                      uri: "https://images.pexels.com/photos/17729737/pexels-photo-17729737/free-photo-of-isabela-salvador.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                    }} // Provide a placeholder image path
                    className="w-[50px] bg-gray-500/75 h-[50px] rounded-full"
                  />
                )}
              </Pressable>
              <View>
                <Text
                  style={{
                    fontFamily: "SpaceMono",
                  }}
                  className="text-[24px] font-bold leading-normal text-[#fff]"
                >
                  Hi
                  <Text className="text-[#000]">
                    {" "}
                    {name ? name : profile ? profile.displayName : ""}
                  </Text>
                </Text>
                <Text className="text-[#fff]">
                  {" "}
                  {wallet.slice(0, 8)}... {wallet.slice(30, 48)}
                </Text>
              </View>
            </View>

            <Link href="/(auth)/CreateAccount" asChild>
              <TouchableNativeFeedback className="items-center">
                <BellIcon size={25} color="#fff" />
              </TouchableNativeFeedback>
            </Link>
          </View>
          <View className="bg-[#fff] w-[338px] h-[48px] rounded-[5px] border border-[#706C6C] flex-row px-[20px] items-center mx-[28px] justify-center ">
            <MagnifyingGlassIcon size={15} color="#000" />
            <TextInput
              placeholder="Search"
              className="border-none outline-none focus:outline-none bg-transparent w-full"
            />
          </View>

          {/** My Lesson Section */}
          <MyLessons />

          {/** Speakers */}

          <View className="mx-[28px] mt-[27px]">
            <Speakers />
          </View>

          <View className="mx-[28px] mt-[27px]">
            {isLoading ? (
              <ActivityIndicator color="#f70" size="large" />
            ) : (
              <Community item={allCommunities} />
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Home;