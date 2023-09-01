import styled from 'styled-components'
import { useMemo, useRef, useState } from 'react'
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx'
import useSendMessage from '../../hooks/xmtp/useSendMessage'
import useSendAttachment from '../../hooks/xmtp/useSendAttachment'
import { ButtonPrimary } from '../common/button/ButtonBase'
import TextareaBase from '../common/input/TextareaBase'
import ImgIcon from '../common/icons/ImgIcon'

export default function SendMessageForm() {
  const { messageRouteParams } = useXmtpStore()
  const peerAddress = messageRouteParams?.peerAddress || ''
  const { isSending, sendMessage } = useSendMessage(peerAddress)
  const { isSending: isSendingAttachment, sendAttachment } =
    useSendAttachment(peerAddress)
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const previewImage = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const inputDisabled = useMemo(
    () => isSending || isSendingAttachment,
    [isSending, isSendingAttachment],
  )

  const sendDisabled = useMemo(
    () => isSending || isSendingAttachment || (!message && !file),
    [isSending, isSendingAttachment, message, file],
  )

  const fileInputRef = useRef<HTMLInputElement>(null)
  return (
    <SendMessageFormWrap
      onSubmit={(e) => {
        e.preventDefault()
        if (!peerAddress) return
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
      {!!previewImage && (
        <PreviewImgWrapper>
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
        </PreviewImgWrapper>
      )}
      <FormWrapper>
        <TextArea
          placeholder="Write a message"
          aria-disabled={inputDisabled}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
          disabled={!!file}
        />

        <ImgLabel>
          <ImgIcon stroke="black" />
          <FileInput
            ref={fileInputRef}
            type="file"
            disabled={isSending}
            onChange={(e) => {
              setFile(e.target.files?.[0] || null)
            }}
          />
        </ImgLabel>

        <SubmitButton type="submit" disabled={sendDisabled}>
          {isSending ? 'Sending' : 'Send'}
        </SubmitButton>
      </FormWrapper>
    </SendMessageFormWrap>
  )
}
const SendMessageFormWrap = styled.form`
  width: 100%;
  min-height: 40px;
  border-radius: 10px;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
`
const FormWrapper = styled.div`
  width: 100%;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
`
const PreviewImgWrapper = styled.div`
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
  position: relative;
`

const TextArea = styled(TextareaBase)`
  resize: none;
  flex: 1;
  height: 100%;
  background: none;
  border: none;
  &:focus-within {
    color: black;
    border-color: none;
    background: none;
  }
`

const ImgLabel = styled.label`
  height: 20px;
  width: 20px;
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
const SubmitButton = styled(ButtonPrimary)`
  width: 16px;
  height: 16px;
`
