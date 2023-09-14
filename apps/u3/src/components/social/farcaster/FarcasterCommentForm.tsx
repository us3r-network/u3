/* eslint-disable no-underscore-dangle */
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { CastId, makeCastAdd } from '@farcaster/hub-web';
import styled from 'styled-components';

import ReplyForm from '../ReplyForm';
import useLogin from '../../../hooks/useLogin';
import { useFarcasterCtx } from '../../../contexts/FarcasterCtx';
import { getCurrFid } from '../../../utils/farsign-utils';
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../../constants/farcaster';

export default function FarcasterCommentForm({ castId }: { castId: CastId }) {
  const { isLogin: isLoginU3, login } = useLogin();
  const [content, setContent] = useState('');
  const { currUserInfo, openFarcasterQR, isConnected, encryptedSigner } =
    useFarcasterCtx();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!isLoginU3) {
      login();
      return;
    }
    if (!isConnected || !encryptedSigner) {
      openFarcasterQR();
      return;
    }
    if (!content) {
      toast.warn('Please input comment content.');
      return;
    }
    const currFid = getCurrFid();
    setIsPending(true);
    try {
      const cast = (
        await makeCastAdd(
          {
            text: content,
            embeds: [],
            embedsDeprecated: [],
            mentions: [],
            mentionsPositions: [],
            parentCastId: castId,
          },
          { fid: currFid, network: FARCASTER_NETWORK },
          encryptedSigner
        )
      )._unsafeUnwrap();
      const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
      if (result.isErr()) {
        throw new Error(result.error.message);
      }
      toast.success('post created');
    } catch (error) {
      console.error(error);
      toast.error('error creating post');
    } finally {
      setIsPending(false);
    }
  }, [castId, content, isConnected, isLoginU3, login, openFarcasterQR]);

  const avatar = useMemo(() => {
    if (currUserInfo) {
      const fid = Object.keys(currUserInfo)[0];
      const userInfo = currUserInfo[fid];
      const avatarInfo = userInfo.find((item) => item.type === 1);
      if (avatarInfo) {
        return avatarInfo.value;
      }
    }
    return '';
  }, [currUserInfo]);

  return (
    <Form
      onClick={() => {}}
      avatar={avatar}
      content={content}
      setContent={setContent}
      submitting={isPending}
      onSubmit={onSubmit}
    />
  );
}

const Form = styled(ReplyForm)`
  border-top: 1px solid #39424c;
  background: #14171a;
`;
