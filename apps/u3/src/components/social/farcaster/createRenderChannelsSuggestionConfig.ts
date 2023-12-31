/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

import tippy from 'tippy.js';
import { ReactRenderer } from '@tiptap/react';
import { Channel } from '@mod-protocol/farcaster';
import { ChannelList } from './ChannelList';

type MentionListRef = {
  onKeyDown: (props: { event: Event }) => boolean;
};

export const createRenderChannelsSuggestionConfig = ({
  getResults,
}: {
  getResults: (query: string) => Promise<Array<Channel | null>>;
}) => ({
  suggestion: {
    items: async ({
      query,
    }: {
      query: string;
    }): Promise<Array<Channel | null>> => {
      const data = await getResults(query);

      if (!data?.length) {
        // Hacky, but results UI library needs an item to render
        return [null];
      }

      return data as any;
    },

    render: () => {
      let reactRenderer: ReactRenderer<MentionListRef>;
      let popup: any;

      return {
        onStart: (props: any) => {
          reactRenderer = new ReactRenderer(ChannelList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: reactRenderer.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props: any) {
          reactRenderer?.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup[0].hide();

            return true;
          }

          return reactRenderer?.ref?.onKeyDown(props) || false;
        },

        onExit() {
          popup?.[0]?.destroy();
          reactRenderer?.destroy();
        },
      };
    },
  },
});
