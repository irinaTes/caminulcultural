import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineField, defineType} from 'sanity'
import {formatSessionTime, siteTimeZone} from '../../lib/languages'

const statuses = [
  {title: 'Deschisă', value: 'open'},
  {title: 'Plină', value: 'full'},
  {title: 'Anulată', value: 'cancelled'},
]

export const session = defineType({
  name: 'session',
  title: 'Sesiune',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'workshop',
      title: 'Atelierul',
      type: 'reference',
      to: [{type: 'workshop'}],
      options: {disableNew: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startsAt',
      title: 'Începe la',
      description: 'Ora României, oriunde te-ai afla.',
      type: 'datetime',
      options: {displayTimeZone: siteTimeZone, allowTimeZoneSwitch: false, timeStep: 15},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'capacity',
      title: 'Locuri la sesiunea asta',
      description:
        'Doar dacă diferă de atelier. Gol: cât scrie la atelier. Locurile rămase se calculează singure din Rezervări.',
      type: 'number',
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: 'status',
      title: 'Stare',
      description:
        'Plină: ora apare tăiată pe afiș, chiar dacă mai sunt locuri (se face plină și singură când se ocupă toate). Anulată: sesiunea dispare de pe site.',
      type: 'string',
      options: {list: statuses, layout: 'radio', direction: 'horizontal'},
      initialValue: 'open',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {title: 'Cele mai apropiate', name: 'startsAtAsc', by: [{field: 'startsAt', direction: 'asc'}]},
    {title: 'Cele mai recente', name: 'startsAtDesc', by: [{field: 'startsAt', direction: 'desc'}]},
  ],
  preview: {
    select: {
      workshop: 'workshop.title.ro',
      startsAt: 'startsAt',
      capacity: 'capacity',
      workshopCapacity: 'workshop.capacity',
      status: 'status',
      media: 'workshop.photo',
    },
    prepare: ({workshop, startsAt, capacity, workshopCapacity, status, media}) => {
      const seats = capacity ?? workshopCapacity
      const state = [
        statuses.find((s) => s.value === status)?.title,
        typeof seats === 'number' && `${seats} locuri`,
      ]
        .filter(Boolean)
        .join(' · ')
      return {
        title: `${workshop ?? 'Fără atelier'} · ${startsAt ? formatSessionTime(startsAt) : 'fără dată'}`,
        subtitle: state,
        media,
      }
    },
  },
})
