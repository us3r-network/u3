import { SocialPlatform } from '../../services/social/types';
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
    value: SocialPlatform.Farcaster,
    label: 'Farcaster',
    iconUrl: FarcasterIcon,
  },
  {
    value: SocialPlatform.Lens,
    label: 'Lens',
    iconUrl: LensIcon,
  },
];

export default function SocialPlatformChoice({
  platform,
  onChangePlatform,
}: {
  platform: SocialPlatform | '';
  onChangePlatform: (platform: SocialPlatform) => void;
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
