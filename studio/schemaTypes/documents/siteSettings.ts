import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

/** Singleton: the Studio structure opens it by its fixed id, `siteSettings`. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Setări site',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'contact', title: 'Contact', default: true},
    {name: 'company', title: 'Date firmă'},
    {name: 'extras', title: 'Diverse'},
  ],
  fields: [
    defineField({
      name: 'address',
      title: 'Adresa',
      description: 'Cât timp e gol, pe site apare [ADRESA].',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'metroStation',
      title: 'Stația de metrou',
      description: 'Doar numele, de ex. „Piața Romană”.',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email().error('Adresa de email nu pare corectă.'),
    }),
    defineField({
      name: 'whatsapp',
      title: 'Număr WhatsApp',
      description: 'Cu prefixul țării, de ex. +40 712 345 678.',
      type: 'string',
      group: 'contact',
      validation: (rule) =>
        rule
          .regex(/^\+[0-9 ]{9,18}$/)
          .error('Scrie numărul cu + și prefixul țării, de ex. +40 712 345 678.'),
    }),
    defineField({
      name: 'instagram',
      title: 'Cont Instagram',
      description: 'Fără @, de ex. caminulcultural31.',
      type: 'string',
      group: 'contact',
      validation: (rule) =>
        rule.regex(/^[A-Za-z0-9._]{1,30}$/).error('Doar numele contului, fără @ și fără link.'),
    }),
    defineField({
      name: 'company',
      title: 'Date firmă',
      description: 'Apar în subsolul site-ului și pe paginile legale.',
      type: 'object',
      group: 'company',
      fields: [
        defineField({name: 'legalName', title: 'Denumire', type: 'string'}),
        defineField({name: 'cui', title: 'CUI', type: 'string'}),
        defineField({
          name: 'registrationNumber',
          title: 'Nr. Registrul Comerțului',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'promoCode',
      title: 'Codul pisicii ascunse',
      description:
        'Îl primește cine găsește pisica de după panoul cu afișe. Dacă e gol, pisica nu mai dă niciun cod.',
      type: 'string',
      group: 'extras',
    }),
  ],
  preview: {prepare: () => ({title: 'Setări site'})},
})
