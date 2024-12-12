
export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tl from-red-800 to-rose-800 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <div className="inline-block p-4 bg-red-600 rounded-full shadow-lg mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 110-20 10 10 0 010 20z"
              clipRule="evenodd"
            />
            <path d="M10 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" />
            <path d="M10 13a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold drop-shadow-lg mb-4">¡Error!</h1>
        <p className="text-lg text-gray-200 mb-4 font-bold">
          Hubo un problema al verificar tu cuenta. Por favor, intenta de nuevo más tarde.
        </p>
      </div>
    </div>
  );
}
