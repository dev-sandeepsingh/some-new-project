const isDevEnv = process.env.NODE_ENV === 'development';
const isTestEnv = process.env.NODE_ENV === 'test';
const baseDir = isDevEnv || isTestEnv ? 'src/' : 'build/';
const databaseUrl = isTestEnv
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;
const getConnectionLimit = () => Number(process.env.DB_CONNECTION_LIMIT) || 5;

const baseConfig = {
  type: 'postgres',
  url: databaseUrl,
  uuidExtension: 'pgcrypto',
  ssl:
    process.env.DATABASE_USE_SSL !== 'false'
      ? { rejectUnauthorized: false }
      : false,
  synchronize: false,
  entities: [
    `${baseDir}database/entity/*.js`,
    `${baseDir}database/entity/*.ts`,
  ],
  subscribers: [
    `${baseDir}database/subscriber/*.js`,
    `${baseDir}database/subscriber/*.ts`,
  ],
  migrations: [
    `${baseDir}database/migration/*.js`,
    `${baseDir}database/migration/*.ts`,
  ],
  cli: {
    entitiesDir: `${baseDir}database/entity`,
    migrationsDir: `${baseDir}database/migration`,
    subscribersDir: `${baseDir}database/subscriber`,
  },
  connectionLimit: getConnectionLimit(),
};

module.exports = [baseConfig];
