import { CommandHandler, ICommandHandler, ICommand } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { ValidationError } from 'runtypes';

import { JourneyRepository } from '../../../adapter/ports/journey.repository';
import { executeTask } from '../../../../../shared/utils/execute-task';
import { CreateJourneyDto } from './create-journey.dto';
import { CreateJourneyMapper } from './create-journey.mapper';

export class CreateJourneyCommand implements ICommand {
  constructor(public readonly createJourneyDto: CreateJourneyDto) {}
}

@CommandHandler(CreateJourneyCommand)
export class CreateJourneyHandler
  implements ICommandHandler<CreateJourneyCommand>
{
  constructor(private readonly journeyRepository: JourneyRepository) {}

  async execute(command: CreateJourneyCommand): Promise<void> {
    const { createJourneyDto } = command;

    const task = tryCatch(
      async () => {
        const journey = CreateJourneyMapper.toDomain(createJourneyDto);
        return await executeTask(this.journeyRepository.save(journey));
      },
      (error: Error) => {
        if (error instanceof ValidationError) {
          return new InternalServerErrorException(
            `Invalid journey supplied in CreateJourneyHandler`
          );
        }
        return error as Error;
      }
    );
    return executeTask(task);
  }
}
