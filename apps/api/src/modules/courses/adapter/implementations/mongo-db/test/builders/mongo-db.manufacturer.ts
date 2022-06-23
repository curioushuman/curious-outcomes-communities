import { Connection } from 'mongoose';
import { Filter, InferIdType, WithId, Document } from 'mongodb';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';

import { executeTask } from '../../../../../../../shared/utils/execute-task';
import { MongoDbCourse } from '../../schema/course.schema';
import { MongoDbParticipant } from '../../schema/participant.schema';
import { Course } from '../../../../../domain/entities/course';
import { Participant } from '../../../../../domain/entities/participant';

/**
 * Creates/deletes records in MongoDb around tests
 *
 * TODO
 * - [ ] STOP using CreateTypes within the class itself, get the generic to work
 *       e.g. save
 */

type CreateTypes = MongoDbCourse | MongoDbParticipant;

type InferType<D> = D extends MongoDbCourse
  ? Course
  : D extends MongoDbParticipant
  ? Participant
  : never;

export abstract class MongoDbManufacturer<D extends Document> {
  abstract labelFieldName: string;
  abstract collectionName: string;

  constructor(
    protected readonly connection: Connection,
    protected context: string
  ) {}

  /**
   * Abstract functions
   */

  /**
   * Note: this returns a TE just in case it needs to obtain related objects
   */
  abstract default(): TE.TaskEither<Error, InferType<D>>;

  abstract tidyExtra(): TE.TaskEither<Error, void>;

  abstract mapSource(createType: D): InferType<D>;

  abstract mapPersist(domainType: InferType<D>): D;

  /**
   * Other functions
   */

  setContext(context: string): void {
    this.context = context;
  }

  private randomString(): string {
    return Math.floor(Math.random() * 123456789).toString();
  }

  contextualLabel(): string {
    const name = `TEST CO ${this.collectionName} `;
    return name.concat(this.randomString(), ' ', this.context);
  }

  async build(): Promise<InferType<D>> {
    const task = pipe(
      this.default(),
      TE.chain((inferredType) => this.save(inferredType)),
      // this delays the next call by half a second
      TE.chain((dId) => pipe(dId, T.of, T.delay(500), TE.fromTask)),
      // passes on through
      TE.chain((id) => this.findById(id))
    );
    return executeTask(task);
  }

  protected save = (
    item: InferType<D>
  ): TE.TaskEither<Error, InferIdType<D>> => {
    return TE.tryCatch(
      async () => {
        const d = this.mapPersist(item);
        const result = await this.connection
          .collection<D>(this.collectionName)
          .insertOne(d);
        return result.insertedId;
      },
      (error: Error) => this.handleError(error)
    );
  };

  findById = (id: InferIdType<D>): TE.TaskEither<Error, InferType<D>> => {
    return TE.tryCatch(
      async () => {
        const item = await this.connection
          .collection<D>(this.collectionName)
          .findOne({ _id: id });
        return this.mapSource(item);
      },
      (error: Error) => error as Error
    );
  };

  async tidyUp(): Promise<void> {
    return executeTask(this.deleteAll());
  }

  deleteAll = (): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      async () => {
        const filter: Filter<D> = {};
        filter[this.labelFieldName] = {
          $regex: `.*${this.context}$`,
        };
        await this.connection.collection(this.collectionName).deleteMany({
          filter,
        });
      },
      (error: Error) => error as Error
    );
  };

  protected handleError = (error: Error): Error => {
    console.log(error);
    return error;
  };
}
