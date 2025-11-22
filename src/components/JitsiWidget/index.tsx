import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Minimize2, Maximize2, X, Video, VideoOff, Mic, MicOff, MonitorUp, MonitorX } from 'lucide-react';
import { useJitsi } from '../../hooks/useJitsi';

export interface JitsiWidgetProps {
  roomName: string;
  visible: boolean;
  userName?: string;
  onClose?: () => void;
  className?: string;
  onAudioMuteChanged?: (muted: boolean) => void;
  onVideoMuteChanged?: (muted: boolean) => void;
}

export interface JitsiWidgetRef {
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleScreenshare: () => void;
  leave: () => void;
}

const JITSI_DOMAIN = import.meta.env.VITE_JITSI_DOMAIN || 'localhost:8000';


export const JitsiWidget = forwardRef<JitsiWidgetRef, JitsiWidgetProps>(
  ({ roomName, visible, userName = 'jomel', onClose, className = '', onAudioMuteChanged, onVideoMuteChanged }, ref) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    
    const {
      containerRef,
      isInitialized,
      isJoined,
      toggleMic,
      toggleCamera,
      toggleScreenshare,
      leave,
    } = useJitsi({
      roomName,
      domain: JITSI_DOMAIN,
      visible: visible,
      userName: userName,
      onReady: () => {

        setTimeout(() => setShowLoading(false), 500);
      },
      onJoined: () => {
        console.log('Unido a la reunión:', roomName);
        setShowLoading(false);
      },
      onLeft: () => {
        console.log('Salido de la reunión:', roomName);
      },
      onError: (error) => {
        console.error('Error en Jitsi:', error);
        console.error('Dominio configurado:', JITSI_DOMAIN);
        setShowLoading(false);
        alert(`Error al conectar con Jitsi: ${error.message || error}. Verifica que el servidor esté corriendo en ${JITSI_DOMAIN}`);
      },
      onAudioMuteChanged,
      onVideoMuteChanged,
    });

    // Ocultar el overlay cuando el iframe esté presente
    useEffect(() => {
      if (containerRef.current) {
        const checkIframe = () => {
          const iframe = containerRef.current?.querySelector('iframe');
          if (iframe && isInitialized) {
            // Si el iframe está presente y Jitsi está inicializado, ocultar el overlay
            setTimeout(() => setShowLoading(false), 100);
          }
        };
        
        // Verificar periódicamente
        const interval = setInterval(checkIframe, 500);
        // También verificar después de un tiempo máximo
        const timeout = setTimeout(() => setShowLoading(false), 3000);
        
        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    }, [containerRef, isInitialized]);

    useImperativeHandle(ref, () => ({
      toggleMic: () => {
        console.log('toggleMic llamado desde ref');
        toggleMic();
      },
      toggleCamera: () => {
        console.log('toggleCamera llamado desde ref');
        toggleCamera();
      },
      toggleScreenshare: () => {
        console.log('toggleScreenshare llamado desde ref');
        toggleScreenshare();
      },
      leave: () => {
        console.log('leave llamado desde ref');
        leave();
      },
    }), [toggleMic, toggleCamera, toggleScreenshare, leave]);

    // Resetear el estado de carga cuando el componente se oculta
    useEffect(() => {
      if (!visible) {
        setShowLoading(true);
      }
    }, [visible]);

    if (!visible) {
      return null;
    }

    const handleLeave = () => {
      leave();
      onClose?.();
    };

    return (
      <div
        className={`bg-white border border-slate-300 rounded-lg shadow-lg flex flex-col overflow-hidden ${className}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          maxWidth: '100%', 
          maxHeight: '100%',
          minHeight: '500px'
        }}
      >
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-medium">
              Reunión: {roomName}
            </span>
            {isJoined && (
              <span className="text-xs text-green-400 px-2 py-0.5 bg-green-900/30 rounded">
                Conectado
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"
              title={isMinimized ? 'Maximizar' : 'Minimizar'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleLeave}
              className="h-8 w-8 rounded flex items-center justify-center text-red-400 hover:bg-red-900/30 transition-colors"
              title="Salir de la reunión"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>

            <div
              ref={containerRef}
              className="flex-1 relative w-full h-full"
              style={{
                minHeight: '400px',
                minWidth: '800px', // Asegurar ancho mínimo para inicialización
                display: isMinimized ? 'none' : 'block',
                overflow: 'hidden', 
                position: 'relative',
              }}
            >
              {showLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-slate-600">Cargando reunión...</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {isMinimized && (
          <div className="px-4 py-2 text-sm text-slate-600 text-center">
            Reunión minimizada - Haz clic en maximizar para continuar
          </div>
        )}
      </div>
    );
  }
);

JitsiWidget.displayName = 'JitsiWidget';

