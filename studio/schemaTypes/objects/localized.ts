import {defineArrayMember, defineField, defineType, type Rule} from 'sanity'
import {languages} from '../../lib/languages'

// Field-level translations: one box per language, side by side in the same
// document, so prices, dates and order are shared by both languages.

export const localeString = defineType({
  name: 'localeString',
  title: 'Text scurt (RO + EN)',
  type: 'object',
  options: {columns: 2},
  fields: languages.map((lang) => defineField({name: lang.id, title: lang.title, type: 'string'})),
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Text (RO + EN)',
  type: 'object',
  options: {columns: 2},
  fields: languages.map((lang) =>
    defineField({name: lang.id, title: lang.title, type: 'text', rows: 3}),
  ),
})

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Text formatat (RO + EN)',
  type: 'object',
  fields: languages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [{title: 'Listă', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Îngroșat', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [],
          },
        }),
      ],
    }),
  ),
})

export const localizedTypes = [localeString, localeText, localeBlockContent]

type LocalizedValue = Partial<Record<(typeof languages)[number]['id'], unknown>>

function hasContent(value: unknown) {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return false
}

/**
 * Romanian is required. A missing English text is only a warning, because the
 * site falls back to Romanian; pass `englishRequired` to make it an error too.
 */
export function requireLocales(rule: Rule, {englishRequired = false} = {}) {
  const romanian = rule.custom((value: LocalizedValue | undefined) =>
    hasContent(value?.ro) ? true : 'Completează textul în română.',
  )
  if (englishRequired) {
    return [
      romanian,
      rule.custom((value: LocalizedValue | undefined) =>
        hasContent(value?.en) ? true : 'Completează textul în engleză.',
      ),
    ]
  }
  return [
    romanian,
    rule
      .custom((value: LocalizedValue | undefined) =>
        hasContent(value?.en) ? true : 'Lipsește textul în engleză. Pe site apare cel în română.',
      )
      .warning(),
  ]
}
