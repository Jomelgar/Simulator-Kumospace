/**
 * Configuración centralizada para Jitsi Meet
 * 
 * Documentación oficial: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe
 */

export const JAAS_APP_ID = import.meta.env.VITE_JAAS_APP_ID || 'vpaas-magic-cookie-your-app-id';

/**
 * Configuración del dominio de JaaS
 * Para el plan free, usamos el dominio de 8x8
 */
export const JITSI_DOMAIN = '8x8.vc';

/**
 * Configuración de la interfaz de Jitsi
 */
export const jitsiConfig = {
    startWithAudioMuted: true,
    startWithVideoMuted: true,
    enableWelcomePage: false,
    prejoinPageEnabled: false, // Deshabilitar página de pre-unión para entrar directamente
    disableModeratorIndicator: false,
    enableClosePage: false,
};

/**
 * Configuración de la interfaz de usuario
 */
export const jitsiInterfaceConfig = {
    TOOLBAR_BUTTONS: [
        'microphone',
        'camera',
        'closedcaptions',
        'desktop', // Compartir pantalla
        'fullscreen',
        'fodeviceselection',
        'hangup',
        'profile',
        'chat',
        'recording',
        'livestreaming',
        'etherpad',
        'sharedvideo',
        'settings',
        'raisehand',
        'videoquality',
        'filmstrip',
        'invite',
        'feedback',
        'stats',
        'shortcuts',
        'tileview',
        'videobackgroundblur',
        'download',
        'help',
        'mute-everyone',
        'security'
    ],
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    BRAND_WATERMARK_LINK: '',
    DEFAULT_BACKGROUND: '#474747',
    DEFAULT_LOCAL_DISPLAY_NAME: 'Yo',
    DEFAULT_REMOTE_DISPLAY_NAME: 'Usuario',
    DISABLE_VIDEO_BACKGROUND: false,
    ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 15000,
    FILM_STRIP_MAX_HEIGHT: 120,
    MOBILE_APP_PROMO: false,
    SHOW_CHROME_EXTENSION_BANNER: false,
};

/**
 * Opciones adicionales para el componente de Jitsi
 */
export const jitsiOptions = {
    roomName: '',
    width: '100%',
    height: '100%',
    parentNode: undefined,
    userInfo: {
        displayName: '',
        email: ''
    },
    configOverwrite: jitsiConfig,
    interfaceConfigOverwrite: jitsiInterfaceConfig,
};
