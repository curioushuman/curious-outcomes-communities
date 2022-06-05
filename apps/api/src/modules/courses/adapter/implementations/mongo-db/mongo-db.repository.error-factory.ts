import { Injectable } from '@nestjs/common';
import { RepositoryErrorFactory } from '../../../../../shared/domain/errors/repository.error-factory';

/**
 * Error factory for MongoDB based repository
 *
 * NOTE: this is a work in progress
 */

@Injectable()
export class MongoDbRepositoryErrorFactory extends RepositoryErrorFactory {
  public errorStatusCode(error: Error): number {
    console.log('MongoDB', error);
    return 400;
  }

  public errorDescription(error: Error): string {
    return error.toString();
  }
}
