import React from 'react'
import { ethers } from 'ethers'

import '../App.css' // Import the CSS for the cursor

const CustomCursor = (props) => {
  const { currentSize, currentColor, currentTool, address, currentMouseX, currentMouseY, areaFocus } = props

  // consumer function which loads address from web3 provider

  const formatWalletAddress = address => {
    if (!address || address.length < 8) {
      return 'No Address'
    }
    const firstFive = address.slice(0, 5)
    const lastThree = address.slice(-5)
    return `${firstFive}...${lastThree}`
  }

  return (
    <div
      className={`relative customCursor border-[1px] border-black ${
        areaFocus ? 'inline' : 'hidden'
      }
                ${currentTool === 'Eraser' ? 'rounded-none' : 'rounded-full'}`}
      style={{
        width: `${currentSize}px`,
        height: `${currentSize}px`,
        left: `${currentMouseX}px`,
        top: `${currentMouseY}px`,
        backgroundColor: `${currentTool === 'Eraser' ? '#FFF' : currentColor}`
      }}
    >
      <div
        className='absolute w-[160px] border-[1px] border-black bg-[#D9D9D9] text-[#0047FF] rounded-l-full pl-2 pr-1 font-medium'
        style={{
          left: `${currentSize}px`,
          bottom: `${currentSize}px`,
        }}
      >
        {
          address ?
            ethers.utils.isAddress(address) ?
              <>
                {formatWalletAddress(address)}
              </>
            :
              <>
                {address}
              </>
            : 
              <>
                No Address
              </>
        }
      </div>
    </div>
  )
}

export default CustomCursor
