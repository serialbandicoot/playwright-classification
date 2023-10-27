import type { Expect } from '@playwright/test';

type CustomMatcherReturnType = {
  message: () => string;
  pass: boolean;
  name: string;
  expected?: unknown;
  actual?: unknown;
  log?: string[];
};

export type thisType = ReturnType<Expect<CustomMatcherReturnType>>;

export type Result = Pick<CustomMatcherReturnType, 'pass' | 'message' | 'name'>;

export const normalize = (message: string, original: string, expected: string): string => {
  return message.replaceAll(original, expected);
};
