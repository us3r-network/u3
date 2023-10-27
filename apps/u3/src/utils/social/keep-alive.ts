import { SocailPlatform } from '../../services/social/types';
import { FeedsType } from '../../components/social/SocialPageNav';

export const getSocialScrollWrapperId = (
  feedsType: FeedsType,
  socialPlatform: SocailPlatform | ''
): string => {
  return `social-${feedsType}-${socialPlatform || 'all'}`;
};
