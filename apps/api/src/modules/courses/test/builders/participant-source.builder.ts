import { ParticipantSource } from '../../domain/entities/participant-source';
import { ExternalId } from '../../domain/value-objects/external-id';
import { ParticipantBuilder } from './participant.builder';
import { defaultUserId } from '../../../../identity-and-access/test/builders/user.builder';
import { defaultCourseSourceId } from './course-source.builder';

/**
 * A builder for Participant Sources to play with in testing.
 */

export const ParticipantSourceBuilder = () => {
  /**
   * Default properties don't exist in source repository
   */
  const defaultProperties = {
    id: '5008s1234519CjIAAU',
    firstName: 'Jake',
    lastName: 'Blues',
    email: 'jake@blues.com',
    externalCourseId: defaultCourseSourceId,
    userId: defaultUserId,
    participantId: null,
  };
  const overrides = {
    id: '5008s1234519CjIAAU',
    firstName: 'Jake',
    lastName: 'Blues',
    email: 'jake@blues.com',
    externalCourseId: defaultCourseSourceId,
    userId: defaultUserId,
    participantId: null,
  };

  return {
    alpha() {
      const alpha = ParticipantBuilder().alpha().build();
      overrides.id = alpha.id;
      overrides.firstName = alpha.firstName;
      overrides.lastName = alpha.lastName;
      overrides.email = alpha.email;
      return this;
    },

    beta() {
      const beta = ParticipantBuilder().beta().build();
      overrides.id = beta.id;
      overrides.firstName = beta.firstName;
      overrides.lastName = beta.lastName;
      overrides.email = beta.email;
      return this;
    },

    noMatchingSource() {
      return this;
    },

    withParticipant() {
      overrides.id = ExternalId.check('SourceWithParticipantForFakeRepoId');
      overrides.firstName = 'Already';
      overrides.lastName = 'Associated';
      // NOTE: this is a random UUID that matches to nothing
      overrides.participantId = 'e1cdde57-779d-4454-bfc4-3b6c7bf396e3';
      return this;
    },

    invalidSource() {
      overrides.id = ExternalId.check('InvalidIdForFakeRepo');
      overrides.lastName = '';
      return this;
    },

    exists() {
      overrides.id = ExternalId.check('ThisSourceExists');
      return this;
    },

    build(): ParticipantSource {
      return ParticipantSource.check({
        ...defaultProperties,
        ...overrides,
      });
    },

    buildNoCheck(): ParticipantSource {
      return {
        ...defaultProperties,
        ...overrides,
      } as ParticipantSource;
    },
  };
};
