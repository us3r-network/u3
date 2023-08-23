import * as ed from '@noble/ed25519'
import { bytesToHexString, hexStringToBytes } from '@farcaster/hub-web'
import {
  FARCASTER_CLIENT_NAME,
  WARPCAST_AUTH_URL,
} from '../constants/farcaster'

type keyGeneration = {
  publicKey: Uint8Array
  privateKey: Uint8Array
}

type weirdResult = {
  token: string
  deepLinkUrl: string
}

// type signerRequestResult = {
//   fid: string,
//   base64SignedMessage: string
// }

const getPublicKeyAsync = ed.getPublicKeyAsync

const generateKeyPair = async (): Promise<keyGeneration> => {
  const privateKey = ed.utils.randomPrivateKey()
  const publicKey = await ed.getPublicKeyAsync(privateKey)
  return { publicKey, privateKey }
}

// extract key from keygen
const sendPublicKey = async (
  publicKey: Uint8Array,
  name: string,
): Promise<weirdResult> => {
  const convertedKey = bytesToHexString(publicKey)._unsafeUnwrap()

  const response = await fetch(WARPCAST_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicKey: convertedKey, name: name }),
  })

  const { deepLinkUrl, token }: weirdResult = (await response.json()).result

  return { deepLinkUrl, token }
}

const requestSignerAuthStatus = async (token: string) => {
  return await (
    await fetch(`${WARPCAST_AUTH_URL}?token=${token}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()
}

const getCurrFid = () => {
  const request = JSON.parse(
    localStorage.getItem('farsign-signer-' + FARCASTER_CLIENT_NAME)!,
  ).signerRequest
  return Number(request.fid)
}

export {
  generateKeyPair,
  sendPublicKey,
  requestSignerAuthStatus,
  getPublicKeyAsync,
  bytesToHexString,
  hexStringToBytes,
  getCurrFid,
}
