import { useFavorAction } from '@us3r-network/link';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useCallback, useEffect, useState } from 'react';
import { Link } from '@us3r-network/data-model';
import {
  getSavedCasts,
  setSavedCastsSynced,
} from '@/services/social/api/farcaster';
import { getAddressWithDidPkh } from '../../utils/shared/did';

export default function SyncingBotSaves({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const session = useSession();
  const [saves, setSaves] = useState([]);
  const [link, setLink] = useState(null);

  useEffect(() => {
    const walletAddress = getAddressWithDidPkh(session.id);
    getSavedCasts(walletAddress).then((res) => {
      setSaves(res);
      console.log('getSavedCasts', res);
    });
  }, [session]);

  useEffect(() => {
    if (!saves || saves.length === 0) return;
    syncNext();
  }, [saves.length]);

  const syncNext = useCallback(() => {
    if (!saves || saves.length === 0) return;
    const save = saves[0];
    const nextLink = {
      url: `https://u3.xyz/social/post-detail/fcast/${Buffer.from(
        save.castHash.data
      ).toString('hex')}`,
      title: save.text || 'Saved Farcaster Cast using U3 Bot',
      type: 'link',
      data: JSON.stringify(save),
    };
    console.log('cast', nextLink);
    setLink(nextLink);
  }, [saves]);

  return link ? (
    <FavoringLink
      link={link}
      onSuccessfullyFavor={(isFavored: boolean, linkId: string) => {
        console.log('onSuccessfullyFavor', isFavored, linkId);
        if (isFavored) {
          const linkData = JSON.parse(link.data);
          const { id, walletAddress } = linkData;
          console.log(id, walletAddress);
          setSavedCastsSynced(Buffer.from(walletAddress).toString('hex'), id);
          const newSaves = saves.slice(1);
          setSaves(newSaves);
          if (newSaves.length === 0) onComplete();
        }
      }}
      onFailedFavor={(errMsg: string) => {
        console.log('onFailedFavor', errMsg);
      }}
    />
  ) : null;
}

function FavoringLink({
  link,
  onSuccessfullyFavor,
  onFailedFavor,
}: {
  link?: Link | undefined;
  onSuccessfullyFavor?: (isFavored: boolean, linkId: string) => void;
  onFailedFavor?: (errMsg: string) => void;
}) {
  // console.log('FavoringLink', link);
  const { isFavored, isFavoring, onFavor } = useFavorAction('', link, {
    onSuccessfullyFavor: (done: boolean, newLinkId: string) => {
      // console.log('onSuccessfullyFavor in FavoringLink', done, newLinkId);
      onSuccessfullyFavor(done, newLinkId);
    },
    onFailedFavor: (err: string) => {
      // console.log('onFailedFavor in FavoringLink', err);
      onFailedFavor(err);
    },
  });
  useEffect(() => {
    console.log('link: ', link, isFavored);
    if (link)
      setTimeout(() => {
        console.log('onFavor fire!');
        if (!isFavored && !isFavoring) onFavor();
      }, 500);
  }, [link]);

  if (isFavoring)
    return (
      <div className="text-[white]">{`Favoring Bot Saved Link '${link.title}' ......`}</div>
    );
  if (isFavored)
    return (
      <div className="text-[white]">{`Favored Bot Saved Link '${link.title}' ......`}</div>
    );
  // return (
  //   <div>
  //     <p>{link?.title}</p>
  //     <p>{link?.url}</p>
  //     <p>{link?.type}</p>
  //     <button type="button" onClick={onFavor}>
  //       Favoring Bot Save
  //     </button>
  //   </div>
  // );
}
