import { Connection } from 'mongoose';

import { Course } from '../../../../../domain/entities/course';
import { MongoDbCourse } from '../../schema/course.schema';

/**
 * Heavily inspired by: https://github.com/VincentJouanne/nest-clean-architecture
 */
export const CourseBuilder = () => {
  const defaultProperties = {
    externalId: '5008s000000y7LUAAY',
    name: '2022 Test course',
    slug: '2022_test_course',
  };
  const overrides = {
    externalId: '5008s000000y7LUAAY',
    name: '2022 Test course',
    slug: '2022_test_course',
  };

  return {
    noMatchingObject() {
      // a slightly incorrect ID
      // but still conforms to SF ID validity
      overrides.externalId = '5000K01232O2GEYQA3';
      return this;
    },

    invalid() {
      delete overrides.name;
      return this;
    },

    build(): Course {
      return Course.check({
        ...defaultProperties,
        ...overrides,
      });
    },

    async create(connection: Connection): Promise<Course> {
      const course = this.build();
      await connection.collection('mongodbcourses').insertOne(course);
      // we return the Course only, knowing it also exists in the DB
      return course;
    },

    async delete(connection: Connection): Promise<void> {
      const { externalId } = this.build();
      await connection.collection('mongodbcourses').deleteMany({ externalId });
      return;
    },

    async find(connection: Connection): Promise<MongoDbCourse> {
      const { externalId } = this.build();
      return await connection
        .collection<MongoDbCourse>('mongodbcourses')
        .findOne({ externalId });
    },
  };
};
