import React, { ReactNode } from "react"
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineDangerous } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";

type AlertProps = {
    variant?: 'success'|'danger'|'warning'
    children: ReactNode
}

export default function Alert({variant = "success", children} : AlertProps) {

    const  classVariants = {
        success: "p-4 shadow inline-block max-w-7xl bg-green-300 text-green-900 rounded-md m-2",
        danger: "p-4 shadow inline-block max-w-7xl bg-red-300 text-red-900 rounded-md m-2",
        warning: "p-4 shadow inline-block max-w-7xl bg-yellow-300 text-yellow-900 rounded-md m-2"
    }

  return (
    <div className={classVariants[variant] + 'flex justify-between gap-2 max-w-7xl'}>
      <span className="text-2xl ">
        {variant === 'success' ? (
          <FaRegCircleCheck/>
        ): variant === 'danger' ? (
          <MdOutlineDangerous/>
        ): (
          <IoWarningOutline/>
        )}
      </span>
      <p>
        {children}
      </p>
      </div>
  )
}
