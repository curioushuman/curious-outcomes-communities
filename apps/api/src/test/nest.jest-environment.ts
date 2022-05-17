import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Connection } from 'mongoose';
import NodeEnvironment from 'jest-environment-node';

import { Bootstrap } from '../bootstrap/bootstrap';
import { AppModule } from '../app/app.module';
import { MongoDbService } from '../shared/infra/database/mongo-db/mongo-db.service';

class NestEnvironment extends NodeEnvironment {
  private app: INestApplication;
  private connection: Connection;

  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();
    await this.createNestApp();
  }

  async createNestApp() {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleRef.createNestApplication();
    Bootstrap.useGlobalSettings(this.app);
    await this.app.init();
    this.global.app = this.app;
    this.global.httpServer = this.app.getHttpServer();
    // mongodb
    this.connection = moduleRef
      .get<MongoDbService>(MongoDbService)
      .getConnection();
    this.global.connection = this.connection;
  }

  async teardown() {
    await this.connection.close();
    await this.app.close();
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

export default NestEnvironment;
