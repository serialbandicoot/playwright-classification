import type { Expect } from '@playwright/test';
import { ActualResult } from './tensor';

type CustomMatcherReturnType = {
  message: () => string;
  pass: boolean;
  name: string;
  expected?: unknown;
  actual?: unknown;
  log?: string[];
};

// @ts-ignore: CustomMatcherReturnType not generic Type
export type thisType = ReturnType<Expect<CustomMatcherReturnType>>;

export type Result = Pick<CustomMatcherReturnType, 'pass' | 'message' | 'name'>;

export const normalize = (message: string, original: string, expected: string, actual: ActualResult): string => {
  message = message.replaceAll(original, expected);
  const actualMessage = `\r\n\r\nThe highest predicted label was ${actual.highestLabel}${
    actual.highestValue ? ` with a prediction score of ${actual.highestValue}` : ''
  }`;
  message = message += actualMessage;
  return message;
};
