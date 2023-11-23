import { PropsWithChildren, useMemo } from 'react';
import {
  createReactClient,
  LivepeerConfig,
  studioProvider,
} from '@livepeer/react';

export function LivepeerProvider({ children }: PropsWithChildren) {
  const livepeerClient = useMemo(
    () =>
      createReactClient({
        provider: studioProvider({ apiKey: '' }),
      }),
    []
  );
  return <LivepeerConfig client={livepeerClient}>{children}</LivepeerConfig>;
}
