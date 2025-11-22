import { useEffect, useRef, useState, useCallback } from 'react';
import { JitsiClient } from '../services/jitsiClient';

export interface UseJitsiOptions {
  roomName: string;
  domain: string;
  visible: boolean;
  userName?: string;
  onReady?: () => void;
  onJoined?: () => void;
  onLeft?: () => void;
  onError?: (error: any) => void;
  onAudioMuteChanged?: (muted: boolean) => void;
  onVideoMuteChanged?: (muted: boolean) => void;
}

export interface UseJitsiReturn {
  jitsiClient: JitsiClient | null;
  isInitialized: boolean;
  isJoined: boolean;
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleScreenshare: () => void;
  leave: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useJitsi({
  roomName,
  domain,
  visible,
  userName,
  onReady,
  onJoined,
  onLeft,
  onError,
  onAudioMuteChanged,
  onVideoMuteChanged,
}: UseJitsiOptions): UseJitsiReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiClientRef = useRef<JitsiClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  
  // Almacenar callbacks en refs para evitar reinicializaciones
  const callbacksRef = useRef({ onReady, onJoined, onLeft, onError });
  useEffect(() => {
    callbacksRef.current = { onReady, onJoined, onLeft, onError };
  }, [onReady, onJoined, onLeft, onError]);

