import {CalendarIcon} from '@sanity/icons/Calendar'
import {CogIcon} from '@sanity/icons/Cog'
import {CommentIcon} from '@sanity/icons/Comment'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

const apiVersion = '2026-10-22'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Conținut')
    .items([
      orderableDocumentListDeskItem({
        type: 'workshop',
        title: 'Ateliere',
        S,
        context,
      }),

      S.listItem()
        .title('Sesiuni')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Sesiuni')
            .items([
              S.listItem()
                .title('Viitoare')
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title('Sesiuni viitoare')
                    .schemaType('session')
                    .apiVersion(apiVersion)
                    .filter('_type == "session" && dateTime(startsAt) >= dateTime(now())')
                    .defaultOrdering([{field: 'startsAt', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Trecute')
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title('Sesiuni trecute')
                    .schemaType('session')
                    .apiVersion(apiVersion)
                    .filter('_type == "session" && dateTime(startsAt) < dateTime(now())')
                    .defaultOrdering([{field: 'startsAt', direction: 'desc'}]),
                ),
              S.divider(),
              S.documentTypeListItem('session').title('Toate sesiunile'),
            ]),
        ),

      S.listItem()
        .title('Recenzii')
        .icon(CommentIcon)
        .child(
          S.list()
            .title('Recenzii')
            .items([
              S.listItem()
                .title('De aprobat')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Recenzii de aprobat')
                    .schemaType('review')
                    .apiVersion(apiVersion)
                    .filter('_type == "review" && published != true')
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Publicate')
                .icon(CommentIcon)
                .child(
                  S.documentList()
                    .title('Recenzii publicate')
                    .schemaType('review')
                    .apiVersion(apiVersion)
                    .filter('_type == "review" && published == true')
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('Setări site')
        .id('siteSettings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Setări site'),
        ),
    ])
