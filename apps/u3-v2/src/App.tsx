import { Outlet, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import { ProfileStateProvider } from '@us3r-network/profile'
import { init } from '@airstack/airstack-react'

import Home from './container/Home'
import Profile from './container/Profile'
import NoMatch from './container/NoMatch'
import {
  CERAMIC_HOST,
  WALLET_CONNECT_PROJECT_ID,
  AIRSTACK_API_KEY,
} from './constants'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Nav from './components/Nav'
import FarcasterProvider from './context/farcaster'

init(AIRSTACK_API_KEY)
dayjs.extend(relativeTime)

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Us3rAuthWithRainbowkitProvider
      projectId={WALLET_CONNECT_PROJECT_ID}
      appName="S3 Console"
    >
      <ProfileStateProvider ceramicHost={CERAMIC_HOST}>
        <FarcasterProvider>
          <Routers />
        </FarcasterProvider>
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  )
}

function Layout() {
  return (
    <LayoutWrapper>
      <Nav />
      <AppContainer className="container">
        <Outlet />
      </AppContainer>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </LayoutWrapper>
  )
}
const LayoutWrapper = styled.div`
  display: flex;
`

const AppContainer = styled.div`
  width: 0;
  height: 100vh;
  flex: 1;
`
