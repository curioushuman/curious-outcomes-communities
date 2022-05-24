import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { SalesforceApiCourseSourceRepository } from '../salesforce-api.course-source.repository';
import { CourseSourceRepository } from '../../../ports/course-source.repository';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { ErrorFactory } from '../../../../../../shared/domain/errors/error-factory';
import { FakeRepositoryErrorFactory } from '../../../../../../shared/adapter/fake.repository.error-factory';

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

const feature = loadFeature('./create-course-command.feature', {
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
          useClass: FakeRepositoryErrorFactory,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any;

    given('the repository is live', () => {
      // what we are testing
    });

    when('I attempt attempt to check live status', async () => {
      try {
        result = await executeTask(repository.livenessProbe());
      } catch (err) {
        error = err;
      }
    });

    then('I should receive a positive result', () => {
      expect(result).toBe(true);
    });
  });
});
