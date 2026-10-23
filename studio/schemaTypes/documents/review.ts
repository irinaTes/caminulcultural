import {CommentIcon} from '@sanity/icons/Comment'
import {defineField, defineType} from 'sanity'
import {languages} from '../../lib/languages'

export const review = defineType({
  name: 'review',
  title: 'Recenzie',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'firstName',
      title: 'Prenume',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Recenzia',
      description: 'Exact cum a scris-o omul. Nu o traduce.',
      type: 'text',
      rows: 4,
      validation: (rule) => [
        rule.required(),
        rule.max(600).warning('E cam lungă pentru condică. Ține-o sub 600 de caractere.'),
      ],
    }),
    defineField({
      name: 'language',
      title: 'Limba recenziei',
      type: 'string',
      options: {
        list: languages.map((lang) => ({title: lang.title, value: lang.id})),
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'ro',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'workshop',
      title: 'Atelierul',
      description: 'Opțional.',
      type: 'reference',
      to: [{type: 'workshop'}],
      options: {disableNew: true},
    }),
    defineField({
      name: 'published',
      title: 'Apare pe site',
      description: 'Pornește-l după ce ai citit-o.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [{title: 'Cele mai noi', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {
      title: 'firstName',
      text: 'text',
      published: 'published',
      workshop: 'workshop.title.ro',
    },
    prepare: ({title, text, published, workshop}) => ({
      title: [title, workshop].filter(Boolean).join(' · '),
      subtitle: `${published ? '' : 'Neaprobată · '}${text ?? ''}`,
    }),
  },
})
