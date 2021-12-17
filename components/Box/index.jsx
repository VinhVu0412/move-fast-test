import React from 'react'

import styles from './index.module.css'

export default function Box ({ children, onClick, color }) {
  return (
    <div className={styles.wrapper}> 
      <button
        className={styles.box}
        style={{ backgroundColor: color }}
        onClick={onClick}
      > 
        { children }
      </button>
    </div>
  )
}
