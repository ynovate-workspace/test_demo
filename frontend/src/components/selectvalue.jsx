import React, { useContext } from 'react'
import { useAccount } from 'wagmi'
import { FontSize, Colors, Tools, Paintbrushs } from '../help/help'
import UserContext from '../context/userContext'
import DeleteBtn from '../assets/image/delete-btn.png'
import Brush from '../assets/icons/brush.png'
import BgColorIcon from '../assets/icons/fill-color.png'
import { socket } from '../utils/socket'


/**
 * @description size tool component
 * @params void
 * @returns void
 */
export const SelectSize = () => {
  const { address } = useAccount()
  const { currentColor, currentSize, setCurrentSize, setAlertModal } =
    useContext(UserContext)

  const selectSize = size => {
    if (address) {
      setCurrentSize(size)
    } else {
      setAlertModal(true)
    }
  }
  return (
    <div className='flex flex-row items-center justify-center w-full h-full gap-2 sm2:flex-col'>
      {FontSize.map((item, index) => {
        return (
          <div key={index} onClick={() => selectSize(item.size)}>
            <div
              className={`${currentSize === item.size
                ? 'border-[3px] border-white p-0 shadow-black/50 shadow-md'
                : 'border-none p-1'
                } bg-blue-600 rounded-full cursor-pointer flex flex-col`}
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
                backgroundColor: currentColor
              }}
            ></div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * @description color tool component
 * @params void
 * @returns void
 */
export const SelectColor = () => {
  const { address } = useAccount()

  const { currentColor, setCurrentColor, setAlertModal } =
    useContext(UserContext)

  const selectColor = color => {
    if (address) {
      setCurrentColor(color)
    } else {
      setAlertModal(true)
    }
  }
  return (
    <div className='w-full grid grid-cols-6 3.5xs:grid-cols-7 3xs:grid-cols-8 2xs:grid-cols-9 xs:grid-cols-12 sm2:grid-cols-3 gap-x-2 gap-y-2'>
      {Colors.map((item, index) => {
        return (
          <div key={index} onClick={() => selectColor(item)}>
            <div
              className={`${currentColor === item
                ? 'border-[3px] border-white p-0 shadow-black/50 shadow-md'
                : 'border-none p-1'
                } w-6 h-6 rounded-sm cursor-pointer flex flex-col`}
              style={{
                backgroundColor: item
              }}
            ></div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * @description custom color tool component
 * @params void
 * @returns void
 */
export const CustomColor = () => {
  const { address } = useAccount()
  const { currentColor, setCurrentColor, setAlertModal } =
    useContext(UserContext)

  const selectCustomColor = color => {
    if (address) {
      setCurrentColor(color)
    } else {
      setAlertModal(true)
    }
  }
  return (
    <div className='flex justify-center items-center'>
      <img 
        src={Brush}
        alt='Brush'
        className='w-[40px] h-[40px]'
      />
      <div className='w-full max-w-[120px] h-2 bg-[url("assets/image/painter-bg.png")] rounded-lg border-black border-[1px] overflow-hidden'>
        <input
          type='color'
          className='h-10 w-[110px] -mt-4 -ml-1'
          value={currentColor}
          onChange={e => {
            selectCustomColor(e.target.value)
          }}
        />
      </div>
    </div>

  )
}

export const BackgroundColor = () => {
  const { address } = useAccount()
  const { backgroundColor, setBackgroundColor, setAlertModal } =
    useContext(UserContext)

  const selectCustomColor = color => {
    if (address) {
      setBackgroundColor(color)
      socket.emit('changeBackgroundColor', color)
    } else {
      setAlertModal(true)
    }
  }
  return (
    <div className='flex items-center justify-center'>
      <img 
        src={BgColorIcon}
        alt='BgColorIcon'
        className='w-[45px] h-[45px]'
      />
      <div className='w-full max-w-[120px] h-2 bg-[url("assets/image/painter-bg.png")] rounded-lg border-black border-[1px] overflow-hidden'>
        <input
          type='color'
          className='h-10 w-[110px] -mt-4 -ml-1'
          value={backgroundColor}
          onChange={e => {
            selectCustomColor(e.target.value)
          }}
        />
      </div>
    </div>
  )
}

/**
 * @description clear image button component
 * @params void
 * @returns void
 */
export const ClearImage = () => {
  const { address } = useAccount()
  const { setClear, setAlertModal } = useContext(UserContext)
  const setClearEvent = (e, clearState) => {
    if (address) {
      setClear(clearState)
    } else {
      setAlertModal(true)
    }
  }
  return (
    <img
      src={DeleteBtn}
      alt='DeleteBtn'
      className='w-[60px] absolute -bottom-12 cursor-pointer rounded-full'
      onClick={e => {
        setClearEvent(e, true)
        socket.emit('clear')
      }}
    />
  )
}

/**
 * @description brush tool component (brush or polygon)
 * @params void
 * @returns void
 */
export const SelectPaintbrush = () => {
  const { address } = useAccount()
  const { currentTool, setCurrentTool, setAlertModal } = useContext(UserContext)
  const selectpaint = paint => {
    if (address) {
      setCurrentTool(paint)
    } else {
      setAlertModal(true)
    }
  }
  return (
    <div className='w-full max-w-[200px] grid grid-cols-2 sm2:grid-cols-2 gap-x-2 gap-y-2'>
      {Paintbrushs.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => selectpaint(item.type)}
            className='mx-auto'
          >
            <div className='flex flex-col items-center justify-center w-10 h-10 rounded-sm cursor-pointer'>
              {currentTool === item.type ? (
                <img src={item.active} alt={item.active} />
              ) : (
                <img
                  src={item.icon}
                  alt={item.type}
                  className={`${item.type === 'BsTriangle' ? 'mt-1' : ''}`}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * @description brush polygon tool component
 * @params void
 * @returns void
 */
export const SelectTool = () => {
  const { address } = useAccount()
  const { currentTool, setCurrentTool, setAlertModal } = useContext(UserContext)
  const selectTool = paint => {
    if (address) {
      setCurrentTool(paint)
    } else {
      setAlertModal(true)
    }
  }
  return (
    <div className='w-full max-w-[200px] grid grid-cols-4 sm2:grid-cols-2 gap-x-2 gap-y-2'>
      {Tools.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => selectTool(item.type)}
            className='mx-auto'
          >
            <div className='flex flex-col items-center justify-center w-10 h-10 cursor-pointer'>
              {currentTool === item.type ? (
                <img src={item.active} alt={item.active} />
              ) : (
                <img
                  src={item.icon}
                  alt={item.type}
                  className={`${item.type === 'BsTriangle' ? 'mt-1' : ''}`}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}