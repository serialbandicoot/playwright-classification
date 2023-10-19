import { Locator } from '@playwright/test';

export const createLocatorImage = async (locator: Locator, path: string) => {
  await locator.screenshot({
    path: path,
    animations: 'disabled',
  });
};
