import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getFarcasterCastInfo } from '../api/farcaster';
import { FarCast } from '../api';
import FCast from '../components/social/farcaster/FCast';
import { useFarcasterCtx } from '../contexts/FarcasterCtx';
import GoBack from '../components/GoBack';
import {
  PostDetailCommentsWrapper,
  PostDetailWrapper,
} from '../components/social/PostDetail';
import Loading from '../components/common/loading/Loading';

export default function FarcasterPostDetail() {
  const { castId } = useParams();
  const [loading, setLoading] = useState(false);
  const [cast, setCast] = useState<FarCast>();
  const { openFarcasterQR } = useFarcasterCtx();
  const [comments, setComments] =
    useState<{ data: FarCast; platform: 'farcaster' }[]>();
  const [farcasterUserData, setFarcasterUserData] = useState<{
    [key: string]: { type: number; value: string }[];
  }>({});

  const loadCastInfo = useCallback(async () => {
    if (!castId) return;
    try {
      setLoading(true);
      const resp = await getFarcasterCastInfo(castId, {});
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const {
        farcasterUserData: farcasterUserDataTmp,
        cast: castTmp,
        comments: commentsTmp,
      } = resp.data.data;
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      farcasterUserDataTmp.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      setCast(castTmp);
      setFarcasterUserData((pre) => ({ ...pre, ...temp }));
      setComments(commentsTmp);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [castId]);

  useEffect(() => {
    loadCastInfo();
  }, [loadCastInfo]);

  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }
  if (cast) {
    return (
      <DetailBox>
        <GoBack />
        <PostDetailWrapper>
          <FCast
            cast={cast}
            openFarcasterQR={openFarcasterQR}
            farcasterUserData={farcasterUserData}
            openImgModal={(url) => {}}
          />
          <PostDetailCommentsWrapper>
            {(comments || []).map((item) => {
              const key = Buffer.from(item.data.hash.data).toString('hex');
              return (
                <FCast
                  key={key}
                  cast={item.data}
                  openFarcasterQR={openFarcasterQR}
                  farcasterUserData={farcasterUserData}
                  openImgModal={(url) => {}}
                />
              );
            })}
          </PostDetailCommentsWrapper>
        </PostDetailWrapper>
      </DetailBox>
    );
  }
  return null;
}

const DetailBox = styled.div`
  padding: 24px;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
