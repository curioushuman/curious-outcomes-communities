import { Static, String } from 'runtypes';
import * as uuid from 'uuid';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 *
 * TODO
 * - [ ] should this be more OO? e.g. createUUID
 */

export const UUIDRegex = /^[0-9a-z-_]+$/;

export const UUID = String.withBrand('UUID').withConstraint(
  (maybeUUID) => UUIDRegex.test(maybeUUID) || 'Invalid UUID'
);

export type UUID = Static<typeof UUID>;

export const createUUID = (): UUID => {
  return UUID.check(uuid.v4());
};
