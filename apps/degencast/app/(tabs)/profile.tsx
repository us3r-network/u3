import { usePrivy } from '@privy-io/react-auth';
import { Text, View } from 'react-native';
import { Button } from '~/components/ui/button';

export default function ProfileScreen() {
  const { login, } = usePrivy();
  return (
    <View className="h-full flex items-center justify-center">
      <Button
        className="py-3 px-6 text-white rounded-lg"
        onPress={login}
      >
        Log in
      </Button>
    </View>
  );
}
