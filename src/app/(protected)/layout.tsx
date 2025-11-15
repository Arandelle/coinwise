import React from 'react'
import Header from '../components/Header'
import AIChatWidget from '../components/AIChat'

const layout = ({children} : Readonly<{children : React.ReactNode}>) => {
  return (
    <div>
      <Header/>
      {children}
      <AIChatWidget />
    </div>
  )
}

export default layout
