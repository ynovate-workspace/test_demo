import React from 'react'
import BottomImg from '../assets/image/SupDucksHills 3.png'
import DuckImg from '../assets/image/duck.png'

export default function Loading () {
  return (
    <div className='w-full h-screen fixed top-0 left-0 bg-black/90 items-center justify-center flex flex-col z-40'>
      <div className='w-[270px] bg-white rounded-xl font-sigmar bg-[url("assets/image/Sky.png")] relative'>
        <img
          src={DuckImg}
          alt='DuckImg'
          className='absolute bottom-0 left-0 w-[100px] z-20'
        />
        <div className='w-full h-full pt-10 pb-20'>
          <div
            className='inline-block h-16 w-16 animate-spin text-[#E2E2E2] rounded-full border-4 border-solid border-current border-r-[#FF4C8C] align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
            role='status'
          >
            <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
              Loading...
            </span>
          </div>
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
