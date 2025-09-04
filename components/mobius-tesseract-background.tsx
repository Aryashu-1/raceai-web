"use client"

export function MobiusTesseractBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[800px] h-[400px]">
          {/* Möbius strip ellipse */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-spin-slow">
            <div className="absolute inset-2 rounded-full border border-blue-300/20 animate-spin-reverse">
              <div className="absolute inset-4 rounded-full border border-blue-200/10 animate-spin-slow">
                {/* Flowing light effect */}
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-400 rounded-full blur-sm animate-orbit">
                  <div className="absolute inset-0 bg-blue-300 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute top-1/2 right-0 w-3 h-3 bg-blue-300 rounded-full blur-sm animate-orbit-reverse">
                  <div className="absolute inset-0 bg-blue-200 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full blur-sm animate-orbit">
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-32 h-32 animate-float">
              {/* Outer cube */}
              <div className="absolute inset-0 border-2 border-blue-400/40 transform rotate-12 animate-spin-slow">
                <div className="absolute inset-2 border border-blue-300/30 transform -rotate-6 animate-spin-reverse">
                  {/* Inner cube */}
                  <div className="absolute inset-4 border border-blue-200/20 transform rotate-3 animate-spin-slow">
                    {/* Core light */}
                    <div className="absolute inset-6 bg-blue-400/20 rounded-sm animate-pulse">
                      <div className="absolute inset-1 bg-blue-300/30 rounded-sm animate-pulse-slow"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting lines for 4D effect */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-blue-400/30 transform -translate-x-2 -translate-y-2"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-blue-400/30 transform translate-x-2 -translate-y-2"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-blue-400/30 transform -translate-x-2 translate-y-2"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-blue-400/30 transform translate-x-2 translate-y-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 left-20 w-16 h-16 opacity-20 animate-float-slow">
        <div className="w-full h-full border-2 border-blue-300 rounded-full relative">
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-2 left-1/2 w-1 h-1 bg-blue-300 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-blue-300 rounded-full transform -translate-x-1/2"></div>
        </div>
      </div>

      <div className="absolute top-40 right-32 w-12 h-12 opacity-15 animate-float-reverse">
        <div className="w-full h-full relative">
          <div className="absolute inset-0 border border-blue-300 transform rotate-45"></div>
          <div className="absolute inset-2 border border-blue-400 transform -rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-500 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      <div className="absolute bottom-32 left-40 w-20 h-20 opacity-10 animate-spin-very-slow">
        <div className="w-full h-full border border-blue-200 rounded-full relative">
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-blue-300 to-transparent transform -translate-x-1/2"></div>
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent transform -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  )
}
