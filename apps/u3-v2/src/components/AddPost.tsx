import { useState } from 'react'
import AddPostModal from './Modal/AddPostModal'

export default function AddPost() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(true)}>+ Post</button>
      <AddPostModal open={open} closeModal={() => setOpen(false)} />
    </div>
  )
}
