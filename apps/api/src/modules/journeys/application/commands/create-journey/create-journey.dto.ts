import { Optional, Record, Static } from 'runtypes';

import { Id } from '../../../domain/value-objects/Id';
import { Name } from '../../../domain/value-objects/name';
import { Slug } from '../../../domain/value-objects/slug';

/**
 * This is the form of data our repository will expect for the command
 */

export const CreateJourneyDto = Record({
  name: Name,
  slug: Slug,
  externalId: Optional(Id),
});

export type CreateJourneyDto = Static<typeof CreateJourneyDto>;
