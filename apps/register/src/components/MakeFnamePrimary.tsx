import { useCallback } from "react";
import { useFarcaster } from "../providers/FarcasterProvider";
import { UserDataType, makeUserDataAdd } from "@farcaster/core";
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from "./client";
import { toast } from "sonner";

export default function MakeFnamePrimary() {
  const { fid, fname, signer, hasStorage } = useFarcaster();

  const makePrimaryName = useCallback(async () => {
    if (!fname || !signer || !fname || !hasStorage) return;
    try {
      // eslint-disable-next-line no-underscore-dangle
      const cast = (
        await makeUserDataAdd(
          {
            type: UserDataType.USERNAME,
            value: fname,
          },
          { fid: fid, network: FARCASTER_NETWORK },
          signer
        )
      )._unsafeUnwrap();
      const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
      if (result.isErr()) {
        throw new Error(result.error.message);
      }
      toast.success("successfully primary name to farcaster");
    } catch (error: unknown) {
      console.error(error);
      toast.error("failed to primary name");
    }
  }, [fid, fname, signer, hasStorage]);

  if (!fid || !fname || !signer || !hasStorage) return null;

  return (
    <button
      onClick={() => {
        makePrimaryName();
      }}
    >
      Make Primary Name
    </button>
  );
}
