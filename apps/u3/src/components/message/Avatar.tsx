import { UserAvatarProps } from '@us3r-network/profile';
import { getDidPkhWithAddress } from '../../utils/did';
import S3UserAvatar from './S3UserAvatar';

export default function Avatar({
  address,
  ...otherProps
}: UserAvatarProps & { address: string }) {
  return <S3UserAvatar did={getDidPkhWithAddress(address)} {...otherProps} />;
}
