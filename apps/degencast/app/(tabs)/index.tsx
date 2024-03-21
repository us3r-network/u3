import { StyleSheet, View, Text } from 'react-native';

// import { Text, View } from '@/components/Themed';
import EditScreenInfo from '@/components/EditScreenInfo';
import { verifyInstallation } from 'nativewind';

export default function ExploreScreen() {
  // Ensure to call inside a component, not globally
  // verifyInstallation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Page</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="app/(tabs)/explore.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