  const loadJitsiScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.JitsiMeetExternalAPI) {
        resolve();
        return;
      }

      const protocol = domain.includes('localhost') || domain.includes('127.0.0.1') ? 'http' : 'https';
      const script = document.createElement('script');
      const scriptUrl = `${protocol}://${domain}/external_api.js`;
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        console.error(`Error al cargar Jitsi desde: ${scriptUrl}`);
        reject(new Error(`Error al cargar Jitsi Meet External API desde ${scriptUrl}. Verifica que el servidor Jitsi esté corriendo.`));
      };
      document.head.appendChild(script);
    });
  }, [domain]);

  const initializeJitsi = useCallback(async () => {
    console.log('initializeJitsi llamado:', {
      containerRef: !!containerRef.current,
      visible,
      clienteExistente: !!jitsiClientRef.current,
      containerDimensions: containerRef.current ? {
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      } : 'no disponible'
    });
    
    if (!containerRef.current) {
      console.warn('No se puede inicializar: containerRef.current no está disponible');
      return;
    }
    
    if (!visible) {
      console.warn('No se puede inicializar: visible es false');
      return;
    }
    
    if (jitsiClientRef.current) {
      console.log('No se puede inicializar: ya hay un cliente existente');
      return;
    }

    try {
      await loadJitsiScript();

      // El dominio completo se usa para cargar el script, pero JitsiClient extraerá solo el hostname
      const client = new JitsiClient(
        domain,
        roomName,
        containerRef.current,
        {
          serviceUrl: domain.includes('localhost') || domain.includes('127.0.0.1') 
            ? `http://${domain}` 
            : `https://${domain}`,
          userName: userName,
        },
        {},
        {
          onAudioMuteChanged,
          onVideoMuteChanged,
        }
      );

      const api = await client.init();
      jitsiClientRef.current = client;
      setIsInitialized(true);
      console.log('✅ JitsiClient inicializado y guardado en ref:', {
        tieneCliente: !!jitsiClientRef.current,
        tieneAPI: !!client.getAPI(),
        isInitialized: true
      });

      api.addEventListener('videoConferenceJoined', () => {
        setIsJoined(true);
        callbacksRef.current.onJoined?.();
      });

      api.addEventListener('videoConferenceLeft', () => {
        setIsJoined(false);
        callbacksRef.current.onLeft?.();
      });

      callbacksRef.current.onReady?.();
    } catch (error) {
      console.error('Error al inicializar Jitsi:', error);
      callbacksRef.current.onError?.(error);
    }
  }, [roomName, domain, visible, loadJitsiScript, userName]);

  const destroyJitsi = useCallback(() => {
    if (jitsiClientRef.current) {
      console.log('🗑️ Destruyendo JitsiClient');
      jitsiClientRef.current.dispose();
      jitsiClientRef.current = null;
      setIsInitialized(false);
      setIsJoined(false);
      console.log('✅ JitsiClient destruido');
    } else {
      console.log('⚠️ destroyJitsi llamado pero no hay cliente para destruir');
    }
  }, []);

  useEffect(() => {
    console.log('useEffect de useJitsi ejecutado:', {
      visible,
      tieneCliente: !!jitsiClientRef.current,
      tieneContenedor: !!containerRef.current,
      containerDimensions: containerRef.current ? {
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      } : 'no disponible'
    });
    
    if (visible && !jitsiClientRef.current) {
      console.log('🟢 Inicializando Jitsi (visible=true, no hay cliente)');
      // Dar tiempo para que el contenedor esté disponible y tenga dimensiones
      const checkAndInit = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          const height = containerRef.current.offsetHeight;
          console.log('Dimensiones del contenedor:', { width, height });
          
          if (width > 0 && height > 0) {
            console.log('✅ Contenedor tiene dimensiones válidas, inicializando...');
            initializeJitsi();
          } else {
            console.log('⏳ Contenedor aún no tiene dimensiones válidas, reintentando...');
            setTimeout(checkAndInit, 200);
          }
        } else {
          console.log('⏳ Contenedor aún no disponible, reintentando...');
          setTimeout(checkAndInit, 200);
        }
      };
      
      const timeoutId = setTimeout(checkAndInit, 100);
      
      return () => {
        clearTimeout(timeoutId);
      };
    } else if (!visible && jitsiClientRef.current) {
      console.log('🔴 NO destruyendo Jitsi aunque visible=false (mantener cliente para controles)');
      // NO destruir el cliente cuando visible=false para mantener los controles funcionando
      // Solo destruir cuando el componente se desmonte completamente
    }

    // No destruir en el cleanup - mantener el cliente disponible
    return () => {
      console.log('🧹 Cleanup de useEffect, visible:', visible);
      // Solo destruir si el componente se desmonta completamente (visible cambia a false permanentemente)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]); // Solo dependemos de visible para evitar reinicializaciones

  const toggleMic = useCallback(() => {
    console.log('useJitsi.toggleMic() llamado, cliente disponible:', !!jitsiClientRef.current);
    console.log('Estado completo:', {
      tieneCliente: !!jitsiClientRef.current,
      isInitialized,
      isJoined,
      visible,
      containerRef: !!containerRef.current
    });
    if (jitsiClientRef.current) {
      jitsiClientRef.current.toggleMic();
    } else {
      console.warn('JitsiClient no disponible en toggleMic - intentando acceder directamente a la API del iframe');
      // Intentar acceder directamente a la API del iframe como fallback
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe?.contentWindow) {
        try {
          // Intentar ejecutar el comando directamente en el iframe
          console.log('Intentando acceder a la API del iframe directamente');
        } catch (error) {
          console.error('Error al acceder al iframe:', error);
        }
      }
    }
  }, [isInitialized, isJoined, visible]);

  const toggleCamera = useCallback(() => {
    console.log('useJitsi.toggleCamera() llamado, cliente disponible:', !!jitsiClientRef.current);
    if (jitsiClientRef.current) {
      jitsiClientRef.current.toggleCamera();
    } else {
      console.warn('JitsiClient no disponible en toggleCamera');
    }
  }, []);

  const toggleScreenshare = useCallback(() => {
    console.log('useJitsi.toggleScreenshare() llamado, cliente disponible:', !!jitsiClientRef.current);
    if (jitsiClientRef.current) {
      jitsiClientRef.current.toggleScreenshare();
    } else {
      console.warn('JitsiClient no disponible en toggleScreenshare');
    }
  }, []);

  const leave = useCallback(() => {
    jitsiClientRef.current?.leave();
  }, []);

  return {
    jitsiClient: jitsiClientRef.current,
    isInitialized,
    isJoined,
    toggleMic,
    toggleCamera,
    toggleScreenshare,
    leave,
    containerRef,
  };
}

