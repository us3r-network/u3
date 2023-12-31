import { UserName, UserNameProps } from '@us3r-network/profile';
import { getDidPkhWithAddress } from '../../utils/shared/did';

export default function Name({
  address,
  ...otherProps
}: UserNameProps & { address: string }) {
  return <UserName did={getDidPkhWithAddress(address)} {...otherProps} />;
}
