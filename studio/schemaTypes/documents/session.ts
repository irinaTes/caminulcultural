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
      name: 'seatsLeft',
      title: 'Locuri rămase',
      description: 'Actualizează-l după fiecare rezervare. La 0, ora apare „plin” pe site.',
      type: 'number',
      validation: (rule) =>
        rule
          .integer()
          .min(0)
          .custom(async (seats, context) => {
            const ref = (context.document?.workshop as {_ref?: string} | undefined)?._ref
            if (typeof seats !== 'number' || !ref) return true
            const capacity = await context
              .getClient({apiVersion: '2026-10-22'})
              .fetch<number | null>(`*[_id in [$id, "drafts." + $id]][0].capacity`, {id: ref})
            return capacity == null || seats <= capacity
              ? true
              : `Atelierul are doar ${capacity} locuri în total.`
          }),
    }),
    defineField({
      name: 'status',
      title: 'Stare',
      description: 'Plină: ora apare tăiată pe afiș. Anulată: sesiunea dispare de pe site.',
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
      seatsLeft: 'seatsLeft',
      status: 'status',
      media: 'workshop.photo',
    },
    prepare: ({workshop, startsAt, seatsLeft, status, media}) => {
      const state =
        status === 'open'
          ? typeof seatsLeft === 'number'
            ? `${seatsLeft} locuri rămase`
            : 'Deschisă'
          : statuses.find((s) => s.value === status)?.title
      return {
        title: `${workshop ?? 'Fără atelier'} · ${startsAt ? formatSessionTime(startsAt) : 'fără dată'}`,
        subtitle: state,
        media,
      }
    },
  },
})
