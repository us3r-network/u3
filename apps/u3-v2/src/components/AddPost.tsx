import { useState } from 'react'
import AddPostModal from './Modal/AddPostModal'
import { useFarcasterCtx } from '../contexts/farcaster'

export default function AddPost({
  openFarcasterQR,
}: {
  openFarcasterQR: () => void
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
      <AddPostModal open={open} closeModal={() => setOpen(false)} />
    </div>
  )
}
