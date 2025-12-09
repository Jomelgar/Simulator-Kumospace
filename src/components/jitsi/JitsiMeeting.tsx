import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { JAAS_APP_ID, JITSI_DOMAIN } from '../../config/JitsiConfig';

interface JitsiMeetingProps {
    roomName: string;
    displayName: string;
    onMeetingEnd: () => void;
    isVisible?: boolean;
    visibleContainerId?: string;
    onApiReady?: (api: any | null) => void;
    onAudioMuteStatusChanged?: (muted: boolean) => void;
    onVideoMuteStatusChanged?: (muted: boolean) => void;
    onScreenSharingStatusChanged?: (sharing: boolean) => void;
}

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

const JitsiMeeting: React.FC<JitsiMeetingProps> = ({
    roomName,
    displayName,
    onMeetingEnd,
    isVisible = true,
    visibleContainerId,
    onApiReady,
    onAudioMuteStatusChanged,
    onVideoMuteStatusChanged,
    onScreenSharingStatusChanged
}) => {
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const jitsiApiRef = useRef<any>(null);
    const isInitializingRef = useRef<boolean>(false);
    const onMeetingEndRef = useRef(onMeetingEnd);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [containerHeight, setContainerHeight] = useState<number>(600);

    useEffect(() => {
        onMeetingEndRef.current = onMeetingEnd;
    }, [onMeetingEnd]);

    useEffect(() => {
        const updateHeight = () => {
            if (jitsiContainerRef.current) {
                const rect = jitsiContainerRef.current.getBoundingClientRect();
                const height = rect.height || window.innerHeight - 150;
                if (height > 0) {
                    setContainerHeight(height);
                }
            }
        };

        const timeoutId = setTimeout(updateHeight, 100);
        window.addEventListener('resize', updateHeight);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    // Ya no movemos el iframe entre contenedores externos: lo mantenemos siempre
    // en el mismo div interno y solo mostramos/ocultamos por CSS usando isVisible.

    useEffect(() => {
        if (jitsiApiRef.current || isInitializingRef.current) {
            return;
        }

        isInitializingRef.current = true;
        let isMounted = true;

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

                const container = jitsiContainerRef.current;
                if (!container || !isMounted || jitsiApiRef.current) {
                    isInitializingRef.current = false;
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, 300));

                if (!jitsiContainerRef.current || !isMounted || jitsiApiRef.current) {
                    isInitializingRef.current = false;
                    return;
                }

                const rect = container.getBoundingClientRect();
                const parentRect = container.parentElement?.getBoundingClientRect();
                const calculatedHeight = rect.height || parentRect?.height || containerHeight || window.innerHeight - 200;
                const finalHeight = Math.max(calculatedHeight, 800);

                const domain = JITSI_DOMAIN;
                const options = {
                    roomName: `${JAAS_APP_ID}/${roomName}`,
                    width: '100%',
                    height: finalHeight,
                    parentNode: container,
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

                if (!isMounted || jitsiApiRef.current) {
                    isInitializingRef.current = false;
                    return;
                }

                if (jitsiApiRef.current) {
                    try {
                        jitsiApiRef.current.dispose();
                    } catch (e) {
                        console.error('Error al limpiar instancia anterior:', e);
                    }
                }

                const api = new window.JitsiMeetExternalAPI(domain, options);
                jitsiApiRef.current = api;
                isInitializingRef.current = false;

                if (onApiReady) {
                    onApiReady(api);
                }

                api.executeCommand('displayName', displayName);

                api.addEventListener('videoConferenceJoined', () => {
                    if (isMounted) {
                        console.log('Usuario se unió a la conferencia');
                        setIsLoading(false);
                    }
                });

                // Sincronizar estado de mute con el exterior (header)
                api.addEventListener('audioMuteStatusChanged', (status: { muted: boolean }) => {
                    if (typeof onAudioMuteStatusChanged === 'function') {
                        onAudioMuteStatusChanged(status.muted);
                    }
                });

                api.addEventListener('videoMuteStatusChanged', (status: { muted: boolean }) => {
                    if (typeof onVideoMuteStatusChanged === 'function') {
                        onVideoMuteStatusChanged(status.muted);
                    }
                });

                api.addEventListener('screenSharingStatusChanged', (status: { on: boolean }) => {
                    if (typeof onScreenSharingStatusChanged === 'function') {
                        onScreenSharingStatusChanged(status.on);
                    }
                });

                api.addEventListener('videoConferenceLeft', () => {
                    if (isMounted) {
                        console.log('Usuario salió de la conferencia');
                        onMeetingEndRef.current();
                    }
                });

                api.addEventListener('readyToClose', () => {
                    if (isMounted) {
                        console.log('Jitsi listo para cerrar');
                        onMeetingEndRef.current();
                    }
                });

            } catch (err) {
                console.error('Error al inicializar Jitsi:', err);
                isInitializingRef.current = false;
                if (isMounted) {
                    setError('No se pudo iniciar la videoconferencia. Verifica tu conexión.');
                    setIsLoading(false);
                }
                if (onApiReady) {
                    onApiReady(null);
                }
            }
        };

        initializeJitsi();

        return () => {
            isMounted = false;
            if (jitsiApiRef.current && roomName) {
                try {
                    jitsiApiRef.current.dispose();
                } catch (e) {
                    console.error('Error al limpiar Jitsi:', e);
                }
                jitsiApiRef.current = null;
            }
            isInitializingRef.current = false;
            if (onApiReady) {
                onApiReady(null);
            }
        };
    }, [roomName, displayName]);

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
            className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-700 "
            style={{
                display: isVisible ? 'flex' : 'none',
                flexDirection: 'column',
                minHeight: '500px',
            }}
        >



            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
                    <div className="text-center">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-ping opacity-20 mx-auto"></div>
                        </div>
                        <p className="text-white text-base font-medium">Conectando a la reunión...</p>
                        <p className="text-slate-400 text-sm mt-2">Por favor espera un momento</p>
                    </div>
                </div>
            )}

            <div
                ref={jitsiContainerRef}
                className="w-full flex-1 "
                style={{
                    flex: '1 1 auto',
                    minHeight: '600px',
                    height: '100%',
                }}
            />
        </div>
    );
};

export default JitsiMeeting;
