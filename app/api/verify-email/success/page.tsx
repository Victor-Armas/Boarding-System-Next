"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 5000); // Redirige después de 3 segundos

    return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-tl from-red-800 to-rose-800 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 4.293a1 1 0 00-1.414 0L8 11.586 4.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold drop-shadow-lg mb-4">¡Éxito!</h1>
        <p className="text-lg text-gray-200 mb-4">
          Tu cuenta ha sido verificada. Serás redirigido en unos segundos...
        </p>
        
        <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mx-auto mt-4">
          <div
            className="h-full bg-green-500 rounded-full animate-progress"
            style={{
              animationDuration: "5s",
              animationTimingFunction: "linear",
              animationFillMode: "forwards",
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
