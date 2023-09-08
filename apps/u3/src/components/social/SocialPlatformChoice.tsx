import { SocailPlatform } from '../../api';
import GridSvgUrl from '../common/icons/svgs/grid2.svg';
import LensIcon from '../icons/pngs/lens.png';
import FarcasterIcon from '../icons/pngs/farcaster.png';
import ListChoice from '../common/select/ListChoice';

const options = [
  {
    value: '',
    label: 'All Platform',
    iconUrl: GridSvgUrl,
  },
  {
    value: SocailPlatform.Lens,
    label: 'Lens',
    iconUrl: LensIcon,
  },
  {
    value: SocailPlatform.Farcaster,
    label: 'Farcaster',
    iconUrl: FarcasterIcon,
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
