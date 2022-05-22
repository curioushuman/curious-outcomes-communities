import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateCourseCommand,
  CreateCourseHandler,
} from '../create-course.command';
import { CourseRepository } from '../../../../adapter/ports/course.repository';
import { FakeCourseRepository } from '../../../../adapter/implementations/fake/fake.course.repository';
import { CourseSourceRepository } from '../../../../adapter/ports/course-source.repository';
import { FakeCourseSourceRepository } from '../../../../adapter/implementations/fake/fake.course-source.repository';
// import { CourseBuilder } from '../../../../test/data-builders/course.builder';
import { CreateCourseDtoBuilder } from './stubs/create-course.dto.stub';
import { executeTask } from '../../../../../../shared/utils/execute-task';

/**
 * Use Case tests
 *
 * Notes
 * - it is here, you might test other things that occur _around_ each query or command
 *   - e.g. after post-command events are fired
 * - use mocks/spies to focus just on the subject under test (SUT)
 *   - e.g. you can mock/spy on other commands just to make sure they receive the event
 */

/**
 * Who is the user of the command?
 * - other devs
 *
 * What BEHAVIOURS does this command fulfil?
 * - TBC
 * - is this where our user acceptance tests go?
 * - or at least some of them?
 *
 * This is all we need to test here
 */

let repository: FakeCourseRepository;

describe('[Unit][Command] Create Course', () => {
  let handler: CreateCourseHandler;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCourseHandler,
        { provide: CourseRepository, useClass: FakeCourseRepository },
        {
          provide: CourseSourceRepository,
          useClass: FakeCourseSourceRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get<CourseRepository>(
      CourseRepository
    ) as FakeCourseRepository;
    handler = moduleRef.get<CreateCourseHandler>(CreateCourseHandler);
  });

  describe('When ALL input is valid', () => {
    test('Then it should return a course', async () => {
      let courses = await executeTask(repository.all());
      const coursesBefore = courses.length;

      const createCourseDto = CreateCourseDtoBuilder().build();
      const result = await handler.execute(
        new CreateCourseCommand(createCourseDto)
      );

      courses = await executeTask(repository.all());
      const coursesAfter = courses.length;

      expect(result).toEqual(undefined);
      expect(coursesAfter).toEqual(coursesBefore + 1);
    });
  });

  describe('When ALL input is valid', () => {
    test.todo('Then it should return a course');
  });
});
