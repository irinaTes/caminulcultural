import { Fragment } from "react";
import { siteCity } from "@/config/site";
import type { Venue } from "@/data/types";
import { mapsHref } from "@/lib/links";

type VenueLinksProps = {
  venues: Venue[];
  /** Also show each venue's street address after its name. */
  withAddress?: boolean;
};

/**
 * "Mélange Café, Strada Oltarului 3", each one a Google Maps link. Several
 * venues (sessions in different places) are separated by a slash.
 */
export function VenueLinks({ venues, withAddress }: VenueLinksProps) {
  return venues.map((venue, index) => (
    <Fragment key={venue.name}>
      {index > 0 && " / "}
      <a
        href={mapsHref(`${venue.name}, ${venue.address}, ${siteCity}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:text-cherry"
      >
        {withAddress ? `${venue.name}, ${venue.address}` : venue.name}
      </a>
    </Fragment>
  ));
}
