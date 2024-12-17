import React from 'react'
import DuckImg from '../../assets/image/duck.png'

export default function Footer() {
  return (
    <div className='w-full h-[250px] bg-[url("assets/image/Grey.png")] bg-cover relative disableDrag'>
      <img src={DuckImg} alt='DuckImg' className='bottom-0 absolute z-[100] w-[230px] sm2:w-[280px] lg:w-[350px] disableDrag' />
      <div className='text-white text-[12px] absolute bottom-0 pl-[120px] sm2:pl-[250px] lg:pl-[300px] pb-2 w-full text-center sm2:text-start'>
        Built by MegaVoltCorp, All Rights Reserved © 2024
      </div>
    </div>
  )
}
