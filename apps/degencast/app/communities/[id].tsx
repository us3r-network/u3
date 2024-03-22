import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

const tabs = ["About", "Qualifications", "Responsibilities"];

export default function CommunityDetail() {
  const params = useLocalSearchParams();
  const { id } = params;
  console.log(params);

  const router = useRouter();

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {}, []);

  const displayTabContent = () => {
    switch (activeTab) {
      default:
        return "detail";
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerStyle: {},
          headerShadowVisible: false,
          headerBackVisible: false,

          headerTitle: "detail",
        }}
      />

      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        ></ScrollView>
      </>
    </SafeAreaView>
  );
}
