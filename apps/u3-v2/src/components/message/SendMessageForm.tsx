import styled from 'styled-components'
import { useMemo, useRef, useState } from 'react'
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx'
import useSendMessage from '../../hooks/xmtp/useSendMessage'
import useSendAttachment from '../../hooks/xmtp/useSendAttachment'
import {
  ButtonPrimaryLine,
  ButtonPrimaryLineCss,
} from '../common/button/ButtonBase'
import TextareaBase from '../common/input/TextareaBase'

export default function SendMessageForm() {
  const { currentConvoAddress } = useXmtpStore()
  const { isSending, sendMessage } = useSendMessage(currentConvoAddress)
  const { isSending: isSendingAttachment, sendAttachment } =
    useSendAttachment(currentConvoAddress)
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const previewImage = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const isDisabled = useMemo(
    () => isSending || isSendingAttachment,
    [isSending, isSendingAttachment],
  )

  const fileInputRef = useRef<HTMLInputElement>(null)
  return (
    <SendMessageFormWrap
      onSubmit={(e) => {
        e.preventDefault()
        if (!currentConvoAddress) return
        if (file) {
          sendAttachment(file, {
            onSuccess: () => {
              setFile(null)
            },
            onFail: (error) => {
              alert(error.message)
            },
          })
          return
        }
        sendMessage(message, {
          onSuccess: () => {
            setMessage('')
          },
          onFail: (error) => {
            alert(error.message)
          },
        })
      }}
    >
      <FileInputLabel>
        {previewImage ? (
          <>
            <FilePreview src={previewImage} />
            <DelFileIcon
              onClick={(e) => {
                e.preventDefault()
                setFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            >
              x
            </DelFileIcon>
          </>
        ) : (
          'select image'
        )}

        <FileInput
          ref={fileInputRef}
          type="file"
          disabled={isDisabled}
          onChange={(e) => {
            setFile(e.target.files?.[0] || null)
          }}
        />
      </FileInputLabel>

      <TextArea
        aria-disabled={isDisabled}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
        }}
        disabled={!!file}
      />

      <SubmitButton type="submit" disabled={isDisabled}>
        Send
      </SubmitButton>
    </SendMessageFormWrap>
  )
}
const SendMessageFormWrap = styled.form`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 10px;
`

const TextArea = styled(TextareaBase)`
  flex: 1;
  height: 60px;
`

const FileInputLabel = styled.label`
  ${ButtonPrimaryLineCss}
  height: 60px;
  width: 60px;
  position: relative;
`
const FileInput = styled.input`
  display: none;
`
const FilePreview = styled.img`
  height: 60px;
  width: 60px;
`
const DelFileIcon = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  height: 20px;
  width: 20px;
  background-color: red;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
`
const SubmitButton = styled(ButtonPrimaryLine)`
  height: 60px;
  width: 100px;
`
