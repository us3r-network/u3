import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  FARCASTER_ABI,
  FARCASTER_ADDRESS,
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../constants/farcaster-contract'
import * as ed from '@noble/ed25519'
import {
  EthersEip712Signer,
  NobleEd25519Signer,
  makeCastAdd,
  makeSignerAdd,
} from '@farcaster/hub-web'

export default function Home() {
  const [address, setAddress] = useState<string | null>(null)
  const [ethersProvider, setEthersProvider] =
    useState<ethers.BrowserProvider | null>(null)
  const [fid, setFid] = useState<number | null>(null)

  useEffect(() => {
    let provider: ethers.BrowserProvider
    if (!(window as any).ethereum) {
      console.log('No ethereum object on window')
      return
    }
    provider = new ethers.BrowserProvider((window as any).ethereum)
    setEthersProvider(provider)
    provider
      .send('eth_accounts', [])
      .then((accounts) => {
        setAddress(accounts[0])
        return getFid(provider, accounts[0])
      })
      .catch(console.error)
  }, [])

  const connectWallet = useCallback(async () => {
    if (!ethersProvider) {
      return
    }
    const accounts = await ethersProvider.send('eth_requestAccounts', [])
    setAddress(accounts[0])
  }, [ethersProvider])

  const makeCast = useCallback(async () => {
    if (!ethersProvider) return
    if (!fid) return

    const dataOptions = {
      fid: fid,
      network: FARCASTER_NETWORK,
    }
    const provider = ethersProvider
    const signer = await provider.getSigner()
    const eip712Signer = new EthersEip712Signer(signer)

    const signerPrivateKey = ed.utils.randomPrivateKey()
    const ed25519Signer = new NobleEd25519Signer(signerPrivateKey)
    const signerPublicKeyResult = await ed25519Signer.getSignerKey()

    if (signerPublicKeyResult.isErr()) {
      console.log(signerPublicKeyResult.error)
      return
    }
    // const signerPublicKey =
    const signerAddResult = await makeSignerAdd(
      { signer: signerPublicKeyResult._unsafeUnwrap() },
      dataOptions,
      eip712Signer,
    )
    const signerAdd = signerAddResult._unsafeUnwrap()

    const result = await FARCASTER_WEB_CLIENT.submitMessage(signerAdd)

    if (result.isErr()) {
      console.log(result.error)
      return
    }

    console.log('SignerAdd was published successfully!')

    const cast = await makeCastAdd(
      {
        text: 'This is a cast with no mentions',
        embeds: [],
        embedsDeprecated: [],
        mentions: [],
        mentionsPositions: [],
      },
      dataOptions,
      ed25519Signer,
    )
    if (cast.isErr()) {
      console.log(cast.error)
      return
    }
    cast.map((castAdd) => FARCASTER_WEB_CLIENT.submitMessage(castAdd))
  }, [ethersProvider, fid])

  const getFid = async (provider: ethers.ContractRunner, address: string) => {
    const farcasterContract = new ethers.Contract(
      FARCASTER_ADDRESS,
      FARCASTER_ABI,
      provider,
    )
    const fid: BigInt = await farcasterContract['idOf'](address)
    setFid(Number(fid))
  }

  return (
    <HomeWrapper>
      <h1>Home</h1>
      {(address && (
        <div>
          <div>{address}</div>

          {(fid && <div>{fid}</div>) || (
            <button onClick={() => getFid(ethersProvider!, address)}>
              getFid
            </button>
          )}
        </div>
      )) || (
        <div>
          <button onClick={connectWallet}>connectWallet</button>
        </div>
      )}
      {fid && (
        <div>
          <button onClick={makeCast}>makeCast</button>
        </div>
      )}
    </HomeWrapper>
  )
}

const HomeWrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 24px;
  box-sizing: border-box;
`
