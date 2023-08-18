import { useState, useEffect } from 'react'
import styled from 'styled-components'

export default function LensNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  useEffect(() => {
    setNotifications([])
  }, [])
  return (
    <NotificationsWrapper>
      <NotificationsHeader>Notifications</NotificationsHeader>
      <NotificationList>
        {notifications.map((message) => (
          <NotificationItem key={message?.id}>
            {message?.content}
          </NotificationItem>
        ))}
      </NotificationList>
    </NotificationsWrapper>
  )
}

const NotificationsWrapper = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
`
const NotificationsHeader = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
`
const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #ccc;
`
const NotificationItem = styled.div`
  width: 100%;
  height: 40px;
`
