import { SocialPlatform } from '../../services/social/types';
import { FeedsType } from '../../components/social/SocialPageNav';

export const getSocialScrollWrapperId = (
  feedsType: FeedsType,
  socialPlatform: SocialPlatform | ''
): string => {
  return `social-${feedsType}-${socialPlatform || 'all'}`;
};
