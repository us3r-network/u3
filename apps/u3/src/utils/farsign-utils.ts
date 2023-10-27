/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ed from '@noble/ed25519';
import {
  NobleEd25519Signer,
  bytesToHexString,
  hexStringToBytes,
} from '@farcaster/hub-web';
import { FARCASTER_CLIENT_NAME } from '../constants/farcaster';

const { getPublicKeyAsync } = ed;

const generateKeyPair = async () => {
  const privateKey = ed.utils.randomPrivateKey();
  const publicKey = await ed.getPublicKeyAsync(privateKey);

  return {
    publicKey: Buffer.from(publicKey).toString('hex'),
    privateKey: Buffer.from(privateKey).toString('hex'),
  };
};

function getSigner(): NobleEd25519Signer {
  const privateKey =
    localStorage.getItem(`farsign-privateKey-${FARCASTER_CLIENT_NAME}`) || '';
  const ed25519Signer = new NobleEd25519Signer(Buffer.from(privateKey, 'hex'));
  return ed25519Signer;
}

function removeFarsignPrivateKey() {
  localStorage.removeItem(`farsign-privateKey-${FARCASTER_CLIENT_NAME}`);
}
function removeFarsignSigner() {
  localStorage.removeItem(`farsign-signer-${FARCASTER_CLIENT_NAME}`);
}

function setPrivateKey(privateKey: string) {
  localStorage.setItem(
    `farsign-privateKey-${FARCASTER_CLIENT_NAME}`,
    privateKey
  );
}

function getPrivateKey() {
  const privateKey = localStorage.getItem(
    `farsign-privateKey-${FARCASTER_CLIENT_NAME}`
  )!;
  return privateKey;
}

const getSignedKeyRequest = () => {
  return localStorage.getItem(`farsign-signer-${FARCASTER_CLIENT_NAME}`);
};

const setSignedKeyRequest = (data: any) => {
  localStorage.setItem(
    `farsign-signer-${FARCASTER_CLIENT_NAME}`,
    JSON.stringify(data)
  );
};
export {
  generateKeyPair,
  getPublicKeyAsync,
  bytesToHexString,
  hexStringToBytes,
  setSignedKeyRequest,
  getSignedKeyRequest,
  getSigner,
  setPrivateKey,
  getPrivateKey,
  removeFarsignPrivateKey,
  removeFarsignSigner,
};
