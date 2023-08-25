import { useState } from 'react'
import AddPostModal from './Modal/AddPostModal'

export default function AddPost({
  farcasterUserData,
}: {
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
}) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => {
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
