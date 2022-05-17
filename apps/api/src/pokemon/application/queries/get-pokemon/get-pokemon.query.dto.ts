import { Record, Static } from 'runtypes';
import { Slug } from '../../../domain/value-objects/slug';

/**
 * This is the form of data our repository will expect for a query
 */

export const GetPokemonQueryDto = Record({
  slug: Slug,
});

export type GetPokemonQueryDto = Static<typeof GetPokemonQueryDto>;
