import React, { useState, useRef, useEffect, useContext } from 'react'
import { BsJustify, BsXLg } from 'react-icons/bs'
import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { MetaMaskAvatar } from "react-metamask-avatar"

import { Links } from '../../help/help'
import Logo from '../../assets/image/logo.png'
import Button from '../../components/buttons'
import UserContext from '../../context/userContext'
import { socket } from '../../utils/socket'

export default function Header() {

  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const { setEnsName, setJoinedDrawer } = useContext(UserContext)

  const [menubar, setMenuBar] = useState(false)
  const [isDropDownOpen, setDropDownOpen] = useState(false)
  const menuDropdown = useRef(null)

  const ensNameObj = useEnsName({
    address: address,
    chainId: mainnet.id
  })

  useEffect(() => {
    setEnsName(ensNameObj.data)
  }, [ensNameObj, setEnsName])

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuDropdown.current &&
        !menuDropdown.current.contains(event.target)
      ) {
        setMenuBar(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuDropdown])

  const handleDisconnect = () => {
    disconnect()
    setDropDownOpen(false)
    socket.disconnect()
    // setJoinedDrawer({})
  }

  const formatWalletAddress = address => {
    if (!address || address.length < 8) {
      return 'No Address'
    }
    const firstFive = address.slice(0, 5)
    const lastThree = address.slice(-5)
    return `${firstFive}...${lastThree}`
  }

  return (
    <div className='absolute top-0 z-20 flex flex-col w-full'>
      <div className='container'>
        <div className='w-full h-[80px] items-center justify-between flex flex-row px-5 font-barlow'>
          <a href='/' className='w-[160px] lg:w-[220px]'>
            <img src={Logo} alt='logo' className='w-full disableDrag' />
          </a>
          <div className='flex flex-row items-center justify-between gap-6 sm2:hidden'>
            {menubar ? (
              <div
                ref={menuDropdown}
                className='w-[180px] h-[320px] px-8 py-6 bg-white text-black rounded-bl-xl flex flex-col justify-between absolute top-0 right-0 gap-2 z-20 text-start border-b-[1px] border-b-black border-l-[1px] border-l-black'
              >
                <div
                  onClick={() => setMenuBar(false)}
                  className='flex flex-row justify-end w-full mb-5'
                >
                  <BsXLg />
                </div>
                {Links.map((item, index) => {
                  return (
                    <a key={index} href={item.url} className='w-full'>
                      <p className='text-[14px] lg:text-[20px] font-semibold border-b-[1px] border-b-black text-end'>
                        {item.name}
                      </p>
                    </a>
                  )
                })}
                {address ? (
                  <div
                    onClick={() => disconnect()}
                    className='px-4 py-2 lg:px-5 text-white uppercase text-[12px] lg:text-[18px] bg-black rounded-full justify-center items-center flex flex-col font-sigmar mt-5'
                  >
                    Disconnect
                  </div>
                ) : (
                  <div
                    onClick={openConnectModal}
                    className='px-4 py-2 lg:px-5 text-white uppercase text-[12px] lg:text-[18px] bg-black rounded-full justify-center items-center flex flex-col font-sigmar mt-5'
                  >
                    Connect
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => setMenuBar(true)}
                className='w-[46px] h-[46px] rounded-full bg-black flex flex-row items-center justify-center text-white text-[24px] cursor-pointer'
              >
                <BsJustify />
              </div>
            )}
          </div>
          <div className='relative flex-row items-center justify-end hidden gap-2 sm2:flex'>
            {Links.map((item, index) => {
              return (
                <a
                  key={index}
                  href={item.url}
                  className='w-[60px] lg:w-[90px]'
                >
                  <p className='text-[12px] lg:text-[18px] font-semibold'>
                    {item.name}
                  </p>
                </a>
              )
            })}
            {address ? (
              <>
                <button
                  id='dropdownMenuButton1'
                  onClick={() => setDropDownOpen((prev) => !prev)}
                  className={
                    'flex justify-center items-center  px-4 py-2 lg:px-5 text-white uppercase text-[12px] lg:text-[18px] bg-black rounded-full font-sigmar gap-2'
                  }
                >
                  <MetaMaskAvatar address={address} size={24} />{ensNameObj.data ?? formatWalletAddress(address)}
                </button>
                <>
                  {
                    isDropDownOpen ?
                      <div className='absolute top-[105%] sm:left-[80%] lg:left-[85%] flex justify-center items-center text-white font-barlow font-bold w-[120px] h-[30px] bg-slate-900 rounded-xl cursor-pointer' onClick={handleDisconnect}>
                        Disconnect
                      </div>
                    :
                      null
                  }
                </>
              </>
            ) : (
              <Button
                text={'connect'}
                clickEvent={openConnectModal}
                className={
                  'px-4 py-2 lg:px-5 text-white uppercase text-[12px] lg:text-[18px] bg-black rounded-full justify-center items-center flex flex-col font-sigmar'
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
