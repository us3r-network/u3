export const getDidPkhWithAddress = (address: string) => {
  return `did:pkh:eip155:1:${address || '0x'}`;
};
