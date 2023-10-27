import styled from 'styled-components';

import {
  GalxeData,
  NooxData,
  PoapData,
} from '../../../services/profile/types/profile';
import Galxe from './Galxe';
import Noox from './Noox';
import Poap from './Poap';

export default function Credential({
  galxe,
  poap,
  noox,
}: {
  galxe: GalxeData;
  poap: Array<PoapData>;
  noox: NooxData;
}) {
  return (
    <>
      <ContentBox id="profile-content-box">
        <Poap data={poap} />
        <Galxe data={galxe} />
        <Noox data={noox} />
      </ContentBox>
      <div className="placeholder" />
    </>
  );
}

const ContentBox = styled.div`
  display: flex;
  gap: 0px;
  flex-direction: column;
`;

export function CredentialMobile({
  galxe,
  poap,
  noox,
}: {
  galxe: GalxeData;
  poap: Array<PoapData>;
  noox: NooxData;
}) {
  return (
    <>
      <ContentBoxMobile id="profile-content-box">
        <Poap data={poap} />
        <Galxe data={galxe} />
        <Noox data={noox} />
      </ContentBoxMobile>
      <div className="placeholder" />
    </>
  );
}

const ContentBoxMobile = styled(ContentBox)`
  padding-bottom: 45px;
  & > div {
    background: transparent;
    margin-top: 20px;
    padding: 0;
  }

  & > div:first-of-type {
    margin-top: 0;
  }

  .expand-box {
    display: none;
  }

  .card-box {
    width: calc((100% - 20px * 2) / 3);
  }
`;
