import React from 'react'

type Size = 'small' | 'medium' | 'large' | number

interface SpinnerProps {
  size?: Size
  text?: string
}

const sizeClass = (size: Size) => (typeof size === 'number' ? '' : `ui-spinner--${size}`)

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', text }) => {
  const modifier = sizeClass(size)

  return (
    <div className={`ui-spinner ${modifier}`} role={text ? 'img' : undefined} aria-label={text ?? 'Loading'}>
      <svg viewBox="0 0 50 50" aria-hidden={text ? 'false' : 'true'}>
        <circle className="ui-spinner__circle" cx="25" cy="25" r="20" />
      </svg>
      {text ? <span className="ui-spinner__label">{text}</span> : null}
    </div>
  )
}

export default Spinner
