import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { SalesforceApiCourseSourceRepository } from '../salesforce-api.course-source.repository';
import { CourseSourceRepository } from '../../../ports/course-source.repository';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { ErrorFactory } from '../../../../../../shared/domain/errors/error-factory';
import { SalesforceApiRepositoryErrorFactory } from '../salesforce-api.repository.error-factory';
import { RepositoryAuthenticationError } from '../../../../../../shared/domain/errors/repository/authentication.error';

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

const feature = loadFeature('./hygiene.feature', {
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
  test('Successful connection to repository', ({ given, when, then }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    let error: Error;

    given('the repository is live', () => {
      // what we are testing
    });

    when('I attempt attempt to check live status', async () => {
      try {
        result = await executeTask(repository.livenessProbe());
      } catch (err) {
        error = err;
        expect(error).toBeUndefined();
      }
    });

    then('I should receive a positive result', () => {
      expect(result).toBe(true);
    });
  });

  test('Successful authorisation with repository', ({
    given,
    and,
    when,
    then,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    let error: Error;

    given('the repository is live', () => {
      // assumed
    });

    and('I am authorised to access the source', () => {
      // assumed
    });

    when('I attempt attempt to authorise', async () => {
      try {
        result = await executeTask(repository.authorise());
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a positive result', () => {
      expect(result).toBeDefined();
    });
  });

  test('Fail; Unable to authenticate with source repository', ({
    given,
    and,
    when,
    then,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    let error: Error;

    given('the repository is live', () => {
      // assumed
    });

    and('I am NOT authorised to access the source repository', () => {
      repository.testDisableAuth();
    });

    when('I attempt to access the source', async () => {
      try {
        result = await executeTask(repository.authorise());
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a RepositoryAuthenticationError', () => {
      expect(error).toBeInstanceOf(RepositoryAuthenticationError);
    });

    and('no result is returned', () => {
      expect(result).toBeUndefined();
    });
  });
});
