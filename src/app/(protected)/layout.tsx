import React from 'react'
import Header from '../components/Header'

const layout = ({children} : Readonly<{children : React.ReactNode}>) => {
  return (
    <div>
      <Header/>
      {children}
    </div>
  )
}

export default layout
