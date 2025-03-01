import React, { useState } from 'react'
import UploadCtegoryModel from '../components/UploadCtegoryModel'

const CategoryPage = () => {
  const [openUploadCategory, setOtpUploadCategory] = useState(false)
  return (
    <section>
      <div className='p-2 font-semibold shadow-md bg-gray-300 flex items-center justify-between rounded'>
        <h2 className='font-semibold'>Category</h2>
        <button 
        onClick={()=> setOtpUploadCategory(true)}
        className='text-sm border border-primary-200  hover:bg-primary-200 rounded'>Add Category</button>
      </div>
      {
        openUploadCategory && (
          <UploadCtegoryModel close={()=>setOtpUploadCategory(false) } />
        )
      }

      
    </section>
  )
}

export default CategoryPage