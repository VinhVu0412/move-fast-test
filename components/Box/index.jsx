import React from 'react'

import styles from './index.module.css'

export default function Box ({ children, onClick, color }) {
  return (
    <button
      className={styles.box}
      style={{ backgroundColor: color }}
      onClick={onClick}
    > 
      { children }
    </button>
  )
}
