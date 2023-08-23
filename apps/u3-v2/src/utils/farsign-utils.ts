import * as ed from '@noble/ed25519'
import { bytesToHexString, hexStringToBytes } from '@farcaster/hub-web'
import { FARCASTER_CLIENT_NAME } from '../constants/farcaster'

type keyGeneration = {
  publicKey: Uint8Array
  privateKey: Uint8Array
}

const getPublicKeyAsync = ed.getPublicKeyAsync

const generateKeyPair = async (): Promise<keyGeneration> => {
  const privateKey = ed.utils.randomPrivateKey()
  const publicKey = await ed.getPublicKeyAsync(privateKey)
  return { publicKey, privateKey }
}

const getCurrFid = () => {
  const request = JSON.parse(
    localStorage.getItem('farsign-signer-' + FARCASTER_CLIENT_NAME)!,
  ).signerRequest
  return Number(request.fid)
}

export {
  generateKeyPair,
  getPublicKeyAsync,
  bytesToHexString,
  hexStringToBytes,
  getCurrFid,
}
