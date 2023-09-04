import { getDidPkhWithAddress } from '../../utils/did'
import S3UserAvatar from '../s3/S3UserAvatar'
import { UserAvatarProps } from '@us3r-network/profile'

export default function Avatar({
  address,
  ...otherProps
}: UserAvatarProps & { address: string }) {
  return <S3UserAvatar did={getDidPkhWithAddress(address)} {...otherProps} />
}
