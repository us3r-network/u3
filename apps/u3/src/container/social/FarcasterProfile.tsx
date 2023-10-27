import { useOutletContext } from 'react-router-dom';
import BaseInfo from 'src/components/social/farcaster/signup/BaseInfo';

export default function FarcasterProfile() {
  const { fid, fname, signer, hasStorage } = useOutletContext<any>();

  if (!fid || !fname || !signer || !hasStorage) {
    return null;
  }
  return (
    <div>
      <BaseInfo
        fid={fid}
        signer={signer}
        hasStorage={hasStorage}
        fname={fname}
      />
    </div>
  );
}
