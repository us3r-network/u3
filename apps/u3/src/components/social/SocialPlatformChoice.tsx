import { SocailPlatform } from '../../services/social/types';
import GridSvgUrl from '../common/assets/svgs/grid2.svg';
import LensIcon from '../common/assets/pngs/lens.png';
import FarcasterIcon from '../common/assets/pngs/farcaster.png';
import ListChoice from '../common/select/ListChoice';

const options = [
  {
    value: '',
    label: 'All Platform',
    iconUrl: GridSvgUrl,
  },
  {
    value: SocailPlatform.Farcaster,
    label: 'Farcaster',
    iconUrl: FarcasterIcon,
  },
  {
    value: SocailPlatform.Lens,
    label: 'Lens',
    iconUrl: LensIcon,
  },
];

export default function SocialPlatformChoice({
  platform,
  onChangePlatform,
}: {
  platform: SocailPlatform | '';
  onChangePlatform: (platform: SocailPlatform) => void;
}) {
  return (
    <ListChoice
      label="Platform"
      options={options}
      onChange={(value) => onChangePlatform(value)}
      value={platform || ''}
    />
  );
}
