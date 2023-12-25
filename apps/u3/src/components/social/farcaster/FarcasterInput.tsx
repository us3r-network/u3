/* eslint-disable react/no-unstable-nested-components */
import { EditorContent, useEditor } from '@mod-protocol/react-editor';
import { fetchUrlMetadata } from '@mod-protocol/core';

import {
  formatPlaintextToHubCastMessage,
  getFarcasterMentions,
  getMentionFidsByUsernames,
} from '@mod-protocol/farcaster';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { CastAddBody } from '@farcaster/hub-web';
import { createRenderMentionsSuggestionConfig } from './createRenderMentionsSuggestionConfig';

const MOD_API_URL = 'https://api.modprotocol.org/api';
const getMentions = getFarcasterMentions(MOD_API_URL);

// const getChannels = getFarcasterChannels(MOD_API_URL);
const getMentionFids = getMentionFidsByUsernames(MOD_API_URL);
const getUrlMetadata = fetchUrlMetadata(MOD_API_URL);

export default forwardRef(function FarcasterInput(
  {
    farcasterSubmit,
    textCb,
  }: {
    farcasterSubmit: (body: CastAddBody) => void;
    textCb: (text: string) => void;
  },
  ref
) {
  const { editor, handleSubmit, getText, getEmbeds, setEmbeds, addEmbed } =
    useEditor({
      fetchUrlMetadata: getUrlMetadata,
      onError: (error) => console.error(error),
      onSubmit: async (cast) => {
        const { text, embeds } = cast;
        const formattedCast = await formatPlaintextToHubCastMessage({
          text,
          embeds,
          parentUrl: undefined,
          getMentionFidsByUsernames: getMentionFids,
        });
        if (formattedCast) {
          farcasterSubmit(formattedCast);
        }
        return Promise.resolve(true);
      }, // submit to your hub
      linkClassName: 'text-[#2594ef]',
      renderMentionsSuggestionConfig: createRenderMentionsSuggestionConfig({
        getResults: getMentions,
      }),
    });

  useImperativeHandle(ref, () => ({
    handleFarcasterSubmit() {
      handleSubmit();
    },
  }));

  useEffect(() => {
    const text = getText();
    textCb(text);
  }, [getText]);

  return (
    <div>
      <EditorContent
        editor={editor}
        autoFocus
        className="w-full h-full text-white min-h-[200px]"
      />
    </div>
  );
});
