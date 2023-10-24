import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import { getFarcasterCastInfo } from '../api/farcaster';
import { FarCast } from '../api';
import FCast from '../components/social/farcaster/FCast';
import { useFarcasterCtx } from '../contexts/FarcasterCtx';
import {
  PostDetailCommentsWrapper,
  PostDetailWrapper,
} from '../components/social/PostDetail';
import Loading from '../components/common/loading/Loading';
import FarcasterCommentForm from '../components/social/farcaster/FarcasterCommentForm';
import { scrollToAnchor } from '../utils/scrollToAnchor';

export default function FarcasterPostDetail() {
  const { castId } = useParams();
  const [loading, setLoading] = useState(true);
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
    }
  }, [castId]);

  useEffect(() => {
    setLoading(true);
    loadCastInfo().finally(() => {
      setLoading(false);
    });
  }, [loadCastInfo]);

  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }
  if (cast) {
    scrollToAnchor(window.location.hash.split('#')[1]);
    return (
      <DetailBox>
        <PostDetailWrapper isMobile={isMobile}>
          <FCast
            cast={cast}
            openFarcasterQR={openFarcasterQR}
            farcasterUserData={farcasterUserData}
            isDetail
          />
          <FarcasterCommentForm
            castId={{
              hash: Buffer.from(cast.hash.data),
              fid: Number(cast.fid),
            }}
            successAction={loadCastInfo}
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
                />
              );
            })}
          </PostDetailCommentsWrapper>
        </PostDetailWrapper>
      </DetailBox>
    );
  }
  return <LoadingWrapper />;
}

const DetailBox = styled.div`
  width: 600px;
`;

const LoadingWrapper = styled.div`
  width: 600px;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
