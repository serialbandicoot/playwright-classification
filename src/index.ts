import { test, Locator } from '@playwright/test';
// @ts-expect-error - no types
import jestExpect from 'expect/build/matchers';
import { ImageClassificationMetadata, validateMetadata } from './metadata';

import {
  ActualResult,
  ClassificationType,
  getClassificationType,
  getImageTensor,
  getPredictionsFromModel,
  loadModel,
  mapBinaryPrediction,
  mapCategoryPrediction,
} from './tensor';
import { createLocatorImage } from './image';

const PlaywrightClassification = {
  async toImageClassification(
    locator: Locator,
    expected: string,
    options?: { threshold?: number; model?: string },
  ) {

    // Check if 'expected' is an empty string
    if (!expected || expected.trim() === "") {
      throw new Error("Expected classification cannot be an empty string");
    }

    const expectedMatcherName = 'toImageClassification';
    // Get metadata from playright.config.ts
    const metadata = test.info().config.metadata;
    const info = test.info();

    // Validate the image metadata to check if all the
    // required fields are present and correctly typed.
    const { valid, errors, imageModels } = validateMetadata(metadata);

    if (!valid || !imageModels) {
      throw new Error(errors.join('\n'));
    }

    // Get First or Correct Model by Name or Error
    let imageModel: ImageClassificationMetadata;
    if (options?.model) {
      const foundImageModel = imageModels.find((model) => model.image.model === options?.model);
      if (foundImageModel) {
        imageModel = foundImageModel;
      } else {
        throw new Error(`The model ${options?.model} was not found check Metdata`);
      }
    } else {
      imageModel = imageModels[0];
    }

    const metaLabels = imageModel.image.labels;
    if (expected !== '' && !metaLabels.includes(expected)) {
      throw new Error(`There is no label '${expected}' found in '${metaLabels.join(', ')}'`);
    }

    let threhold = 0.95;
    if (options?.threshold) {
      threhold = options?.threshold;
    }

    // Generate Screenshot from Locator
    const imagePath = `test-results/${info.title}/${expected}-${info.testId}.jpg`;
    await createLocatorImage(locator, imagePath);

    // Define actual-result
    let actual: ActualResult = {
      highestLabel: null,
    };

    if (imageModel) {
      // Create Image Tensor
      const imageTensor = await getImageTensor(
        imagePath,
        imageModel?.image.dimensions.width,
        imageModel?.image.dimensions.height,
      );

      // model
      const model = await loadModel(imageModel.image.file);

      // Get Predictions
      const predictions = await getPredictionsFromModel(model, imageTensor);

      // Binary || Category
      const type = getClassificationType(model);
      if (type == ClassificationType.Binary) {
        actual = mapBinaryPrediction(predictions, threhold, imageModel.image.labels);
      } else if (type == ClassificationType.Category) {
        actual = mapCategoryPrediction(predictions, threhold, imageModel.image.labels);
      } else {
        throw new Error('No Classification Type found');
      }
    }

    // Evaluate the scores!
    if (actual.highestLabel !== expected) {
      const scoreMessage = actual.highestValue 
        ? ` with a prediction score of: ${parseFloat(actual.highestValue.toFixed(2))}` 
        : '';

      return {
        pass: false,
        message: () => `Expected Label to classify as '${expected}', but the highest classification was '${actual.highestLabel}'${scoreMessage}`,
      };
    }

    // No message needed if the labels match
    return {
      pass: true,
      message: () => 'Passed',
    };

  },
};

export { PlaywrightClassification };
