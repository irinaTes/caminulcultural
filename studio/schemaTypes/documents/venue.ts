import {PinIcon} from '@sanity/icons/Pin'
import {defineField, defineType} from 'sanity'

/**
 * A place where workshops are held, e.g. a café that hosts us. Workshops
 * pick a usual one; a session can pick another.
 */
export const venue = defineType({
  name: 'venue',
  title: 'Locație',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Numele locului',
      description: 'Cum apare pe site și în mailuri, de ex. „Mélange Café”.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Adresa',
      description:
        'Strada și numărul, fără oraș (se adaugă singur „București”), de ex. „Strada Oltarului 3”. Din ea se face linkul spre Google Maps.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'address'}},
})
