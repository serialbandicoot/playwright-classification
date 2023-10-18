import { Expect, test, Locator } from "@playwright/test";
import {
  parseImageClassificationMetadata,
  validateImageMetadata,
} from "./metadata";

// @ts-expect-error - no types
import jestExpect from "expect/build/matchers";
import {
  ClassificationType,
  getClassificationType,
  getImageTensor,
  getPredictionsFromModel,
  loadModel,
  mapBinaryPrediction,
} from "./tensor";
import { createLocatorImage } from "./image";

export interface Result {
  pass: boolean;
  message: () => string;
  name: string;
}

export type thisType = ReturnType<Expect["getState"]>;

const playwrightClassification = {
  async toImageClassification(
    this: thisType,
    locator: Locator,
    expected: string,
    threshold: number,
  ) {
    const expectedMatcherName = "toImageClassification";
    const obj = { ...this, customTesters: [] };

    // Get metadata from playright.config.ts
    const metadata = test.info().config.metadata;

    // Validate the image metadata to check if all the
    // required fields are present and correctly typed.
    const isValidImageMetaData = validateImageMetadata(metadata);
    if (!isValidImageMetaData.valid) {
      return new Error(isValidImageMetaData.errors.join("\n"));
    }

    // Get ImageMetaObject
    const imageMetadata = parseImageClassificationMetadata(metadata);

    // Generate Screenshot from Locator
    const imagePath = `test-results/${expected}.jpg`;
    await createLocatorImage(locator, imagePath);

    // Define actual
    let actual = "";

    if (imageMetadata) {
      // Create Image Tensor
      const imageTensor = await getImageTensor(
        imagePath,
        imageMetadata?.image.dimensions.width,
        imageMetadata?.image.dimensions.height,
      );

      // model 
      const model = await loadModel(imageMetadata.image.file);  

      // Get Predictions
      const predictions = await getPredictionsFromModel(
        model,
        imageTensor,
      );

      // getClassificationType
      
      const type = getClassificationType(model);
      if (type == ClassificationType.Binary) {
        actual = mapBinaryPrediction(
          predictions,
          threshold,
          imageMetadata.image.labels,
        );
      }

    }

    const {
      name: originalMatcherName,
      message: originalMessage,
      pass,
    } = jestExpect.toBe.call(obj, expected, actual) as Result;

    const message = () => `Should be ${expected} but was ${actual}`;

    return { pass, message };
  },
};

export default playwrightClassification;