type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;
type CatchFunction<T = any> = (error: Error) => T | Promise<T>;

export default <T>(
  execFunction: AsyncFunction<T>,
  catchFunction: CatchFunction<T>,
): (() => Promise<T>) =>
  (...args: any[]) =>
    execFunction(...args).catch(catchFunction);
