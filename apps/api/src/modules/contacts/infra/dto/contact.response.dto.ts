/**
 * This is the structure of data the world will receive
 *
 * TODO
 * - Add swagger ApiProperty to all
 * - later, if/when necessary, add underlying interface
 *
 * Decisions (to be moved later)
 * - not using serialize interceptor (until we have rule of 3)
 * - not using class-transformer, as it narrows our possible approach
 */
export class ContactResponseDto {
  name!: string;
  slug!: string;
}
