/**
 * @description Draw brush function
 * @param {*} e 
 * @param {*} ctxRef 
 */
export const drawBrush = (e, ctxRef, prevMouseX, prevMouseY, style) => {
    ctxRef.current.beginPath()
    ctxRef.current.strokeStyle = style.strokeStyle
    ctxRef.current.globalAlpha = style.globalAlpha
    ctxRef.current.lineWidth = style.lineWidth

    ctxRef.current.moveTo(prevMouseX, prevMouseY)
    ctxRef.current.lineTo(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
    );
    ctxRef.current.stroke()
    ctxRef.current.closePath()
}

/**
 * @description Draw eraser function
 * @param {*} e 
 * @param {*} ctxRef 
 */
export const drawEraser = (e, ctxRef, prevMouseX, prevMouseY, style) => {
    ctxRef.current.beginPath()
    ctxRef.current.globalCompositeOperation = 'destination-out';
    ctxRef.current.strokeStyle = style.strokeStyle
    ctxRef.current.globalAlpha = style.globalAlpha
    ctxRef.current.lineWidth = style.lineWidth

    ctxRef.current.moveTo(prevMouseX, prevMouseY)
    ctxRef.current.lineTo(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
    );
    ctxRef.current.stroke()
    ctxRef.current.closePath()
    ctxRef.current.globalCompositeOperation = 'source-over'
}

/**
 * @description Draw Rect function
 * @param {*} e 
 * @param {*} ctxRef 
 * @param {*} prevMouseX 
 * @param {*} prevMouseY 
 */
export const drawRect = (e, ctxRef, prevMouseX, prevMouseY, style) => {
    ctxRef.current.beginPath()
    ctxRef.current.strokeStyle = style.strokeStyle
    ctxRef.current.globalAlpha = style.globalAlpha
    ctxRef.current.lineWidth = style.lineWidth
    ctxRef.current.strokeRect(e.nativeEvent.offsetX, e.nativeEvent.offsetY, prevMouseX - e.nativeEvent.offsetX, prevMouseY - e.nativeEvent.offsetY);
    ctxRef.current.closePath()
}

/**
 * @description Draw circle function
 * @param {*} e 
 * @param {*} ctxRef 
 * @param {*} prevMouseX 
 * @param {*} prevMouseY 
 */
export const drawCircle = (e, ctxRef, prevMouseX, prevMouseY, style) => {
    ctxRef.current.beginPath();
    ctxRef.current.strokeStyle = style.strokeStyle
    ctxRef.current.globalAlpha = style.globalAlpha
    ctxRef.current.lineWidth = style.lineWidth
    let radius = Math.sqrt(Math.pow((prevMouseX - e.nativeEvent.offsetX), 2) + Math.pow((prevMouseY - e.nativeEvent.offsetY), 2));
    ctxRef.current.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    ctxRef.current.stroke();
    ctxRef.current.closePath()
}

/**
 * @description Draw Triangle function
 * @param {*} e 
 * @param {*} ctxRef 
 * @param {*} prevMouseX 
 * @param {*} prevMouseY 
 */
export const drawTriangle = (e, ctxRef, prevMouseX, prevMouseY, style) => {
    ctxRef.current.beginPath(); // creating new path to draw circle
    ctxRef.current.strokeStyle = style.strokeStyle
    ctxRef.current.globalAlpha = style.globalAlpha
    ctxRef.current.lineWidth = style.lineWidth
    ctxRef.current.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); // creating first line according to the mouse pointer
    ctxRef.current.lineTo(prevMouseX * 2 - e.nativeEvent.offsetX, e.nativeEvent.offsetY); // creating bottom line of triangle
    ctxRef.current.closePath(); // closing path of a triangle so the third line draw automatically
    ctxRef.current.stroke();
    ctxRef.current.closePath()
}

/**
 * @description Draw Line function
 * @param {*} e 
 * @param {*} ctxRef 
 * @param {*} prevMouseX 
 * @param {*} prevMouseY 
 */
export const drawLine = (e, ctxRef, prevMouseX, prevMouseY, style) => {
    ctxRef.current.beginPath(); // creating new path to draw circle
    ctxRef.current.strokeStyle = style.strokeStyle
    ctxRef.current.globalAlpha = style.globalAlpha
    ctxRef.current.lineWidth = style.lineWidth
    ctxRef.current.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); // creating first line according to the mouse pointer
    ctxRef.current.stroke();
    ctxRef.current.closePath(); // closing path of a triangle so the third line draw automatically
}
/**
 * @description download function
 * @param {*} canvasRef 
 */
export const downloadClick = (canvasRef) => {
    const dataUrl = canvasRef.current.toDataURL("image/jpg");
    const link = document.createElement("a");
    link.setAttribute("href", dataUrl);
    link.setAttribute("download", "image.jpg");
    link.click();
}