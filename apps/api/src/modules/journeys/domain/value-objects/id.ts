/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
import { Static, String } from 'runtypes';

/**
 * TODO
 * - [ ] NEEDS REVIEW, too simple but enough to be starting with
 * - [ ] How can we get constraints in here?
 *       Particularly if we use various adapters
 */

export const Id = String.withBrand('Id');

export type Id = Static<typeof Id>;
