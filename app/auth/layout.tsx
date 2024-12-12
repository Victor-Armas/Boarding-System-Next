import ToastNotification from "@/components/ui/ToastNotification";


export default function layouth({children,}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>  
        <div className="bg-gradient-to-tl from-red-800 to-rose-800 min-h-screen">

          {children}
        </div>

        <ToastNotification/>
    </>
  )
}
