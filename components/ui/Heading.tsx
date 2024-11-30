import React from "react";

export default function Heading({children} : {children: React.ReactNode}) {
  return (
    <h1 className="text-5xl font-black">{children}</h1>
  )
}
