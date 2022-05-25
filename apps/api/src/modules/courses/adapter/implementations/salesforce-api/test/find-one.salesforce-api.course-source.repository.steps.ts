import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { SalesforceApiCourseSourceRepository } from '../salesforce-api.course-source.repository';
import { CourseSourceRepository } from '../../../ports/course-source.repository';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { ErrorFactory } from '../../../../../../shared/domain/errors/error-factory';
import { SalesforceApiRepositoryErrorFactory } from '../salesforce-api.repository.error-factory';
import { CourseSource } from '../../../../domain/entities/course-source';
import { ExternalId } from '../../../../domain/value-objects/external-id';
import { FindCourseSourceDto } from '../../../../application/queries/find-course-source/find-course-source.dto';

/**
 * SUT = the repository
 *
 * Scope
 * - repository connection
 * - repository authorisation
 * - repository access issues
 * - repository functions and behaviours
 * - changes to API/data structure
 * - handling of their various responses/errors
 */

const feature = loadFeature('./find-one.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let repository: SalesforceApiCourseSourceRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: CourseSourceRepository,
          useClass: SalesforceApiCourseSourceRepository,
        },
        {
          provide: ErrorFactory,
          useClass: SalesforceApiRepositoryErrorFactory,
        },
      ],
    }).compile();

    repository = moduleRef.get<CourseSourceRepository>(
      CourseSourceRepository
    ) as SalesforceApiCourseSourceRepository;
  });

  test('Successfully find one course source', ({ given, and, when, then }) => {
    let findCourseSourceDto: FindCourseSourceDto;
    let result: CourseSource;
    let error: Error;
    let idThatExists: ExternalId;

    given('I am authorised to access the source', () => {
      // out of scope
    });

    and('a matching record exists at the source', () => {
      idThatExists = '5008s000000y7LUAAY' as ExternalId;
      findCourseSourceDto = {
        id: idThatExists,
      };
    });

    when('I request the source by ID', async () => {
      try {
        result = await executeTask(repository.findOne(findCourseSourceDto));
      } catch (err) {
        error = err;
        console.log(error);
      }
    });

    then('a source corresponding to that ID should be returned', () => {
      expect(result.id).toEqual(idThatExists);
    });
  });
});
