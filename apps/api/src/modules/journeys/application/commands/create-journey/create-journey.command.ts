import { CommandHandler, ICommandHandler, ICommand } from '@nestjs/cqrs';
import { tryCatch } from 'fp-ts/lib/TaskEither';

import { JourneyRepository } from '../../../adapter/ports/journey.repository';
import { executeTask } from '../../../../../shared/utils/execute-task';
import { CreateJourneyDto } from './create-journey.dto';

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

    const create = tryCatch(
      async () => {
        return await executeTask(
          this.journeyRepository.create(createJourneyDto)
        );
      },
      (error: Error) => error as Error
    );
    return executeTask(create);
  }
}
