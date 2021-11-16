const dbUniqueViolationMessage =
  'duplicate key value violates unique constraint';

const isUniqueViolationError = (error: Error) =>
  error.message.indexOf(dbUniqueViolationMessage) !== -1;

export default isUniqueViolationError;
