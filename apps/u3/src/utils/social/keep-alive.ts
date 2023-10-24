import { SocailPlatform } from '../../api';
import { FeedsType } from '../../components/social/SocialPageNav';

export const getSocialScrollWrapperId = (
  feedsType: FeedsType,
  socialPlatform: SocailPlatform | ''
): string => {
  return `social-${feedsType}-${socialPlatform || 'all'}`;
};
