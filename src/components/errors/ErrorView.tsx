import { AlertTriangle, Home, RefreshCw, Hexagon } from 'lucide-react';

interface ErrorViewProps {
  error?: Error;
  resetError?: () => void;
  showActions?: boolean;
  title?: string;
  message?: string;
}

export function ErrorView({ error, resetError, showActions = true, title, message }: ErrorViewProps) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated hexagon pattern background */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <Hexagon
            key={i}
            className="absolute text-amber-400"
            style={{
              width: `${Math.random() * 60 + 40}px`,
              height: `${Math.random() * 60 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-4xl w-full relative z-10">
        {/* Large 404 with hexagon decorations */}
        <div className="text-center mb-12 relative">
          {/* Decorative hexagons around 404 */}
          <div className="absolute -top-10 left-1/4 opacity-20">
            <Hexagon className="w-16 h-16 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div className="absolute -bottom-10 right-1/4 opacity-20">
            <Hexagon className="w-20 h-20 text-yellow-400 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          </div>
          
          {/* Main 404 number */}
          <div className="relative inline-block">
            <h1 className="text-[180px] leading-none tracking-tighter bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
              {title || '404'}
            </h1>
            {/* Glow effect behind text */}
            <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-amber-400 to-yellow-500" />
          </div>
        </div>

        {/* Central hexagon icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Multiple glowing layers */}
            <div className="w-32 h-32 bg-gradient-to-br from-amber-400/30 to-yellow-500/30 opacity-50 blur-2xl rounded-full absolute inset-0 animate-pulse" />
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400/50 to-yellow-500/50 opacity-70 blur-xl rounded-full absolute inset-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Main hexagon container */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl flex items-center justify-center shadow-2xl border border-amber-500/20">
              <AlertTriangle className="w-12 h-12 text-amber-400 animate-pulse" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl text-white">
            Lost in the Hive?
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            {message || "The page you're looking for has flown away from the hive. Let's get you back to the colony."}
          </p>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <Hexagon className="w-4 h-4 text-amber-500" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          
          {/* Error details (only in development) */}
          {error && process.env.NODE_ENV === 'development' && showActions && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-left backdrop-blur-sm">
              <p className="text-xs text-red-300 mb-2">Error Details (dev only):</p>
              <pre className="text-xs text-red-200 overflow-auto max-h-32">
                {error.message}
              </pre>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button
                onClick={handleRefresh}
                className="group px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-900 rounded-2xl hover:from-amber-300 hover:to-yellow-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={handleGoHome}
                className="px-8 py-4 bg-zinc-800/50 text-white rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 border border-zinc-700 backdrop-blur-sm hover:scale-105"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-zinc-500 mt-12">
              Need help? Contact the Hive Queen for support
            </p>
          </>
        )}
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}