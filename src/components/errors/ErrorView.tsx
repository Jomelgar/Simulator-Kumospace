import { AlertTriangle, Home, RefreshCw, Hexagon } from "lucide-react";

interface ErrorViewProps {
  error?: Error;
  resetError?: () => void;
  showActions?: boolean;
  title?: string;
  message?: string;
}

export function ErrorView({
  error,
  resetError,
  showActions = true,
  title,
  message,
}: ErrorViewProps) {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(circle at top, #2b1a00 0, #050308 40%, #000000 100%)",
      }}
    >
      {/* Hexágonos de fondo */}
      <div className="absolute inset-0 opacity-25">
        {[...Array(20)].map((_, i) => (
          <Hexagon
            key={i}
            className="absolute"
            style={{
              color: "#ffc300",
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

      <div className="relative z-10 max-w-4xl w-full">
        {/* 404 gigante */}
        <div className="text-center mb-10 relative">
          <div className="relative inline-block">

            <div className="absolute inset-0 blur-[80px] opacity-70"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,195,0,1) 0, rgba(0,0,0,0) 10%)",
              }}
            />

            <span
              className="block"
              style={{
                fontSize: "220px",       // aquí mandamos el tamaño a lo bestia
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: "-0.08em",
                color: "#ffc300",
                textShadow: "0 0 60px rgba(255,195,0,0.9)",
              }}
            >
              {title || "404"}
            </span>

          </div>
        </div>

        {/* Icono central */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="absolute inset-[-30px] rounded-full blur-3xl opacity-80"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,195,0,0.6), transparent 70%)",
              }}
            />
            <div
              className="relative w-24 h-24 rounded-3xl flex items-center justify-center border"
              style={{
                background:
                  "radial-gradient(circle at top, #1b1400 0, #050308 70%)",
                borderColor: "rgba(255,195,0,0.45)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
              }}
            >
              <AlertTriangle
                className="w-12 h-12"
                style={{ color: "#ffc300" }}
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {/* Texto principal */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-semibold">Lost in the Hive?</h2>
          <p className="text-lg text-zinc-200 leading-relaxed max-w-2xl mx-auto">
            {message ||
              "The page you're looking for doesn't exist in this hive."}
          </p>

          {/* Línea decorativa */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[rgba(255,195,0,0.7)]" />
            <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "#ffc300" }} />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[rgba(255,195,0,0.7)]" />
          </div>

          {/* Detalle de error (dev) */}
          {error && process.env.NODE_ENV === "development" && showActions && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-left backdrop-blur-sm">
              <p className="text-xs text-red-300 mb-2">Error Details (dev only):</p>
              <pre className="text-xs text-red-200 overflow-auto max-h-32">
                {error.message}
              </pre>
            </div>
          )}
        </div>

        {/* Botones */}
        {showActions && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button
                onClick={handleRefresh}
                className="error-page__btn-primary flex items-center justify-center gap-3 px-8 py-4 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #ffb300, #ffde59)",
                  color: "#111827",
                  boxShadow: "0 18px 40px rgba(255,195,0,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 24px 70px rgba(255,195,0,0.55)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 18px 40px rgba(255,195,0,0.4)";
                }}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={handleGoHome}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-full border backdrop-blur-sm"
                style={{
                  background: "rgba(15,17,23,0.85)",
                  borderColor: "rgba(156,163,175,0.7)",
                  color: "#e5e7eb",
                }}
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </button>
            </div>

            <p className="text-center text-sm text-zinc-400 mt-12">
              Need help? Contact the Hive Queen for support
            </p>
          </>
        )}
      </div>

      {/* Animación de flotado */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
