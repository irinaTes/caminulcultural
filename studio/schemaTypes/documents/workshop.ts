import {SparklesIcon} from '@sanity/icons/Sparkles'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'
import {slugify} from '../../lib/languages'
import {requireLocales} from '../objects/localized'

export const workshop = defineType({
  name: 'workshop',
  title: 'Atelier',
  type: 'document',
  icon: SparklesIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Numele atelierului',
      description: 'Scurt, ca pe afiș: „Mozaic”, „Pictură”.',
      type: 'localeString',
      validation: (rule) => requireLocales(rule),
    }),
    defineField({
      name: 'slug',
      title: 'Adresa paginii',
      description: 'Se completează din numele în română. Apasă „Generează”.',
      type: 'slug',
      options: {
        source: (doc) => (doc.title as {ro?: string} | undefined)?.ro ?? '',
        slugify,
      },
      validation: (rule) => rule.required().error('Generează adresa din numele atelierului.'),
    }),
    defineField({
      name: 'verb',
      title: 'Titlul de pe afiș',
      description: 'Fraza mare, roșie: „Spargem oglinzi!”',
      type: 'localeString',
      validation: (rule) => requireLocales(rule),
    }),
    defineField({
      name: 'shortLine',
      title: 'Descriere scurtă',
      description: 'Una-două fraze sub titlu, pe afiș.',
      type: 'localeText',
      validation: (rule) => requireLocales(rule),
    }),
    defineField({
      name: 'description',
      title: 'Descriere lungă',
      description: 'Opțional. Pentru pagina atelierului.',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'photo',
      title: 'Poza',
      description: 'Trage de cercul din poză ca să alegi ce rămâne la vedere când e decupată.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Ce se vede în poză',
          description:
            'Pentru cine nu vede poza (cititoare de ecran). De ex. „Mâini care lipesc cioburi de oglindă pe o ramă”.',
          type: 'localeString',
          validation: (rule) => requireLocales(rule, {englishRequired: true}),
        }),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Preț (lei)',
      description: 'Lasă gol până stabilești prețul. Pe site apare [PREȚ].',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'durationHours',
      title: 'Durata (ore)',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.required().min(0.5).max(12),
    }),
    defineField({
      name: 'capacity',
      title: 'Locuri în total',
      description: 'Câți oameni încap la o sesiune.',
      type: 'number',
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: 'pinColor',
      title: 'Culoarea pionezei',
      type: 'string',
      options: {
        list: [
          {title: 'Roșie', value: 'cherry'},
          {title: 'Aurie', value: 'glow'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'cherry',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hidden',
      title: 'Ascuns de pe site',
      description: 'Pornește-l ca să scoți atelierul de pe afișier fără să-l ștergi.',
      type: 'boolean',
      initialValue: false,
    }),
    orderRankField({type: 'workshop'}),
  ],
  preview: {
    select: {title: 'title.ro', verb: 'verb.ro', media: 'photo', hidden: 'hidden'},
    prepare: ({title, verb, media, hidden}) => ({
      title: title ?? 'Atelier fără nume',
      subtitle: hidden ? `Ascuns · ${verb ?? ''}` : verb,
      media,
    }),
  },
})
