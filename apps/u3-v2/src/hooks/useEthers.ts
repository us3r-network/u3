import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

export function useEthers() {
  const [ethersProvider, setEthersProvider] = useState<ethers.BrowserProvider>()

  useEffect(() => {
    let provider: ethers.BrowserProvider
    if (!(window as any).ethereum) {
      console.log('No ethereum object on window')
      return
    }
    provider = new ethers.BrowserProvider((window as any).ethereum)
    setEthersProvider(provider)
  }, [])

  const connectWallet = useCallback(async () => {
    if (!ethersProvider) {
      return
    }
    const accounts = await ethersProvider.send('eth_requestAccounts', [])
    return accounts
  }, [ethersProvider])

  return {
    ethersProvider,
    connectWallet,
  }
}
