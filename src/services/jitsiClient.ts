export interface JitsiConfig {
  roomName: string;
  parentNode: HTMLElement;
  configOverwrite?: Record<string, any>;
  interfaceConfigOverwrite?: Record<string, any>;
}

export interface JitsiAPI {
  executeCommand: (command: string, ...args: any[]) => void;
  dispose: () => void;
  addEventListener: (event: string, listener: (...args: any[]) => void) => void;
  removeEventListener: (event: string, listener: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: JitsiConfig) => JitsiAPI;
  }
}

export class JitsiClient {
  private api: JitsiAPI | null = null;
  private domain: string;
  private roomName: string;
  private parentNode: HTMLElement;
  private configOverwrite: Record<string, any>;
  private interfaceConfigOverwrite: Record<string, any>;
  private onAudioMuteChanged?: (muted: boolean) => void;
  private onVideoMuteChanged?: (muted: boolean) => void;

  constructor(
    domain: string,
    roomName: string,
    parentNode: HTMLElement,
    configOverwrite: Record<string, any> = {},
    interfaceConfigOverwrite: Record<string, any> = {},
    callbacks?: {
      onAudioMuteChanged?: (muted: boolean) => void;
      onVideoMuteChanged?: (muted: boolean) => void;
    }
  ) {
    this.domain = domain;
    this.roomName = roomName;
    this.parentNode = parentNode;
    this.configOverwrite = configOverwrite;
    this.interfaceConfigOverwrite = interfaceConfigOverwrite;
    this.onAudioMuteChanged = callbacks?.onAudioMuteChanged;
    this.onVideoMuteChanged = callbacks?.onVideoMuteChanged;
  }

