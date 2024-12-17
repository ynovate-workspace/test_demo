import { useEffect, useRef, useState, useContext } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { NFTStorage, File } from 'nft.storage'
import { ethers } from 'ethers'
import throttle from 'lodash.throttle'
import axios from 'axios'

import UserContext from '../context/userContext'
import DuckOutline from '../assets/image/Duck Outline.png'
import MintBtn from '../assets/image/mint-btn.png'
import DownBtn from '../assets/image/down-btn.png'
import CustomCursor from './CustomCursor'
import abiFile from "../artifacts/contracts/NFTMinter.sol/NFTMinter.json"
import {
  drawBrush,
  drawRect,
  drawCircle,
  drawTriangle,
  drawLine,
  downloadClick,
  drawEraser
} from '../utils/drawingAction'
import Snapshot from '../utils/Snapshot'
import { contractAddress } from '../utils/contracts-config'
import { socket } from '../utils/socket'

// new Snapshot class create
const snapshotImage = new Snapshot()
const NFT_STORAGE_API_KEY = process.env.REACT_APP_NFT_STORAGE_API_KEY

/**
 * @description function which manage canvas area
 * @params void
 * @returns void
 */
function DrawingArea() {
  //initializing state setting
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)

  // consumer function which loads address from web3 provider
  const { address } = useAccount()
  const balance = useBalance({
    address: address,
  })

  const [isPushBlank, setIsPushBlank] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lineOpacity] = useState(1)
  const [blankPanel, setBlankPanel] = useState(true)
  const [prevMouseX, setPrevMouseX] = useState(0)
  const [prevMouseY, setPrevMouseY] = useState(0)
  const [currentMouseX, setCurrentMouseX] = useState(0)
  const [currentMouseY, setCurrentMouseY] = useState(0)
  const [areaFocus, setAreaFocus] = useState(false)
  const [mousePos, setMousePos] = useState()

  // load from context data and methods
  const {
    clear,
    currentColor,
    currentSize,
    currentTool,
    ensName,
    security,
    setClear,
    setAlertModal,
    setAlertMessage,
    setNftMetadataURL,
    setLoadingModal,
    backgroundColor,
    setBackgroundColor
  } = useContext(UserContext)

  /**
   * @description lifecycle function of function component
   * @params arrow function
   * @returns void
   */

  useEffect(() => {
    //connect connect with real DOM and virtual DOM
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    //When delete button clicks, format of snapshotImage array and clear current canvas panel
    if (clear) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      snapshotImage.clear()
      ctx.fillStyle = `rgba(0, 0, 0, 0)`
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (security === 'Public') {
        const imageData = ctxRef.current.canvas.toDataURL()
        socket.emit('endDrawing', imageData)
      }
      setIsPushBlank(true)
      setClear(false)
    }

  }, [clear])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (security === 'Public') {
      const imageData = ctxRef.current.canvas.toDataURL()
      socket.emit('endDrawing', imageData)
    }
  }, [backgroundColor])

  useEffect(() => {

    const canvas = canvasRef.current
    //when changing tools, this can be performed only one time.
    const ctx = canvas.getContext('2d')

    if (security === 'Public') {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      snapshotImage.clear()
      setIsPushBlank(true)
      setClear(false)
      const fetchImageData = async () => {
        setAlertMessage('Waiting...')
        setAlertModal(true)
        const response = await axios.get(`${process.env.REACT_APP_SOCKET_SERVER_URL}/api/get-multi-drawing-image`)

        if (response.data.length) {
          const img = new Image()
          img.src = response.data[0].imageData

          img.onload = () => {
            canvas.width = 1220
            canvas.height = 901
            ctx.drawImage(img, 0, 0)
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.globalAlpha = lineOpacity
            ctx.strokeStyle = currentColor
            ctx.lineWidth = currentSize
            ctxRef.current = ctx
          }
        } else {
          canvas.width = 1220
          canvas.height = 901
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.globalAlpha = lineOpacity
          ctx.strokeStyle = currentColor
          ctx.lineWidth = currentSize
          ctxRef.current = ctx
        }

        setAlertModal(false)
      }

      fetchImageData()
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      snapshotImage.clear()
      setIsPushBlank(true)
      setClear(false)
      canvas.width = 1220
      canvas.height = 901
      // canvas settings whenever updates
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalAlpha = lineOpacity
      ctx.strokeStyle = currentColor
      ctx.lineWidth = currentSize
      ctxRef.current = ctx
    }
  }, [security])

  /**
   * @params mouse event
   * @description Function for starting the drawing
   * @return void
   */

  useEffect(() => {
    if (security === 'Public') {
      socket.on('drawingResponse', (data) => {
        handleDrawingResponse(data)
      })

      socket.on('mouseMoving', (data) => {
        const updatedMousePos = data
        delete updatedMousePos[socket.id]
        setMousePos(updatedMousePos)
      })

      socket.on('changeBackgroundColor', (data) => {
        setBackgroundColor(data)
      })

      socket.on('clear', () => { setClear(true) })

      return () => {
        socket.off('drawing')
        socket.off('mouseMoving')
        socket.off('clear')
      }
    } else {
      socket.off('drawing')
      socket.off('mouseMoving')
      socket.off('clear')
    }
  }, [security])

  const sendDrawingData = (data) => {
    console.log(data);
    socket.emit('drawing', data)
  }

  const sendMousePosData = (data) => {
    socket.emit('mouseMoving', data)
  }

  const throttledSendDrawingData = throttle(sendDrawingData, 50)
  const throttledMousePosData = throttle(sendMousePosData, 50)

  const handleDrawingResponse = (data) => {

    const currentPos = {
      nativeEvent: {
        offsetX: data.currentX * canvasRef.current.width,
        offsetY: data.currentY * canvasRef.current.height
      }
    }

    switch (data.type) {
      case 'Normal':
        drawBrush(
          currentPos,
          ctxRef,
          data.prevX * canvasRef.current.width,
          data.prevY * canvasRef.current.height,
          data
        )
        break
      case 'Eraser':
        drawEraser(currentPos, ctxRef, data.prevX * canvasRef.current.width, data.prevY * canvasRef.current.height, data)
        break
      case 'BsSquare':
        drawRect(currentPos, ctxRef, data.prevX * canvasRef.current.width, data.prevY * canvasRef.current.height, data)
        break
      case 'BsCircle':
        drawCircle(currentPos, ctxRef, data.prevX * canvasRef.current.width, data.prevY * canvasRef.current.height, data)
        break
      case 'BsTriangle':
        drawTriangle(currentPos, ctxRef, data.prevX * canvasRef.current.width, data.prevY * canvasRef.current.height, data)
        break
      case 'BsSlashLg':
        drawLine(currentPos, ctxRef, data.prevX * canvasRef.current.width, data.prevY * canvasRef.current.height, data)
        break
      default:
        break
    }
    setIsPushBlank(true)
  }

  const startDrawing = e => {
    if (isPushBlank) {
      snapshotImage.addSnapshot(
        ctxRef.current.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )
      )
      setIsPushBlank(false)
    }

    if (address) {
      setIsDrawing(true)
      setPrevMouseX(e.nativeEvent.offsetX)
      setPrevMouseY(e.nativeEvent.offsetY)
    } else {
      setAlertMessage('Please connect your wallet')
      setAlertModal(true)
    }
  }

  /**
   * @description when drawing, handle function
   * @param {event} e
   * @returns void
   */

  const draw = e => {

    setCurrentMouseX(e.nativeEvent.offsetX)
    setCurrentMouseY(e.nativeEvent.offsetY)

    const mousePosData = {
      currentMouseX: e.nativeEvent.offsetX / canvasRef.current.width,
      currentMouseY: e.nativeEvent.offsetY / canvasRef.current.height,
      currentSize: currentSize,
      currentColor: currentColor,
      currentTool: currentTool,
      address: ensName ?? address
    }

    if (security === 'Public') {
      throttledMousePosData(mousePosData)
    }

    //draw only drawing is true
    if (!isDrawing) {
      return
    }
    // when the return value of getSnapShot function is null, not perform

    if (['Normal', 'Eraser'].includes(currentTool)) {
      const data = {
        type: currentTool,
        globalAlpha: lineOpacity,
        strokeStyle: currentColor,
        lineWidth: currentSize,
        currentX: e.nativeEvent.offsetX / canvasRef.current.offsetWidth,
        currentY: e.nativeEvent.offsetY / canvasRef.current.offsetHeight,
        canvasWidth: canvasRef.current.offsetWidth,
        canvasHeight: canvasRef.current.offsetHeight,
        prevX: prevMouseX / canvasRef.current.offsetWidth,
        prevY: prevMouseY / canvasRef.current.offsetHeight
      }

      if (security === 'Public') {
        throttledSendDrawingData(data)
      }
    } else {
      if (snapshotImage.getSnapshot()) {
        ctxRef.current.putImageData(snapshotImage.getSnapshot(), 0, 0) // adding copied canvas data on to this canvas
      }
    }

    // according to tool kinds, select draw function
    const style = {
      strokeStyle: currentColor,
      globalAlpha: lineOpacity,
      lineWidth: currentSize
    }
    if (currentTool === 'Normal') {
      drawBrush(e, ctxRef, prevMouseX, prevMouseY, style)
      setPrevMouseX(e.nativeEvent.offsetX)
      setPrevMouseY(e.nativeEvent.offsetY)

    } else if (currentTool === 'Eraser') {
      drawEraser(e, ctxRef, prevMouseX, prevMouseY, style)
      setPrevMouseX(e.nativeEvent.offsetX)
      setPrevMouseY(e.nativeEvent.offsetY)
    } else if (currentTool === 'BsSquare') {
      drawRect(e, ctxRef, prevMouseX, prevMouseY, style)
    } else if (currentTool === 'BsCircle') {
      drawCircle(e, ctxRef, prevMouseX, prevMouseY, style)
    } else if (currentTool === 'BsTriangle') {
      drawTriangle(e, ctxRef, prevMouseX, prevMouseY, style)
    } else if (currentTool === 'BsSlashLg') {
      drawLine(e, ctxRef, prevMouseX, prevMouseY, style)
    }
  }

  /**
   * @description Function for ending the drawing
   * @params void
   * @returns void
   */
  const endDrawing = (e) => {
    // save and push to snapshotArray the last image
    if (!['Normal', 'Eraser'].includes(currentTool)) {
      // setIsNewDrawing(prev => !prev)
      const data = {
        type: currentTool,
        globalAlpha: lineOpacity,
        strokeStyle: currentColor,
        lineWidth: currentSize,
        canvasWidth: canvasRef.current.width,
        canvasHeight: canvasRef.current.height,
        currentX: e.nativeEvent.offsetX / canvasRef.current.width,
        currentY: e.nativeEvent.offsetY / canvasRef.current.height,
        prevX: prevMouseX / canvasRef.current.width,
        prevY: prevMouseY / canvasRef.current.height
      }
      if (security === 'Public') {
        throttledSendDrawingData(data)
      }
    }

    snapshotImage.addSnapshot(
      ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )
    )
    setIsDrawing(false)

    if (security === 'Public') {
      const imageData = ctxRef.current.canvas.toDataURL()
      socket.emit('endDrawing', imageData)
    }
  }

  /**
   * @description when mouse pointer is out of canvas, function which is same as endDrawing
   * @params void
   * @returns void
   */
  const areaOut = () => {
    setIsDrawing(false)
    setAreaFocus(false)
    if (security === 'Public') {
      socket.emit('mouseFocusOut')
    }
  }

  /**
   * @description when mouse pointer is in of canvas
   * @params void
   * @returns void
   */
  const areaOver = () => {
    setAreaFocus(true)
  }


  /**
   * @description when click mint button, perform this function
   * @params void
   * @return void
   */
  const MintNft = async canvasRef => {
    try {
      if (address) {
        const canvas = canvasRef.current

        canvas.toBlob(async blob => {
          try {
            setLoadingModal(true)
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
            const signer = provider.getSigner()
            const nftContract = new ethers.Contract(contractAddress, abiFile.abi, signer)
            const metadata = await uploadToNFTStorage(blob)
            const ipfsMetadataUrl = 'https://nftstorage.link/ipfs/' + metadata.url.slice(7)
            setNftMetadataURL(ipfsMetadataUrl)
            const mintingFee = await nftContract.getMintingFee()
            if (parseFloat(balance.data.formatted) < mintingFee.toNumber() / 10 ** 18) {
              setLoadingModal(false)
              setAlertMessage('Minting failed because of insufficient balance in your wallet')
              setAlertModal(true)
              return
            }

            const mint_tx = await nftContract.mintNFT(`${ipfsMetadataUrl}`, { value: mintingFee })
            await mint_tx.wait()
            setLoadingModal(false)
            setAlertMessage('Minted successfully')
            setAlertModal(true)
          } catch (error) {
            setLoadingModal(false)
            console.error(error)
            setAlertMessage('Minting failed')
            setAlertModal(true)
          }
        })
      } else {
        setAlertModal(true)
        setLoadingModal(false)
        return
      }
    } catch (err) {
      console.log(err)
      setLoadingModal(false)
    }
  }

  /**
   * @description NFT.storage upload funtion
   * @param {*} blob
   * @returns
   */
  const getCurrentDate = () => {
    const currentDate = new Date();
    // Get the various components of the date
    const year = currentDate.getFullYear() % 100
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()

    // Create a formatted string with the current date and time
    const formattedDateTime = `${month}/${day}/${year}`
    return formattedDateTime
  }

  const uploadToNFTStorage = async blob => {
    try {
      const currentDate = getCurrentDate();

      const client = new NFTStorage({ token: NFT_STORAGE_API_KEY })
      const metadata = await client.store({
        name: currentDate,
        description: 'Created with SupDucks Painter on Base at https://painter.supducks.com | Built my MegaVolt Corp. 2024',
        image: new File(
          [blob],
          `SupDucksPainter${Date.now()}.png`,
          { type: 'image/png' }
        ),
        artist: ensName ?? address,
        canvas: 'SupDucks Painter'
      })

      console.log('NFT uploaded:', metadata)
      return metadata
    } catch (error) {
      console.error('Error uploadingModal NFT:', error)
      throw new Error('Failed to upload to NFT.storage')
    }
  }

  return (
    <>
      <div className='relative w-full h-[901px] rounded-xl border-black border-[2px]  bg-[url("assets/image/painter-bg.png")] bg-cover max-sm2:-order-1 overflow-x-auto overflow-y-hidden'>
        <canvas
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          onMouseOut={areaOut}
          onMouseOver={areaOver}
          ref={canvasRef}
          className={`${areaFocus ? 'cursor-none' : ''} absolute z-0`}
        />
        <CustomCursor
          keys={address}
          currentMouseX={currentMouseX}
          currentMouseY={currentMouseY}
          areaFocus={areaFocus}
          currentSize={currentSize}
          currentColor={currentColor}
          currentTool={currentTool}
          address={ensName ?? address}
        />
        {
          mousePos ?
            Object.keys(mousePos).map(item => (
              <CustomCursor
                currentMouseX={mousePos[item].currentMouseX * canvasRef.current.width}
                currentMouseY={mousePos[item].currentMouseY * canvasRef.current.height}
                currentSize={mousePos[item].currentSize}
                currentColor={mousePos[item].currentColor}
                currentTool={mousePos[item].currentTool}
                address={mousePos[item].address}
                areaFocus={true}
              />
            ))
            :
            null
        }
      </div>
      <img
          src={DuckOutline}
          alt='DuckOutline'
          className='absolute top-0 right-2 w-[150px] 2xs:w-[200px] sm2:w-[250px] disableDrag'
        />
      <img
        src={MintBtn}
        alt='MintBtn'
        className='absolute -bottom-8 sm2:-bottom-10 right-8 sm2:right-14 w-[60px] sm2:w-[90px] cursor-pointer disableDrag z-10'
        onClick={() => MintNft(canvasRef)}
      />
      <img
        src={DownBtn}
        alt='DownBtn'
        className='absolute -bottom-8 sm2:-bottom-10 right-24 sm2:right-36  w-[60px] sm2:w-[90px] cursor-pointer disableDrag z-10'
        onClick={() => downloadClick(canvasRef)}
      />
    </>
  )
}
export default DrawingArea
