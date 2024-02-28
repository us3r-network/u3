import { isMobile } from 'react-device-detect';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import ProfilePageNav from '../../components/profile/ProfilePageNav';
import { ProfileSocialPosts } from '../../components/profile/ProfileSocial';
import { LivepeerProvider } from '../../contexts/social/LivepeerCtx';
import {
  selectWebsite,
  setProfilePageFeedsType,
} from '../../features/shared/websiteSlice';
import { ProfileFeedsGroups } from '../../services/social/api/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ProfileOutletContext } from './ProfileLayout';

export default function Posts() {
  const { fid, lensProfileFirst } = useOutletContext<ProfileOutletContext>();
  const { profilePageFeedsType } = useAppSelector(selectWebsite);
  const dispatch = useAppDispatch();

  return (
    <div
      className="
      w-full
      h-full
      overflow-scroll
      box-border
      p-[24px]
      mb-[20px]"
      id="profile-wrapper"
    >
      <ProfilePageNav
        feedsType={profilePageFeedsType}
        enabledFeedsTypes={undefined}
        onChangeFeedsType={(type) => {
          dispatch(setProfilePageFeedsType(type));
        }}
      />
      <div
        className="mt-[20px]
                    flex
                    gap-[40px]"
      >
        <LivepeerProvider>
          <ProfileSocialPosts
            lensProfileId={lensProfileFirst?.id}
            fid={fid}
            group={profilePageFeedsType as unknown as ProfileFeedsGroups}
          />
        </LivepeerProvider>
      </div>
    </div>
  );
}
