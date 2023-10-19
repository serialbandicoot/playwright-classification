import type { Locator } from "playwright-core";

declare global {
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R> {
      /**
       * Asserts that the locator matches the expected image classification
       * @example
       * await expect(response).toImageClassification("dog", 0.99);
       * @param label - string The expected classification.
       * @param options? - Options for ...
       * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
       **/
      toImageClassification(label: string, options?: {modelName?: string, threshold?: number}): Promise<Locator>;
    }
  }
}
