import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';

import {
  CreateCourseCommand,
  CreateCourseHandler,
} from '../create-course.command';
import { CourseRepository } from '../../../../adapter/ports/course.repository';
import { FakeCourseRepository } from '../../../../adapter/implementations/fake/fake.course.repository';
import { CourseSourceRepository } from '../../../../adapter/ports/course-source.repository';
import { FakeCourseSourceRepository } from '../../../../adapter/implementations/fake/fake.course-source.repository';
import { CreateCourseDtoBuilder } from './stubs/create-course.dto.stub';
import { executeTask } from '../../../../../../shared/utils/execute-task';
import { CreateCourseRequestDto } from '../../../../infra/dto/create-course.request.dto';
import { Course } from '../../../../domain/entities/course';

const feature = loadFeature('./create-course-command.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  let repository: FakeCourseRepository;
  let handler: CreateCourseHandler;
  let createCourseDto: CreateCourseRequestDto;
  let courses: Course[];
  let coursesBefore: number;
  // disabling no-explicit-any for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;

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

  test('Successfully creating a course', ({ given, and, when, then }) => {
    given('an object exists in Source repository', async () => {
      courses = await executeTask(repository.all());
      coursesBefore = courses.length;
      // in this test case we know the object exists in the fake repository
    });

    and('the request is valid', () => {
      // we test request validity in controller
      // here we assume it is valid, and has been transformed into valid command dto
      createCourseDto = CreateCourseDtoBuilder().newValid().build();
    });

    and('I am authorised to access the source repository', () => {
      // out of scope for this test
      // handled in repository and e2e testing
    });

    and('the returned source populates a valid course', () => {
      // we know this to be true
      // out of scope for this test
    });

    and('the source does not already exist in our DB', () => {
      // we know this to be true
      // TODO - do we need to test this here? Feels weird.
    });

    when('I create a course', async () => {
      result = await handler.execute(new CreateCourseCommand(createCourseDto));
    });

    then(
      'a new record should have been created in the repository',
      async () => {
        courses = await executeTask(repository.all());
        expect(courses.length).toEqual(coursesBefore + 1);
      }
    );

    and('no result is returned', () => {
      expect(result).toEqual(undefined);
    });
  });
});
