type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;
type CatchFunction<T = any> = (error: Error) => T | Promise<T>;

export default <T>(
  execFunction: AsyncFunction<T>, // eslint-disable-line prettier/prettier
  catchFunction: CatchFunction<T>, // eslint-disable-line prettier/prettier
): (() => Promise<T>) => // eslint-disable-line prettier/prettier
  (...args: any[]) =>
    execFunction(...args).catch(catchFunction);
