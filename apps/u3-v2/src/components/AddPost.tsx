import { useState } from 'react'
import AddPostModal from './Modal/AddPostModal'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'

export default function AddPost({
  openFarcasterQR,
  farcasterUserData,
}: {
  openFarcasterQR: () => void
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
}) {
  const [open, setOpen] = useState(false)
  const { isConnected } = useFarcasterCtx()
  return (
    <div>
      <button
        onClick={() => {
          if (!isConnected) {
            openFarcasterQR()
            return
          }
          setOpen(true)
        }}
      >
        + Post
      </button>
      <AddPostModal
        open={open}
        closeModal={() => setOpen(false)}
        farcasterUserData={farcasterUserData}
      />
    </div>
  )
}
