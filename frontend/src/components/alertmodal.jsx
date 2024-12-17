import React, { useContext } from 'react'
import UserContext from '../context/userContext'
import BottomImg from '../assets/image/SupDucksHills 3.png'
import CancelBtn from '../assets/image/cancel.png'

export default function AlertModal () {
  const { alertMessage, setAlertModal } = useContext(UserContext)

  return (
    <div className='w-full h-screen fixed top-0 left-0 bg-black/70 items-center justify-center flex flex-col z-40'>
      <div className='w-[250px] bg-white rounded-xl font-sigmar bg-[url("assets/image/Sky.png")] relative'>
        <img
          src={CancelBtn}
          alt='CancelBtn'
          onClick={() => setAlertModal(false)}
          className='w-[35px] h-[35px] absolute -top-4 -right-4 disableDrag rounded-b-xl z-50 cursor-pointer'
        />
        <div className='w-full h-full pt-10 pb-20 pr-4 pl-4'>
          <div className='w-full h-full break-words'>{alertMessage}</div>
        </div>
        <img
          src={BottomImg}
          alt='BottomImg'
          className='w-full absolute bottom-0 disableDrag rounded-b-xl'
        />
      </div>
    </div>
  )
}
