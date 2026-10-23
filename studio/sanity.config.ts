import {roROLocale} from '@sanity/locale-ro-ro'
import {visionTool} from '@sanity/vision'
import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes, singletonTypes} from './schemaTypes'
import {structure} from './structure'

// Actions allowed on singletons: no duplicate, no delete, no unpublish.
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Căminul Cultural 31',

  projectId: 'r3j22rbn',
  dataset: 'production',

  // Vision (the GROQ playground) only while developing; editors don't need it.
  plugins: [structureTool({structure}), roROLocale(), ...(isDev ? [visionTool()] : [])],

  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "new document" menu.
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({action}) => action && singletonActions.has(action))
        : actions,
  },
})
