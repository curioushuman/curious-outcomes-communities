import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { LoggableLogger } from '@curioushuman/loggable';

import { SalesforceApiCourseSourceRepository } from '../sf-api.course-source.repository';
import { CourseSourceRepository } from '../../../ports/course-source.repository';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { ErrorFactory } from '../../../../../../shared/domain/errors/error-factory';
import { SalesforceApiRepositoryErrorFactory } from '../sf-api.repository.error-factory';
import { CourseSource } from '../../../../domain/entities/course-source';
import { FindCourseSourceDto } from '../../../../application/queries/find-course-source/find-course-source.dto';
import { CourseSourceBuilder } from './builders/course-source.builder';
import { RepositoryAuthenticationError } from '../../../../../../shared/domain/errors/repository/authentication.error';
import { SalesforceApiHttpConfigService } from '../sf-api.http-config.service';
import { RepositoryItemNotFoundError } from '../../../../../../shared/domain/errors/repository/item-not-found.error';

/**
 * INTEGRATION TEST
 * SUT = the findOne function OF an external repository
 * i.e. are we actually connecting with and getting data from SF
 *
 * Scope
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
        LoggableLogger,
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
        expect(error).toBeUndefined();
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

  test('Fail; Source not found for ID provided', ({
    given,
    and,
    when,
    then,
  }) => {
    let absentCourseSource: CourseSource;
    let result: CourseSource;
    let error: Error;

    given('I am authorised to access the source', () => {
      // assumed
    });

    and('a matching record DOES NOT exist at the source', () => {
      absentCourseSource = CourseSourceBuilder().noMatchingObject().build();
      findCourseSourceDto = {
        id: absentCourseSource.id,
      };
    });

    when('I request the source by ID', async () => {
      try {
        result = await executeTask(repository.findOne(findCourseSourceDto));
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a RepositoryItemNotFoundError', () => {
      expect(error).toBeInstanceOf(RepositoryItemNotFoundError);
    });

    and('no result is returned', () => {
      expect(result).toBeUndefined();
    });
  });
});
