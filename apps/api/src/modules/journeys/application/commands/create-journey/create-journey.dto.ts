import { Optional, Record, Static } from 'runtypes';

import { ExternalId } from '../../../domain/value-objects/external-id';
import { Name } from '../../../domain/value-objects/name';
import { Slug } from '../../../domain/value-objects/slug';

/**
 * This is the form of data our repository will expect for a query
 */

export const CreateJourneyDto = Record({
  name: Name,
  slug: Slug,
  externalId: Optional(ExternalId),
});

export type CreateJourneyDto = Static<typeof CreateJourneyDto>;
