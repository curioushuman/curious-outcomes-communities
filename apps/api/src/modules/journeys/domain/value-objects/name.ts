/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
import { Static, String } from 'runtypes';

/**
 * TODO
 * - [ ] Double check whether or not there should be constraints
 */

export const Name = String.withBrand('Name');

export type Name = Static<typeof Name>;
