import { Static, String } from 'runtypes';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */

/**
 * TODO
 * - [ ] How can we get constraints in here?
 *       Particularly if we use various adapters
 */

export const ExternalId = String.withBrand('ExternalId');

export type ExternalId = Static<typeof ExternalId>;
