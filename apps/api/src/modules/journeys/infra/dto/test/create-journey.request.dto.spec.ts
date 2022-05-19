import {
  CreateJourneyFromRequestDtoBuilder,
  CreateJourneyRequestDtoBuilder,
} from '../../../test/data-builders/create-journey.request.builder';
import {
  CreateJourneyFromRequestDto,
  // CreateJourneyRequestDto,
} from '../create-journey.request.dto';

/**
 * Adding some tests at this level
 * As the nature of the createJourney and createJourneyFrom DTOs
 * deserves some checks
 */

describe('[Unit] CreateJourneyDto', () => {
  // let createJourneyDto: CreateJourneyRequestDto;
  let createJourneyFromDto: CreateJourneyFromRequestDto;

  describe('CreateJourneyFromDto', () => {
    describe('When NOT extending CreateJourneyDto', () => {
      test('When externalId present, it should pass validation', () => {
        try {
          createJourneyFromDto = CreateJourneyFromRequestDtoBuilder().build();
        } catch (error) {
          expect(error).toBeUndefined();
        }
        expect(createJourneyFromDto.externalId).toBeDefined();
      });
      test('When externalId NOT present, it should NOT pass validation', () => {
        try {
          createJourneyFromDto = CreateJourneyFromRequestDtoBuilder()
            .noExternalId()
            .build();
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });
    describe('When extending CreateJourneyDto', () => {
      describe('When FAILING partial of CreateJourneyDto is present', () => {
        test('Then CreateJourneyDto should fail', () => {
          try {
            CreateJourneyRequestDtoBuilder().failingPartial().build();
          } catch (error) {
            expect(error).toBeDefined();
          }
        });
        test('And CreateJourneyFromDto should pass', () => {
          try {
            createJourneyFromDto = CreateJourneyFromRequestDtoBuilder()
              .failButPassBody()
              .build();
          } catch (error) {
            expect(error).toBeUndefined();
          }
          expect(createJourneyFromDto.externalId).toBeDefined();
        });
      });
    });
  });
});
