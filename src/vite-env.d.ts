/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_JAAS_APP_ID: string;
    // Agrega más variables de entorno aquí según sea necesario
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
