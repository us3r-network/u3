const DID_PREFIX = 'did:pkh:eip155:1:';
export const isDidPkh = (str: string) => {
  return str.startsWith(DID_PREFIX);
};
export const getDidPkhWithAddress = (address: string) => {
  return `${DID_PREFIX}${address?.toLowerCase() || '0x'}`;
};
export const getAddressWithDidPkh = (didPkh: string) => {
  return didPkh.replace(DID_PREFIX, '');
};
