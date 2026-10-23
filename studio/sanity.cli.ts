import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'r3j22rbn',
    dataset: 'production',
  },
  // Deployed at https://caminulcultural31.sanity.studio (`npm run deploy`).
  studioHost: 'caminulcultural31',
  deployment: {
    appId: 'mux8or88j88x1s5wo3xun4mh',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  typegen: {
    enabled: true,
    path: '../web/src/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../web/src/sanity/sanity.types.ts',
    overloadClientMethods: true,
  },
})
