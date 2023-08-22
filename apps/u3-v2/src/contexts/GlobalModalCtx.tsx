import { PropsWithChildren, createContext, useContext, useState } from 'react'
import LensLoginModal from '../components/lens/LensLoginModal'
import LensCreatePostModal from '../components/lens/LensCreatePostModal'

interface GlobalModalContextValue {
  openLensLoginModal: boolean
  setOpenLensLoginModal: (open: boolean) => void
  openLensCreatePostModal: boolean
  setOpenLensCreatePostModal: (open: boolean) => void
}

export const GlobalModalContext = createContext<GlobalModalContextValue>({
  openLensLoginModal: false,
  setOpenLensLoginModal: () => {},
  openLensCreatePostModal: false,
  setOpenLensCreatePostModal: () => {},
})

export function GlobalModalProvider({ children }: PropsWithChildren) {
  const [openLensLoginModal, setOpenLensLoginModal] = useState(false)
  const [openLensCreatePostModal, setOpenLensCreatePostModal] = useState(false)
  return (
    <GlobalModalContext.Provider
      value={{
        openLensLoginModal,
        setOpenLensLoginModal,
        openLensCreatePostModal,
        setOpenLensCreatePostModal,
      }}
    >
      {children}
      <LensLoginModal
        open={openLensLoginModal}
        closeModal={() => setOpenLensLoginModal(false)}
      />
      <LensCreatePostModal
        open={openLensCreatePostModal}
        closeModal={() => setOpenLensCreatePostModal(false)}
      />
    </GlobalModalContext.Provider>
  )
}

export function useGlobalModal() {
  const context = useContext(GlobalModalContext)
  if (!context) {
    throw Error(
      'useGlobalModal can only be used within the GlobalModalProvider component',
    )
  }
  return context
}
