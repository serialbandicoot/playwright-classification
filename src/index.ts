import { test, Locator } from '@playwright/test';
import { ImageClassificationMetadata, validateMetadata } from './metadata';

import {
  ClassificationType,
  getClassificationType,
  getImageTensor,
  getPredictionsFromModel,
  loadModel,
  mapBinaryPrediction,
  mapCategoryPrediction,
} from './tensor';
import { createLocatorImage } from './image';

export const playwrightClassification = {
  async toImageClassification(
    locator: Locator,
    expected: string,
    options?: { threshold?: number; modelName?: string },
  ) {
    const expectedMatcherName = 'toImageClassification';

    // Get metadata from playright.config.ts
    const metadata = test.info().config.metadata;
    const info = test.info();

    // Validate the image metadata to check if all the
    // required fields are present and correctly typed.
    const { valid, errors, imageModels } = validateMetadata(metadata);
    if (!valid) {
      return new Error(errors.join('\n'));
    }

    // Get First or Correct Model by Name or Error
    let imageModel: ImageClassificationMetadata;
    if (options?.modelName) {
      const foundImageModel = imageModels.find((model) => model.image.name === options?.modelName);
      if (foundImageModel) {
        imageModel = foundImageModel;
      } else {
        return new Error(`The model ${options?.modelName} was not found check Metdata`);
      }
    } else {
      imageModel = imageModels[0];
    }

    let threhold = 0.95;
    if (options?.threshold) {
      threhold = options?.threshold;
    }

    // Generate Screenshot from Locator
    const imagePath = `test-results/${info.title}/${expected}-${info.testId}.jpg`;
    await createLocatorImage(locator, imagePath);

    // Define actual
    let actual = '';

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
      }
    }

    const normalize = (message: string, originalMatcherName: string, expectedMatcherName: string): string => {
      return message.replaceAll(originalMatcherName, expectedMatcherName);
    };

if (actual === expected) {
      return {
        message: () => "passed",
        pass: true,
      };
    } else {
      return {
        message: () =>
          `toImageClassification() assertion failed.\nYou expected '${expected}' but it's a ${actual}}\n`,
        pass: false,
      };
    }
  },
};
