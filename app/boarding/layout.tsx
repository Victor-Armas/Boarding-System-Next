import NavMenu from "@/components/NavMenu";
import ToastNotification from "@/components/ui/ToastNotification";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="bg-gradient-to-r from-rose-600 to-red-600 py-5">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between px-10 items-center">
          <h1 className="font-bold text-white uppercase text-4xl">
            <Link
            href={'/boarding'}
            >Boarding System</Link>
            
          </h1>
          <NavMenu />
        </div>
      </header>

      <section className=" max-w-screen-2xl mx-auto mt-10 p-5">
        {children}
      </section>

      <footer className=" py-5  w-full flex justify-around mt-14 text-gray-500">
        <p className="text-center">
          Todos los derechos reservados {new Date().getFullYear()}
        </p>

        <p className="text-center ">Dev: Victor Jesús Garzón Armas</p>
      </footer>

      <ToastNotification/>
    </>
  );
}
