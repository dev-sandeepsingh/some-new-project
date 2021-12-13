import runApp from './app';

if (process.env.NEW_RELIC_LICENSE_KEY) {
  // eslint-disable-next-line global-require
  const newrelic = require('newrelic');
  newrelic.instrumentWebframework('express', () => {});
}
if (process.env.ROLLBAR) {
  // eslint-disable-next-line global-require
  require('rollbar');
}
const os = require('os');
const throng = require('throng');
const logger = require('./service/logger').default;

process.env.TZ = 'UTC';

const appPort = process.env.PORT || 3000;

const setupCluster = async () => {
  const appData = await runApp();
  const { app } = appData;
  app.listen(appPort, () => {
    logger('info', `HTTP server is up and running on port ${appPort}`);
  });
};

const concurrentImportSupported = true;
const dynoLimitDueToConnectionPool = 20;

const getNumberOfClusters = (): number => {
  if (!concurrentImportSupported) {
    return 1;
  }

  return Math.min(
    Number(process.env.WEB_CONCURRENCY) || os.cpus().length,
    dynoLimitDueToConnectionPool,
  );
};

const clustersCount = getNumberOfClusters();

const runClusters = () => {
  logger('info', `concurrent imports supported = ${concurrentImportSupported}`);
  logger('info', `WEB_CONCURRENCY = ${process.env.WEB_CONCURRENCY}`);
  logger('info', `CPUs count = ${os.cpus().length}`);

  if (clustersCount === 1) {
    logger('info', 'Running app without clusters');
    setupCluster();
    return;
  }

  const setupMaster = () => {
    logger('info', `Running app with ${clustersCount} clusters`);
  };

  throng({
    worker: setupCluster,
    master: setupMaster,
    count: clustersCount,
  });
};
setupCluster();
// runClusters();
