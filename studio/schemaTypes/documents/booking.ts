import {UsersIcon} from '@sanity/icons/Users'
import {defineField, defineType} from 'sanity'
import {formatSessionTime} from '../../lib/languages'

/**
 * The dataset is public, but documents whose id has a path ("booking.…") are
 * only readable with a token. Bookings hold names, emails and phone numbers,
 * so every booking's id must start with this.
 */
export const BOOKING_ID_PREFIX = 'booking.'

export const bookingStatuses = [
  {title: 'De confirmat', value: 'pending'},
  {title: 'Confirmată', value: 'confirmed'},
  {title: 'Refuzată', value: 'declined'},
  {title: 'Anulată', value: 'cancelled'},
]

/** The id without "drafts." or "versions.<release>.". */
const baseId = (id: string) => id.replace(/^drafts\./, '').replace(/^versions\.[^.]+\./, '')

export const booking = defineType({
  name: 'booking',
  title: 'Rezervare',
  type: 'document',
  icon: UsersIcon,
  validation: (rule) =>
    rule.custom((doc) =>
      !doc?._id || baseId(doc._id).startsWith(BOOKING_ID_PREFIX)
        ? true
        : 'Rezervarea asta s-ar vedea public. Creeaz-o din butonul „Rezervare nouă” de la Rezervări.',
    ),
  fields: [
    defineField({
      name: 'status',
      title: 'Stare',
      description:
        'De confirmat și Confirmată țin locurile ocupate; Refuzată sau Anulată le eliberează. La Publish, Confirmată, Refuzată și Anulată îi trimit clientului un mail (dacă are email).',
      type: 'string',
      options: {list: bookingStatuses, layout: 'radio', direction: 'horizontal'},
      initialValue: 'pending',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'session',
      title: 'Sesiunea',
      type: 'reference',
      to: [{type: 'session'}],
      options: {
        disableNew: true,
        // Only sessions that haven't started, soonest first in the search.
        filter: 'dateTime(startsAt) > dateTime(now()) && status != "cancelled"',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'people',
      title: 'Câți vin',
      type: 'number',
      initialValue: 1,
      validation: (rule) => rule.required().integer().min(1).max(30),
    }),
    defineField({
      name: 'name',
      title: 'Nume',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'phone', title: 'Telefon', type: 'string'}),
    defineField({
      name: 'note',
      title: 'Nota clientului',
      description: 'Ce a scris în formular.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'staffNote',
      title: 'Notă internă',
      description: 'Doar pentru voi, de exemplu „a plătit cash”.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'source',
      title: 'De unde',
      type: 'string',
      options: {
        list: [
          {title: 'Formularul de pe site', value: 'site'},
          {title: 'Adăugată de mână', value: 'manual'},
        ],
      },
      initialValue: 'manual',
      readOnly: true,
    }),
    defineField({
      name: 'lang',
      title: 'Limba site-ului',
      type: 'string',
      options: {
        list: [
          {title: 'Română', value: 'ro'},
          {title: 'Engleză', value: 'en'},
        ],
      },
      readOnly: true,
      hidden: ({value}) => !value,
    }),
    defineField({
      name: 'notifiedStatus',
      title: 'Clientul a primit mailul pentru',
      description:
        'Se completează singur după ce pleacă mailul. Fiecare stare se trimite o singură dată.',
      type: 'string',
      options: {list: bookingStatuses},
      readOnly: true,
      hidden: ({value}) => !value,
    }),
    defineField({
      name: 'notifiedAt',
      title: 'Mail trimis la',
      type: 'datetime',
      readOnly: true,
      hidden: ({value}) => !value,
    }),
    defineField({
      name: 'receivedAt',
      title: 'Primită la',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {title: 'Cele mai noi', name: 'receivedDesc', by: [{field: 'receivedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {
      name: 'name',
      people: 'people',
      status: 'status',
      workshop: 'session.workshop.title.ro',
      startsAt: 'session.startsAt',
    },
    prepare: ({name, people, status, workshop, startsAt}) => ({
      title: `${name || 'Fără nume'} · ${people ?? '?'} ${people === 1 ? 'persoană' : 'persoane'}`,
      subtitle: [
        bookingStatuses.find((s) => s.value === status)?.title,
        workshop ?? 'Fără sesiune',
        startsAt && formatSessionTime(startsAt),
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
