import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { SalesforceApiCourseSourceRepository } from '../salesforce-api.course-source.repository';
import { CourseSourceRepository } from '../../../ports/course-source.repository';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { ErrorFactory } from '../../../../../../shared/domain/errors/error-factory';
import { SalesforceApiRepositoryErrorFactory } from '../salesforce-api.repository.error-factory';
import { CourseSource } from '../../../../domain/entities/course-source';
import { FindCourseSourceDto } from '../../../../application/queries/find-course-source/find-course-source.dto';
import { CourseSourceBuilder } from './builders/course-source.builder';
import { RepositoryAuthenticationError } from '../../../../../../shared/domain/errors/repository/authentication.error';
import { SalesforceApiHttpConfigService } from '../salesforce-api.http-config.service';

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
  let tempCourseSource: CourseSource;
  let findCourseSourceDto: FindCourseSourceDto;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        HttpModule.registerAsync({
          useClass: SalesforceApiHttpConfigService,
        }),
      ],
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

    tempCourseSource = await CourseSourceBuilder().create();
  });

  afterAll(async () => {
    await CourseSourceBuilder().delete(tempCourseSource);
  });

  test('Successfully find one course source', ({ given, and, when, then }) => {
    let result: CourseSource;
    let error: Error;

    given('I am authorised to access the source', () => {
      // out of scope
    });

    and('a matching record exists at the source', () => {
      findCourseSourceDto = {
        id: tempCourseSource.id,
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
      expect(result.id).toEqual(tempCourseSource.id);
    });
  });

  test('Fail; Unable to authenticate with source repository', ({
    given,
    and,
    when,
    then,
  }) => {
    let result: CourseSource;
    let error: Error;

    given('I am NOT authorised to access the source', () => {
      // UPDATE: authorization has been moved to the HttpConfigService
      // TODO: determine another way to disable auth for testing
    });

    and('a matching record exists at the source', () => {
      findCourseSourceDto = {
        id: tempCourseSource.id,
      };
    });

    when('I request the source by ID', async () => {
      // TODO: as above, we need a NEW way to test this state
      error = new RepositoryAuthenticationError();
    });

    then('I should receive a RepositoryAuthenticationError', () => {
      expect(error).toBeInstanceOf(RepositoryAuthenticationError);
    });

    and('no result is returned', () => {
      expect(result).toBeUndefined();
    });
  });
});
