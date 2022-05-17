/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
import { Static, String } from 'runtypes';

/**
 * TODO
 * - [*] Review naming rules for Pokemon and add a constraint
 *   - there are "no" rules per se when it comes to the name itself
 *   - however, the JSON only includes the sanitised slug version
 */

export const Name = String.withBrand('Name');

export type Name = Static<typeof Name>;
