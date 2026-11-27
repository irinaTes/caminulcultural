import {AddIcon} from '@sanity/icons/Add'
import {UsersIcon} from '@sanity/icons/Users'
import type {StructureBuilder, StructureResolverContext} from 'sanity/structure'
import {BOOKING_ID_PREFIX} from '../schemaTypes/documents/booking'

const apiVersion = '2026-10-22'

const upcoming = 'dateTime(session->startsAt) > dateTime(now())'

/**
 * "Rezervări": the requests from the site plus the ones added by hand.
 * New bookings are drafts with a private id ("booking.…"), so nobody can
 * read them through the public API; they count once published.
 */
export function bookingsItem(S: StructureBuilder, context: StructureResolverContext) {
  const newBooking = S.menuItem()
    .title('Rezervare nouă')
    .icon(AddIcon)
    .showAsAction(true)
    .action(async () => {
      await context.getClient({apiVersion}).create({
        _id: `drafts.${BOOKING_ID_PREFIX}${crypto.randomUUID()}`,
        _type: 'booking',
        status: 'confirmed',
        source: 'manual',
        people: 1,
        receivedAt: new Date().toISOString(),
      })
    })

  const list = (title: string, filter: string) =>
    S.documentList()
      .title(title)
      .schemaType('booking')
      .apiVersion(apiVersion)
      .filter(`_type == "booking" && ${filter}`)
      .defaultOrdering([{field: 'receivedAt', direction: 'desc'}])
      .initialValueTemplates([])
      .menuItems([newBooking])

  return S.listItem()
    .title('Rezervări')
    .icon(UsersIcon)
    .child(
      S.list()
        .title('Rezervări')
        .items([
          S.listItem()
            .title('De confirmat')
            .icon(UsersIcon)
            .child(list('De confirmat', `status == "pending" && ${upcoming}`)),
          S.listItem()
            .title('Confirmate, viitoare')
            .icon(UsersIcon)
            .child(list('Confirmate, viitoare', `status == "confirmed" && ${upcoming}`)),
          S.divider(),
          S.listItem().title('Toate').icon(UsersIcon).child(list('Toate rezervările', 'true')),
        ]),
    )
}
