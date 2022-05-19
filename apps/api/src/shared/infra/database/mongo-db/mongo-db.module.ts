import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggableLogger } from '@curioushuman/loggable';

import { MongoDbService } from './mongo-db.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const logger = new LoggableLogger(
          'MongoDbModule.MongooseModule.forRootAsync'
        );
        const u = process.env.MONGODB_USERNAME;
        const p = process.env.MONGODB_PASSWORD;
        const n = process.env.K8S_RELEASE_NAME;
        const ns = process.env.K8S_RELEASE_NAMESPACE;
        const port = process.env.MONGODB_PORT;
        const db = process.env.MONGODB_DATABASE;
        const uri = `mongodb://${u}:${p}@${n}-mongodb.${ns}.svc.cluster.local:${port}/${db}`;
        logger.debug(`MongoDB URI: ${uri}`);
        return {
          uri,
        };
      },
    }),
  ],
  providers: [MongoDbService],
  exports: [MongoDbService],
})
export class MongoDbModule {}
