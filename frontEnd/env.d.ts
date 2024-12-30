/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_DBHOST: string
  readonly MAIN_VITE_DBPORT: number
  readonly MAIN_VITE_DBNAME: string
  readonly MAIN_VITE_USERNAME: string
  readonly MAIN_VITE_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
