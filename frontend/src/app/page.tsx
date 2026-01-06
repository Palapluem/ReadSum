import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] text-white">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />

      <main className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400 backdrop-blur-md">
          <span className="mr-2 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          AI-Powered Study Assistant
        </div>

        {/* Hero Text */}
        <h1 className="mb-6 text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
          Summarize. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Learn Faster.
          </span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Upload your documents and let our AI summarize them instantly. 
          Chat with your study materials like never before using Gemini 2.0.
        </p>

        {/* Buttons */}
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/login"
            className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all hover:bg-zinc-200 sm:w-auto"
          >
            <span className="mr-2">Get Started</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/register"
            className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-800 bg-black/50 px-8 font-medium text-white backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-900 sm:w-auto"
          >
            Create Account
          </Link>
        </div>

        {/* Grid / Feature Preview (Mock) */}
        <div className="mt-20 w-full rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-white/5 pb-4">
               <div className="flex gap-2">
                 <div className="h-3 w-3 rounded-full bg-red-500/50" />
                 <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                 <div className="h-3 w-3 rounded-full bg-green-500/50" />
               </div>
               <div className="h-4 w-32 rounded-full bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="h-32 rounded-lg bg-white/5 animate-pulse" />
                <div className="h-32 rounded-lg bg-white/5 animate-pulse delay-75" />
                <div className="h-32 rounded-lg bg-white/5 animate-pulse delay-150" />
                <div className="h-32 rounded-lg bg-white/5 animate-pulse delay-200" />
            </div>
        </div>
      </main>
    </div>
  );
}
