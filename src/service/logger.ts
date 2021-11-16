import * as Rollbar from 'rollbar';

const appLogsLevel = process.env.APP_LOGS_LEVEL;

const rollbarToken: string = process.env.ROLLBAR_ACCESS_TOKEN;
let rollbar: Rollbar;

const AllLevels = ['critical', 'error', 'warning', 'info', 'debug'] as const;
type LevelTuple = typeof AllLevels;
type Level = LevelTuple[number];

const rollbarLogLevels: Array<Level> = ['critical', 'error', 'warning'];

if (rollbarToken) {
  rollbar = new Rollbar({
    accessToken: rollbarToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });
}

const appLogsLevelIdx = AllLevels.indexOf(appLogsLevel as Level);

/* eslint-disable no-console */
const logToConsole: (level: Level, message: string) => void = (
  level,
  message,
) => {
  const isLogLevelValid = AllLevels.indexOf(level) <= appLogsLevelIdx;

  if (!isLogLevelValid) {
    return;
  }

  switch (level) {
    case 'critical':
    case 'error':
      console.error(message);
      return;
    case 'warning':
      console.warn(message);
      return;
    case 'info':
      console.info(message);
      return;
    case 'debug':
    default:
      console.log(message);
  }
};
/* eslint-enable-no-console */

const logger: (level: Level, message: string, stack?: string) => void = (
  level,
  message,
  stack,
) => {
  if (rollbar && rollbarLogLevels.indexOf(level) !== -1) {
    rollbar[level](message, stack);
  }
  logToConsole(level, message);
};

export default logger;
