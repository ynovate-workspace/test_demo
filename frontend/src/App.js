import React, { useState, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets
} from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  trustWallet,
  ledgerWallet
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import {
  mainnet,
  base,
  baseSepolia,
  sepolia
} from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'


import UserContext from './context/userContext'
import Header from './page/layout/header'
import Footer from './page/layout/footer'
import Home from './page/home'
import './App.css'

const { chains, publicClient } = configureChains(
  [
    mainnet,
    base,
    baseSepolia,
    sepolia,
  ],
  [publicProvider()]
)

const projectId = process.env.REACT_APP_WALLET_PROJECT_ID

const { wallets } = getDefaultWallets({
  appName: 'SupDucks Painter',
  projectId,
  chains
})

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains })
    ]
  }
])

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})

function App () {
  const [currentColor, setCurrentColor] = useState('#CA0048')
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [clear, setClear] = useState(false)
  const [currentSize, setCurrentSize] = useState(20)
  const [currentTool, setCurrentTool] = useState('Normal')
  const [security, setSecurity] = useState('Private')
  const [alertModal, setAlertModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [undoStatus, setUndoStatus] = useState(false)
  const [redoStatus, setRedoStatus] = useState(false)
  const [nftMetadataURL, setNftMetadataURL] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  const [ensName, setEnsName] = useState('')
  const [joinedDrawer, setJoinedDrawer] = useState()

  const value = useMemo(
    () => ({
      currentColor,
      setCurrentColor,
      currentSize,
      setCurrentSize,
      clear,
      setClear,
      currentTool,
      setCurrentTool,
      alertModal,
      setAlertModal,
      alertMessage,
      setAlertMessage,
      undoStatus,
      setUndoStatus,
      redoStatus,
      setRedoStatus,
      nftMetadataURL,
      setNftMetadataURL,
      loadingModal,
      setLoadingModal,
      security,
      setSecurity,
      ensName,
      setEnsName,
      joinedDrawer,
      setJoinedDrawer,
      backgroundColor,
      setBackgroundColor,
    }),
    [currentColor, currentSize, clear, currentTool, alertModal, alertMessage, undoStatus, redoStatus,  nftMetadataURL, loadingModal, security, ensName, joinedDrawer, backgroundColor]
  )

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div className='App '>
          <UserContext.Provider value={value}>
            <Router>
              <Header />
              <Routes>
                <Route path='/' element={<Home />} />
              </Routes>
              <Footer />
            </Router>
          </UserContext.Provider>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
