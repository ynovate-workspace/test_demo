import React, { useContext } from 'react'
import UserContext from '../context/userContext'

export default function Security () {
  const { security, setSecurity, joinedDrawer } = useContext(UserContext)

  return (
    <div className={` ${ joinedDrawer ? 'w-[300px]' : 'w-[200px]' } h-full items-center justify-start flex flex-row rounded-xl border-black border-[2px]`}>
      <div
        onClick={() => setSecurity('Private')}
        className={`${
          security === 'Private'
            ? 'bg-black text-white '
            : 'bg-[#E4E1E1] text-black'
        } w-[100px] text-center py-3 rounded-l-lg text-[16px] font-semibold cursor-pointer`}
      >
        Private
      </div>
      <div
        onClick={() => setSecurity('Public')}
        className={`${
          security === 'Public'
            ? 'bg-black text-white '
            : 'bg-[#E4E1E1] text-black'
        }
        ${
          joinedDrawer ?
            'w-[200px]'
          :
            'w-[100px]'
        }
        flex justify-center items-center gap-2 text-center py-3 rounded-r-lg text-[16px] font-semibold cursor-pointer`}
      >
        Public
            {
              joinedDrawer ?
              <>
                <div className='w-3 h-3 rounded-full bg-green-500' />
                <div className='text-xs font-bold text-gray-400'>
                  {Object.keys(joinedDrawer).length || 0} Users Online
                </div>
              </>
              :
              <>
              </>
            }

      </div>
    </div>
  )
}
