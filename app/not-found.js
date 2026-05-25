import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-6">
      <div className="relative mb-6">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-white tracking-wider">Page Not Found</h2>
        </div>
      </div>
      <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
        Oops! The creator profile or page you are looking for doesn&apos;t exist, has been removed, or has changed names.
      </p>
      <Link 
        href="/" 
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-800"
      >
        <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-slate-950 rounded-md group-hover:bg-opacity-0">
          Back to Homepage
        </span>
      </Link>
    </div>
  )
}
