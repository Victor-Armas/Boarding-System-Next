import React from 'react'
import { BiLike } from "react-icons/bi";

export default function NullData() {
  return (
    <div className='flex flex-col items-center my-20'>
        <BiLike className='text-emerald-600 text-9xl bg-green-600 rounded-full p-4 bg-opacity-20'/>
        <p className=' text-gray-500 mt-10 text-2xl'>Actualmente no hay ningun <span className='uppercase font-bold text-blue-700'>EFD Activo</span></p>
    </div>
  )
}
