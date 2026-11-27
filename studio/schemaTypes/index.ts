import {booking} from './documents/booking'
import {review} from './documents/review'
import {session} from './documents/session'
import {siteSettings} from './documents/siteSettings'
import {workshop} from './documents/workshop'
import {localizedTypes} from './objects/localized'

export const schemaTypes = [workshop, session, booking, review, siteSettings, ...localizedTypes]

/** Types with exactly one document, opened from the structure by a fixed id. */
export const singletonTypes = new Set<string>([siteSettings.name])

/**
 * Types created only from the structure (with a private id), never from the
 * generic "new document" menu or by duplicating.
 */
export const structureOnlyTypes = new Set<string>(['booking'])
