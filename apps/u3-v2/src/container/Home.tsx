import { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  useFarcasterGetCastsByFid,
  useFarcasterMakeCast,
} from '../hooks/useFarcaster'
import { getFid } from '../utils/farcaster'
import { useEthers } from '../hooks/useEthers'

export default function Home() {
  const [address, setAddress] = useState<string>()
  const [fid, setFid] = useState<number>()

  const { ethersProvider, connectWallet } = useEthers()
  const { makeCast } = useFarcasterMakeCast({ ethersProvider, fid })
  const { getCastsByFid } = useFarcasterGetCastsByFid()

  useEffect(() => {
    if (!ethersProvider) return
    ethersProvider
      .send('eth_accounts', [])
      .then((accounts) => {
        setAddress(accounts[0])
        return getFid(ethersProvider, accounts[0])
      })
      .then(setFid)
      .catch(console.error)
  }, [ethersProvider])

  return (
    <HomeWrapper>
      <h1>Home</h1>
      {(address && (
        <div>
          <div>{address}</div>

          {(fid && <div>{fid}</div>) || (
            <button
              onClick={async () => {
                const fid = await getFid(ethersProvider!, address)
                setFid(fid)
              }}
            >
              getFid
            </button>
          )}
        </div>
      )) || (
        <div>
          <button
            onClick={async () => {
              const accounts = await connectWallet()
              setAddress(accounts[0])
            }}
          >
            connectWallet
          </button>
        </div>
      )}
      {fid && (
        <div>
          <button onClick={() => makeCast('this is u3 cast')}>makeCast</button>
          <button
            onClick={async () => {
              if (!fid) return
              const data = await getCastsByFid(fid)
              if (!data) return
              data.messages.forEach((cast) => {
                console.log(cast)
              })
            }}
          >
            getCastsByFid
          </button>
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
