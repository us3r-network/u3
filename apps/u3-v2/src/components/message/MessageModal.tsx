import styled from 'styled-components'
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx'
import { useEffect, useRef } from 'react'

export default function MessageModal() {
  const { openMessageModal, setOpenMessageModal } = useXmtpStore()
  const modalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenMessageModal(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Wrapper open={openMessageModal} ref={modalRef}>
      Comming soon
    </Wrapper>
  )
}

const Wrapper = styled.div<{ open: boolean }>`
  width: 400px;
  height: 500px;
  padding: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 10px;
  background: #212228;

  position: absolute;
  top: 80px;
  right: 0;
  transform: translateY(5px);

  display: ${({ open }) => (open ? 'block' : 'none')};
`
