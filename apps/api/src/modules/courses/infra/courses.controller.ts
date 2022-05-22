import { BadRequestException, Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

import { LoggableLogger } from '@curioushuman/loggable';

import { executeTask } from '../../../shared/utils/execute-task';
import { CreateCourseRequestDto } from './dto/create-course.request.dto';
import { CreateCourseDto } from '../application/commands/create-course/create-course.dto';
import { CreateCourseMapper } from '../application/commands/create-course/create-course.mapper';
import { CreateCourseCommand } from '../application/commands/create-course/create-course.command';

@Controller('courses')
export class CoursesController {
  constructor(
    private logger: LoggableLogger,
    private readonly commandBus: CommandBus
  ) {
    this.logger.setContext('CoursesController');
  }

  @Post()
  async create(@Body() body: CreateCourseRequestDto): Promise<void> {
    const task = pipe(
      body,
      this.parseCreateCourse,
      TE.fromEither,
      TE.chain((createCourseDto) =>
        TE.tryCatch(
          async () => {
            const command = new CreateCourseCommand(createCourseDto);
            return await this.commandBus.execute<CreateCourseCommand>(command);
          },
          (error: Error) => error as Error
        )
      )
    );

    return executeTask(task);
  }

  parseCreateCourse(
    dto: CreateCourseRequestDto
  ): E.Either<BadRequestException, CreateCourseDto> {
    return E.tryCatch(
      () => {
        return pipe(
          dto,
          CreateCourseRequestDto.check,
          CreateCourseMapper.fromRequestDto
        );
      },
      (error: Error) => new BadRequestException(error.toString())
    );
  }
}
