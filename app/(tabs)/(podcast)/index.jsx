import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/solid";
import { Podcast } from "../../../utils";
import { Link, router, useNavigation } from "expo-router";
import { Modalize } from "react-native-modalize";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Portal, PortalHost } from "@gorhom/portal";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase";
import { FlatList } from "react-native-gesture-handler";

const index = () => {
  const [podcast, setPodcast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tabs = [
    "Trending",
    "Latest",
    "Old",
    "Korean",
    "German",
    "Spanish",
    "English",
  ];

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const podcastRef = useRef(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const navigation = useNavigation(); // Get the navigation object

  const onOpen = (item) => {
    // Navigate to the PodcastDetails screen with the selected podcast data
    navigation.navigate("PodcastPlayer", { podcast: item });
  };

  const onClose = () => {
    setSelectedPodcast(null);
    podcastRef.current?.close();
  };

  useEffect(() => {
    const filterForTutor = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, "podcast"), orderBy("created_at"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let post = [];
          querySnapshot.forEach((doc) => {
            post.push({ ...doc.data(), id: doc.id });
          });
          console.log("podcast post", post);
          setPodcast(post);
          setIsLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };

    filterForTutor();
  }, []);

  return (
    <SafeAreaView>
      <View className="mx-[28px]">
        <Text className="text-[26px] font-bold text-[#fff] ml-9">Podcast</Text>
        <View className="mt-[16px] bg-[#252836] flex-row items-center h-[53px] px-4 py-2.5">
          <TextInput
            placeholderTextColor="#fff"
            placeholder="Search"
            style={{
              width: wp(70),
            }}
            className=" placeholder:text-white"
          />
          <MagnifyingGlassIcon size={24} color="#fff" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, marginTop: 16 }}
        >
          {tabs.map((item) => (
            <View className="bg-[#2F3142] px-4 py-2.5 rounded-full">
              <Text className="text-[#fff] font-normal text-[16px]">
                {item}
              </Text>
            </View>
          ))}
        </ScrollView>

        <FlatList
          data={podcast}
          renderItem={({ item }) => (
            <View className="flex-row flex-wrap gap-5 pt-4 ">
              <Link
                href={{
                  pathname: "PodcastPlayer",
                  params: {
                    image: item.podcast_img,
                    title: item.podcast_Title,
                    audio: item.podcast_audio_url,
                    name: item.created_by,
                  },
                }}
                asChild
              >
                <Pressable>
                  <Image
                    source={{
                      uri: item.podcast_img,
                    }}
                    className="w-[160px] h-[160px] object-cover"
                  />
                  <View className="w-[158px] mt-2 h-[43px]">
                    <Text className="text-[13px] font-bold text-[#fff]">
                      {item.podcast_Title}
                    </Text>
                    <Text className="text-[10px] font-medium text-[#CCCCCC]">
                      {item.created_by}
                    </Text>
                  </View>
                </Pressable>
              </Link>
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
      <Portal>
        <Modalize
          ref={podcastRef}
          modalStyle={{ backgroundColor: "#000" }}
          // snapPoint={snapPoints}
          HeaderComponent={() => (
            <View className="mt-[16px] px-[24px]">
              {/* Customize your header */}
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                Podcasts
              </Text>
              <Pressable
                onPress={() => onClose()}
                className="flex-row mt-5 items-center space-x-[12px]"
              >
                <ChevronLeftIcon size={25} color="#fff" />
                <Text className="text-[#fff] text-[20px] font-normal">
                  Now playing
                </Text>
              </Pressable>
            </View>
          )}
        >
          <View>
            {/* <Image style={{
              width: wp(80)
            }} source={{
              uri: selectedPodcast.image
            }} /> */}
          </View>
        </Modalize>
        <PortalHost name="CustomPortalHost" />
      </Portal>
    </SafeAreaView>
  );
};

export default index;
