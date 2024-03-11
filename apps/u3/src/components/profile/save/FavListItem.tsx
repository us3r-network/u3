import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultFormatFromNow } from '../../../utils/shared/time';
import LinkBox from '../../news/contents/LinkBox';
import FCast from '@/components/social/farcaster/FCast';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { getFarcasterCastInfo } from '@/services/social/api/farcaster';
import { FarCast } from '@/services/social/types';
import { userDataObjFromArr } from '@/utils/social/farcaster/user-data';
import { getExploreFcPostDetailPath } from '@/route/path';

export type FavListItemData = {
  id: string;
  url?: string;
  title?: string;
  type: string;
  data: string;
  logo?: string;
  createAt?: string;
};

export type FavListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: FavListItemData;
};

export function FavListLinkItem({ data, ...props }: FavListItemProps) {
  return (
    <div className="flex flex-col gap-4 pt-4 pb-4" {...props}>
      <IconLink text={data.url} logo={data?.logo} className="iconLink" />
      <p className="flex-[1] font-medium text-[16px] leading-[20px] text-white line-clamp-4 max-sm:line-clamp-1">
        {data.title || data.url}
      </p>
      {!!data?.createAt && (
        <p className="text-white">{defaultFormatFromNow(data.createAt)}</p>
      )}
    </div>
  );
}

export function FavListPostItem({ data, ...props }: FavListItemProps) {
  const navigate = useNavigate();
  console.log('FavListPostItem', JSON.parse(data.data || ''));
  const { openFarcasterQR } = useFarcasterCtx();
  const [cast, setCast] = useState<FarCast>();
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const castData = JSON.parse(data.data);
  const castHex = Buffer.from(castData.hash).toString('hex');
  useEffect(() => {
    if (castHex)
      getFarcasterCastInfo(castHex, {}).then((res) => {
        console.log('getFarcasterCastInfo', res);
        if (res.data.code !== 0) {
          throw new Error(res.data.msg);
        }
        const { farcasterUserData: farcasterUserDataTemp, cast: castTemp } =
          res.data.data;
        setCast(castTemp);
        setFarcasterUserDataObj(userDataObjFromArr(farcasterUserDataTemp));
      });
  }, [castHex]);
  if (cast) {
    return (
      <FCast
        {...props}
        cast={cast}
        disableRenderUrl
        simpleLayout
        openFarcasterQR={openFarcasterQR}
        farcasterUserData={{}}
        farcasterUserDataObj={farcasterUserDataObj}
        isV2Layout
        castClickAction={() => {
          console.log('castClickAction');
          navigate(getExploreFcPostDetailPath(castHex));
        }}
      />
    );
  }
  return null;
}

const IconLink = styled(LinkBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
  gap: 6px;
  background: #14171a;
  border-radius: 100px;

  img {
    width: 20px;
    height: 20px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #718096;
  }
`;
