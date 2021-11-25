import { startSegment, setTransactionName } from 'newrelic';

const useNewRelic = !!process.env.NEW_RELIC_LICENSE_KEY;
const fakeFn = () => {};

export const beginSegment = (name: string): (() => void) => {
  if (!useNewRelic) {
    return fakeFn;
  }

  let endSegment: () => void;
  startSegment(name, true, () => {
    const promise = new Promise((res: (value?: any) => void) => {
      endSegment = res;
    });
    return promise;
  });

  return endSegment;
};

export const setCustomTransactionName = (name: string) => {
  if (!useNewRelic) {
    return;
  }

  setTransactionName(name);
};
