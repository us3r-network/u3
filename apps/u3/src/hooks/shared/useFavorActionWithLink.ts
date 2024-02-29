import { Link } from '@us3r-network/data-model';
import { getS3LinkModel, useLinkState } from '@us3r-network/link';
import { useCallback, useState } from 'react';
import {
  useAuthentication,
  useSession,
} from '@us3r-network/auth-with-rainbowkit';
import { useFetchLinkIdWithLink } from './useFetchLinkId';

export function useFavorActionWithLink(
  link: Link | undefined,
  opts?: {
    onSuccessfullyFavor?: (isFavored: boolean, linkId: string) => void;
    onFailedFavor?: (errMsg: string) => void;
  }
) {
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();
  const { fetchLinkIdWithLink } = useFetchLinkIdWithLink();
  const [isFavored, setIsFavored] = useState(false);
  const [isFavoring, setIsFavoring] = useState(false);

  const onFavor = useCallback(async () => {
    if (!session || !s3LinkModalAuthed) {
      signIn();
      return;
    }
    if (!s3LinkModel) return;
    try {
      setIsFavoring(true);
      // create link if not exist
      let linkId = await fetchLinkIdWithLink(link);

      if (!linkId && link && link.url && link.type) {
        const unknownLink = await s3LinkModel?.fetchLink(link);
        if (unknownLink && unknownLink?.id) {
          linkId = unknownLink?.id;
        } else {
          throw new Error('fail to fetch linkId');
        }
      }
      // find curr user favor
      const favorsRes = await s3LinkModel.queryLinkFavors({ linkId });
      if (favorsRes?.errors && favorsRes?.errors.length > 0) {
        throw new Error(favorsRes?.errors[0]?.message);
      }
      const data = favorsRes.data?.node;
      const favors =
        data?.favors?.edges
          ?.map((edge) => edge?.node)
          ?.filter((node) => !!node) || [];
      const findCurrUserFavor = favors.find(
        (node) => node?.creator?.id === session?.id
      );
      if (findCurrUserFavor) {
        // update favor
        const { id } = findCurrUserFavor;
        // const revoke = !findCurrUserFavor.revoke;
        const revoke = false;
        const updateFavorRes = await s3LinkModel?.updateFavor(id, { revoke });

        if (updateFavorRes?.errors && updateFavorRes?.errors.length > 0) {
          throw new Error(updateFavorRes?.errors[0]?.message);
        }
        setIsFavored(!revoke);
        if (opts?.onSuccessfullyFavor)
          opts.onSuccessfullyFavor(!revoke, linkId);
      } else {
        // create favor
        // console.log('start favor', linkId)
        const res = await s3LinkModel?.createFavor({
          linkID: linkId,
          revoke: false,
        });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        setIsFavored(true);
        if (opts?.onSuccessfullyFavor) opts.onSuccessfullyFavor(true, linkId);
      }
    } catch (error) {
      const errMsg = error?.message;
      if (opts?.onFailedFavor) opts.onFailedFavor(errMsg);
    } finally {
      setIsFavoring(false);
    }
  }, [
    session,
    link?.url,
    link?.type,
    fetchLinkIdWithLink,
    s3LinkModalAuthed,
    signIn,
    opts?.onSuccessfullyFavor,
    opts?.onFailedFavor,
  ]);

  return { isFavored, isFavoring, onFavor };
}
