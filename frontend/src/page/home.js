import React, { useContext } from 'react'
import {
  SelectSize,
  SelectColor,
  CustomColor,
  ClearImage,
  SelectTool,
  SelectPaintbrush,
  BackgroundColor
} from '../components/selectvalue'
import DrawingArea from '../components/drawing'
import BottomImg from '../assets/image/SupDucksHills 3.png'
import AlertModal from '../components/alertmodal'
import Loading from '../components/loading'
import UserContext from '../context/userContext'
import Security from '../components/security'
import JoinedDrawer from '../components/joinedDrawer'

export default function Home () {
  const { alertModal, loadingModal } = useContext(UserContext)

  return (
    <div className='relative w-full h-full min-h-screen bg-[url("assets/image/Sky.png")] bg-cover pt-[90px] disableDrag'>
      <div className='container'>
        <div className='w-full h-full flex flex-col gap-3 px-5 pt-8'>
          <Security />
          <div className='w-full h-full min-h-[calc(100vh-300px)] grid grid-cols-[auto_1fr] max-sm2:grid-rows-[auto_1fr] max-sm2:grid-cols-1 justify-between gap-4 relative pt-3'>
            <div className='w-full sm2:w-[120px] h-full flex flex-col gap-5'>
              <div className='w-full bg-[#E4E1E1] bg-cover rounded-xl border-black border-[2px] px-2 py-3 gap-2 flex flex-col justify-start items-center relative'>
                <div className='flex flex-col items-center w-full gap-5 py-6'>
                  <SelectSize />
                  <SelectColor />
                  <CustomColor />
                  <BackgroundColor />
                  <ClearImage />
                </div>
              </div>
              <div className='flex flex-col items-center w-full gap-5 px-2 py-6 bg-[#E4E1E1] bg-cover rounded-xl border-black border-[2px]'>
                <SelectPaintbrush />
                <SelectTool />
              </div>
            </div>
            <div className='relative flex flex-col max-h-[901px]'>
              <DrawingArea />
            </div>
          </div>
        </div>
      </div>
      <div className='md:h-[372px] sm:h-[172px] w-[100vw] overflow-hidden object-cover -mt-[60px]  object-right'>
        <img
          src={BottomImg}
          alt='BottomImg'
          className='h-[372px] object-cover object-right  2xl:h-[500px] xl:w-[100vw] disableDrag'
        />
      </div>

      <JoinedDrawer />
      {alertModal && <AlertModal />}

      {loadingModal && <Loading />}
    </div>
  )
}
