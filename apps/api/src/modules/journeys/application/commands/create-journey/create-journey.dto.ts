import { Record, Static } from 'runtypes';

import { Name } from '../../../domain/value-objects/name';
import { Slug } from '../../../domain/value-objects/slug';

/**
 * This is the form of data our repository will expect for a query
 */

export const CreateJourneyDto = Record({
  name: Name,
  slug: Slug,
});

export type CreateJourneyDto = Static<typeof CreateJourneyDto>;