  init(): Promise<JitsiAPI> {
    return new Promise((resolve, reject) => {
      if (!window.JitsiMeetExternalAPI) {
        reject(new Error('Jitsi Meet External API no está cargada'));
        return;
      }

      try {
        const isLocalhost = this.domain.includes('localhost') || this.domain.includes('127.0.0.1');
        
        let domainWithPort = this.domain;
        if (isLocalhost && !this.domain.includes(':')) {
          domainWithPort = `${this.domain}:8001`;
        }

        const jitsiDomain = domainWithPort;

        const protocol = isLocalhost ? 'http' : 'https';
        const serviceUrl = this.configOverwrite.serviceUrl || `${protocol}://${domainWithPort}`;

        console.log('Configuración de dominio:', {
          domain: this.domain,
          domainWithPort,
          jitsiDomain,
          serviceUrl
        });
       
        const config = {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          disableDeepLinking: true,
          enableWelcomePage: false,
          enableClosePage: false,
          prejoinPageEnabled: false,
          useStunTurn: true,
          ...(this.configOverwrite.userName ? {
            userInfo: {
              displayName: this.configOverwrite.userName,
            },
          } : {}),
          ...(isLocalhost ? {
            bosh: `http://${domainWithPort}/http-bind`,
            disableHTTPS: true,
            hosts: {
              domain: 'meet.jitsi',
              muc: 'muc.meet.jitsi'
            },
            p2p: {
              enabled: false
            },

            enableLayerSuspension: true,
          } : {
            serviceUrl: serviceUrl,
          }),
          ...this.configOverwrite,
        };

        console.log('Configuración completa de Jitsi:', JSON.stringify(config, null, 2));
        console.log('URLs configuradas:', {
          bosh: isLocalhost ? `http://${domainWithPort}/http-bind` : undefined,
          websocket: isLocalhost ? `ws://${domainWithPort}/xmpp-websocket` : undefined,
        });

        const apiOptions: any = {
          roomName: this.roomName,
          parentNode: this.parentNode,
          configOverwrite: config,
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'chat',
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
              'security',
            ],
            SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
            HIDE_INVITE_MORE_HEADER: true,
            // Ocultar indicadores de carga y overlays
            DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
            DISABLE_FOCUS_INDICATOR: false,
            // Configuración para minimizar overlays
            TOOLBAR_TIMEOUT: 4000,
            ...this.interfaceConfigOverwrite,
          },
        };

        if (this.configOverwrite.userName) {
          apiOptions.userInfo = {
            displayName: this.configOverwrite.userName,
          };
        }

        this.api = new window.JitsiMeetExternalAPI(jitsiDomain, apiOptions);

        console.log('Registrando eventos de Jitsi...');

        if (isLocalhost) {
          const checkAndFixIframe = () => {
            const iframe = this.parentNode.querySelector('iframe');
            if (iframe) {
              let correctedSrc = iframe.src;
              
              if (correctedSrc.startsWith('https://')) {
                correctedSrc = correctedSrc.replace('https://', 'http://');
                console.log('Corrigiendo URL del iframe de HTTPS a HTTP');
              }
              
              if (correctedSrc.includes('http://http//')) {
                correctedSrc = correctedSrc.replace('http://http//', 'http://');
                console.log('Corrigiendo doble protocolo http://');
              }
              
              if (correctedSrc.includes('http://https://')) {
                correctedSrc = correctedSrc.replace('http://https://', 'http://');
                console.log('Corrigiendo protocolo mixto');
              }
              
              if (correctedSrc !== iframe.src) {
                console.log('URL corregida:', correctedSrc);
                iframe.src = correctedSrc;
              }
            }
          };

          setTimeout(checkAndFixIframe, 100);
          setTimeout(checkAndFixIframe, 500);
          setTimeout(checkAndFixIframe, 1000);
          setTimeout(checkAndFixIframe, 2000);
        }

        // Función para ocultar el overlay de carga de Jitsi
        const hideLoadingOverlay = () => {
          const iframe = this.parentNode.querySelector('iframe');
          if (iframe && iframe.contentWindow) {
            try {
              // Intentar inyectar CSS para ocultar overlays de carga
              const style = document.createElement('style');
              style.id = 'jitsi-loading-overlay-hider';
              style.textContent = `
                iframe[name^="jitsiConferenceFrame"] {
                  position: relative;
                }
                /* Ocultar overlays de carga comunes de Jitsi */
                iframe[name^="jitsiConferenceFrame"] + * {
                  display: none !important;
                }
              `;
              // Agregar estilos al documento principal que afecten al iframe
              if (!document.getElementById('jitsi-loading-overlay-hider')) {
                document.head.appendChild(style);
              }
            } catch (error) {
              // CORS puede prevenir el acceso al contenido del iframe
              console.log('No se puede acceder al contenido del iframe (CORS)');
            }
          }
        };

        const onReady = () => {
          console.log('Jitsi: API lista');
          // Intentar ocultar el overlay de carga después de que Jitsi esté listo
          setTimeout(hideLoadingOverlay, 500);
          setTimeout(hideLoadingOverlay, 1000);
          setTimeout(hideLoadingOverlay, 2000);
          
          // Intentar ocultar overlays usando comandos de Jitsi
          if (this.api) {
            try {
              // Ejecutar comandos para minimizar overlays
              setTimeout(() => {
                // El overlay de carga generalmente desaparece automáticamente
                // pero podemos forzar la actualización de la interfaz
                console.log('Jitsi listo, overlay de carga debería desaparecer automáticamente');
              }, 1000);
            } catch (error) {
              console.log('No se puede ocultar overlay (normal si está dentro del iframe)');
            }
          }
        };

        const onJoined = () => {
          console.log('Jitsi: Unido a la conferencia');
          resolve(this.api!);
        };

        const onLeft = () => {
          console.log('Jitsi: Salido de la conferencia');
        };

        const onReadyToClose = () => {
          console.log('Jitsi: Listo para cerrar');
          this.dispose();
        };

        const onError = (error: any) => {
          console.error('Jitsi: Error ocurrido', error);
          reject(error);
        };

        const onParticipantJoined = (participant: any) => {
          console.log('Jitsi: Participante unido', participant);
        };

        const onParticipantLeft = (participant: any) => {
          console.log('Jitsi: Participante salió', participant);
        };

        const onLoadConfigError = (error: any) => {
          console.error('Jitsi: Error al cargar configuración', error);
        };

        const onConfigError = (error: any) => {
          console.error('Jitsi: Error de configuración', error);
        };

        this.api.addEventListener('ready', onReady);
        this.api.addEventListener('videoConferenceJoined', onJoined);
        this.api.addEventListener('videoConferenceLeft', onLeft);
        this.api.addEventListener('readyToClose', onReadyToClose);
        this.api.addEventListener('errorOccurred', onError);
        this.api.addEventListener('participantJoined', onParticipantJoined);
        this.api.addEventListener('participantLeft', onParticipantLeft);
        this.api.addEventListener('loadConfigError', onLoadConfigError);
        this.api.addEventListener('configrationError', onConfigError);
        
        this.api.addEventListener('audioMuteStatusChanged', (data: any) => {
          console.log('Audio mute status changed:', data);
          const muted = data.muted === true;
          this.onAudioMuteChanged?.(muted);
        });
        
        this.api.addEventListener('videoMuteStatusChanged', (data: any) => {
          console.log('Video mute status changed:', data);
          const muted = data.muted === true;
          this.onVideoMuteChanged?.(muted);
        });

        // Timeout para detectar si no se conecta
        setTimeout(() => {
          if (!this.api) return;
          const iframe = this.parentNode.querySelector('iframe');
          if (iframe) {
            console.log('Iframe encontrado:', {
              src: iframe.src,
              width: iframe.offsetWidth,
              height: iframe.offsetHeight,
              style: iframe.style.cssText,
              contentWindow: iframe.contentWindow ? 'disponible' : 'no disponible',
              contentDocument: iframe.contentDocument ? 'disponible' : 'no disponible (posible CORS)'
            });
            
            // Intentar acceder al contenido del iframe (puede fallar por CORS)
            try {
              if (iframe.contentWindow) {
                console.log('ContentWindow disponible');
              }
            } catch (e) {
              console.warn('No se puede acceder al contentWindow (CORS):', e);
            }
          } else {
            console.warn('No se encontró iframe en el contenedor');
          }
        }, 2000);

        // Verificar eventos después de más tiempo
        setTimeout(() => {
          console.log('Estado después de 5 segundos:');
          console.log('- API disponible:', !!this.api);
          const iframe = this.parentNode.querySelector('iframe');
          console.log('- Iframe presente:', !!iframe);
          if (iframe) {
            console.log('- URL del iframe:', iframe.src);
          }
        }, 5000);
      } catch (error) {
        reject(error);
      }
    });
  }

  toggleMic(): void {
    console.log('JitsiClient.toggleMic() llamado, API disponible:', !!this.api);
    if (this.api) {
      try {
        // Verificar si hay métodos disponibles en la API
        console.log('Métodos disponibles en API:', {
          executeCommand: typeof this.api.executeCommand,
        });
        this.api.executeCommand('toggleAudio');
        console.log('Comando toggleAudio ejecutado exitosamente');
      } catch (error) {
        console.error('Error al ejecutar toggleAudio:', error);
      }
    } else {
      console.warn('API no disponible para toggleMic');
    }
  }

  toggleCamera(): void {
    console.log('JitsiClient.toggleCamera() llamado, API disponible:', !!this.api);
    if (this.api) {
      try {
        // Verificar si hay métodos disponibles en la API
        console.log('Métodos disponibles en API:', {
          executeCommand: typeof this.api.executeCommand,
        });
        this.api.executeCommand('toggleVideo');
        console.log('Comando toggleVideo ejecutado exitosamente');
      } catch (error) {
        console.error('Error al ejecutar toggleVideo:', error);
      }
    } else {
      console.warn('API no disponible para toggleCamera');
    }
  }

  toggleScreenshare(): void {
    console.log('JitsiClient.toggleScreenshare() llamado, API disponible:', !!this.api);
    if (this.api) {
      try {
        this.api.executeCommand('toggleShareScreen');
        console.log('Comando toggleShareScreen ejecutado');
      } catch (error) {
        console.error('Error al ejecutar toggleShareScreen:', error);
      }
    } else {
      console.warn('API no disponible para toggleScreenshare');
    }
  }

  leave(): void {
    if (this.api) {
      this.api.executeCommand('hangup');
    }
  }

  dispose(): void {
    if (this.api) {
      try {
        this.api.removeEventListener('videoConferenceJoined', () => {});
        this.api.removeEventListener('readyToClose', () => {});
        this.api.removeEventListener('errorOccurred', () => {});
        this.api.dispose();
      } catch (error) {
        console.error('Error al destruir Jitsi:', error);
      }
      this.api = null;
    }
  }

  getAPI(): JitsiAPI | null {
    return this.api;
  }
}

