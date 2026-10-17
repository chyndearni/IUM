import Footer from '@/components/landing-page/Footer'
import Navbar from '@/components/landing-page/Navbar'
import React from 'react'

export default function HomeLayout({children} : {children : React.ReactNode}) {
  return (
    <div>
      <Navbar/>
        <div className="mt-16 pb-16 sm:py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      <Footer/>
    </div>
  )
}
