import React from 'react'

export const Button = ({
  text,
  clickEvent = () => {},
  className = '' // Provide default empty string
}) => {
  return (
    <button
      onClick={clickEvent}
      className={`flex items-center justify-center font-Barlow text-white uppercase ${className}`}
    >
      {text}
    </button>
  )
}

export default Button
