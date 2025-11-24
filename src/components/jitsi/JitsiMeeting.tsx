import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { JAAS_APP_ID, JITSI_DOMAIN } from '../../config/JitsiConfig';

interface JitsiMeetingProps {
    roomName: string;
    displayName: string;
    onMeetingEnd: () => void;
}

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

const JitsiMeeting: React.FC<JitsiMeetingProps> = ({ roomName, displayName, onMeetingEnd }) => {
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const jitsiApiRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadJitsiScript = () => {
            return new Promise<void>((resolve, reject) => {
                if (window.JitsiMeetExternalAPI) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://8x8.vc/vpaas-magic-cookie-' + JAAS_APP_ID + '/external_api.js';
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Error al cargar Jitsi API'));
                document.body.appendChild(script);
            });
        };

        const initializeJitsi = async () => {
            try {
                await loadJitsiScript();

                if (!jitsiContainerRef.current) return;

                const domain = JITSI_DOMAIN;
                const options = {
                    roomName: `${JAAS_APP_ID}/${roomName}`,
                    width: '100%',
                    height: '100%',
                    parentNode: jitsiContainerRef.current,
                    userInfo: {
                        displayName: displayName,
                    },
                    configOverwrite: {
                        startWithAudioMuted: true,
                        startWithVideoMuted: false,
                        prejoinPageEnabled: false,
                        prejoinConfig: {
                            enabled: false,
                        },
                        disableAudioLevels: true,
                        startSilent: false,
                    },
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: [
                            'microphone',
                            'camera',
                            'closedcaptions',
                            'desktop',
                            'fullscreen',
                            'fodeviceselection',
                            'hangup',
                            'profile',
                            'chat',
                            'settings',
                            'raisehand',
                            'videoquality',
                            'filmstrip',
                            'tileview',
                            'videobackgroundblur',
                        ],
                        SHOW_JITSI_WATERMARK: true,
                        SHOW_WATERMARK_FOR_GUESTS: true,
                        SHOW_BRAND_WATERMARK: false,
                        DEFAULT_LOCAL_DISPLAY_NAME: 'Yo',
                        DEFAULT_REMOTE_DISPLAY_NAME: 'Usuario',
                        MOBILE_APP_PROMO: false,
                        SHOW_CHROME_EXTENSION_BANNER: false,
                    },
                };

                const api = new window.JitsiMeetExternalAPI(domain, options);
                jitsiApiRef.current = api;

                api.executeCommand('displayName', displayName);

                api.addEventListener('videoConferenceJoined', () => {
                    console.log('Usuario se unió a la conferencia');
                    setIsLoading(false);
                });

                api.addEventListener('videoConferenceLeft', () => {
                    console.log('Usuario salió de la conferencia');
                    onMeetingEnd();
                });

                api.addEventListener('readyToClose', () => {
                    console.log('Jitsi listo para cerrar');
                    onMeetingEnd();
                });

            } catch (err) {
                console.error('Error al inicializar Jitsi:', err);
                setError('No se pudo iniciar la videoconferencia. Verifica tu conexión.');
                setIsLoading(false);
            }
        };

        initializeJitsi();

        return () => {
            if (jitsiApiRef.current) {
                jitsiApiRef.current.dispose();
                jitsiApiRef.current = null;
            }
        };
    }, [roomName, displayName, onMeetingEnd]);

    const handleClose = () => {
        if (jitsiApiRef.current) {
            jitsiApiRef.current.executeCommand('hangup');
        }
        onMeetingEnd();
    };

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md">
                    <h3 className="text-lg font-semibold text-red-600 mb-4">Error</h3>
                    <p className="text-slate-700 mb-6">{error}</p>
                    <button
                        onClick={onMeetingEnd}
                        className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black z-50"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999
            }}
        >
            {/* Botón de cerrar flotante */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-50 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-lg"
                title="Salir de la llamada"
            >
                <X className="w-5 h-5 text-white" />
            </button>

            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white text-sm">Conectando a la videoconferencia...</p>
                    </div>
                </div>
            )}

            {/* Contenedor de Jitsi - Pantalla completa */}
            <div
                ref={jitsiContainerRef}
                className="w-full h-full"
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}
            />
        </div>
    );
};

export default JitsiMeeting;
