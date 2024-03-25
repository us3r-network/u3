import { usePrivy } from '@privy-io/react-auth';
import { Text, View } from 'react-native';
import UserInfo from '~/components/profile/user';
import { Button } from '~/components/ui/button';

export default function ProfileScreen() {
  const { login, ready, authenticated} = usePrivy();
  return (
    <View className="h-full mt-12 flex items-center justify-center">
      {ready && 
      (!authenticated ?
      <Button
        className="py-3 px-6 text-white rounded-lg"
        onPress={login}
      >
        Log in
      </Button>
      :
      <UserInfo />
      )}
    </View>
  );
}
