import { CommandHandler, ICommandHandler, ICommand } from '@nestjs/cqrs';
// import { InternalServerErrorException } from '@nestjs/common';
// import { tryCatch } from 'fp-ts/lib/TaskEither';
// import { ValidationError } from 'runtypes';

// import { JourneyRepository } from '../../../adapter/ports/journey.repository';
// import { executeTask } from '../../../../../shared/utils/execute-task';
import { CreateJourneyDto } from './create-journey.dto';
// import { Journey } from '../../../domain/entities/journey';
// import { Slug } from '../../../domain/value-objects/slug';

export class CreateJourneyCommand implements ICommand {
  constructor(public readonly createJourneyDto: CreateJourneyDto) {}
}

@CommandHandler(CreateJourneyCommand)
export class CreateJourneyHandler
  implements ICommandHandler<CreateJourneyCommand>
{
  // constructor(private readonly journeyRepository: JourneyRepository) {}

  async execute(command: CreateJourneyCommand): Promise<void> {
    // const { createJourneyDto } = command;

    return;
  }
}
