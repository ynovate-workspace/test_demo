import { useContext, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { MetaMaskAvatar } from "react-metamask-avatar"

import { socket } from "../utils/socket"
import UserContext from "../context/userContext"

const JoinedDrawer = () => {

  const { address } = useAccount()
  const { joinedDrawer, setJoinedDrawer, ensName } = useContext(UserContext)

  useEffect(() => {
    socket.on('joinBoard', (data) => {
      console.log("joinBoard===>", data)
      setJoinedDrawer(data)
    })

    return () => socket.off('joinBoard')
  }, [])

  useEffect(() => {
    if(address){
      socket.emit('joinBoard', { ens: ensName, address: address})
    }
  }, [ensName, address])

  const formatWalletAddress = address => {
    if (!address || address.length < 8) {
      return 'No Address'
    }
    const firstFive = address.slice(0, 5)
    const lastThree = address.slice(-5)
    return `${firstFive}...${lastThree}`
  }

  return (
    <div className='absolute z-[10] border-black border-[2px] min-w-[510px] max-w-[510px] bg-gray-100 md:h-[350px] sm:h-[150px] rounded-xl mt-4 ml-[calc(50vw-255px)] bottom-[-100px] overflow-y-auto'>
      <div className='flex flex-col p-4 gap-2'>
        <div className='flex items-center gap-2'>
          <div className='text-xl font-bold'>Who's Online</div>
          <div className='w-3 h-3 rounded-full bg-green-500' />
          <div className='text-xs font-bold text-gray-400'>
            {
              joinedDrawer ?
              <>
                {Object.keys(joinedDrawer).length || 0} Users Online
              </>
              :
              <>
                Users Online
              </>
            }
          </div>
        </div>
        {
          joinedDrawer ?
          <>
            {Object.keys(joinedDrawer).map((user) => (
              <>
                <div className="flex justify-between items-center gap-2 mt-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-400">
                      <MetaMaskAvatar address={joinedDrawer[user].address} size={40}  />
                    </div>
                    {
                      joinedDrawer[user].ens ?
                        <div className="text-md text-blue-500 font-bold">
                          {joinedDrawer[user].ens}
                        </div>
                      :
                      <div className="text-md text-blue-500 font-bold">
                        {formatWalletAddress(joinedDrawer[user].address)}
                      </div>
                    }
                  </div>
                  <div className="w-4 h-4 rounded-full bg-green-500" /> {/*  */}
                </div>
                <div className="w-full h-[2px] border-[1px] border-gray-200 rounded-full" />
              </>
            ))}
          </>
          :null
        }
        <div className=''></div>
      </div>
    </div>
  );
};

export default JoinedDrawer;
