import styled from "styled-components";
import { useFarcaster } from "../providers/FarcasterProvider";
import { useCallback, useState } from "react";
import { makeCastAdd } from "@farcaster/core";
import { toast } from "sonner";
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from "./client";

export default function MakeCast() {
  const { fid, signer, hasStorage } = useFarcaster();
  const [text, setText] = useState("");
  const makeCast = useCallback(async () => {
    if (!text || !signer) return;
    try {
      // eslint-disable-next-line no-underscore-dangle
      const cast = (
        await makeCastAdd(
          {
            text,
            embeds: [],
            embedsDeprecated: [],
            mentions: [],
            mentionsPositions: [],
          },
          { fid: fid, network: FARCASTER_NETWORK },
          signer
        )
      )._unsafeUnwrap();
      const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
      if (result.isErr()) {
        throw new Error(result.error.message);
      }
      toast.success("successfully posted to farcaster");
    } catch (error: unknown) {
      console.error(error);
      toast.error("failed to post to farcaster");
    }
  }, [fid, signer, text]);

  if (!fid || !signer || !hasStorage) return null;

  return (
    <Container>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button
        onClick={() => {
          makeCast();
        }}
      >
        cast
      </button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  button {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;

    background: none;
    outline: none;
    border: none;
    cursor: pointer;
    border: 1px solid #39424c;
    border-radius: 12px;
    padding: 10px;
  }

  input {
    flex-grow: 1;
    background: #1a1e23;
    outline: none;
    border: 1px solid #39424c;
    border-radius: 12px;
    height: 48px;
    padding: 0px 16px;
    color: #ffffff;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }
`;
