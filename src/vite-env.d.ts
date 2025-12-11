/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_N8N_WEBHOOK_URL: string
  readonly VITE_DEBUG_WORKFLOW: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
