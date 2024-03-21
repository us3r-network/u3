import { View, Text } from 'react-native';

// import { Text, View } from '@/components/Themed';
import EditScreenInfo from '@/components/EditScreenInfo';

export default function ExploreScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Explore Page</Text>
      <View className="h-[1px] w-[80%] mt-8" />
      <EditScreenInfo path="app/(tabs)/explore.tsx" />
    </View>
  );
}
