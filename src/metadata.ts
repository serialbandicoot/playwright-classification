import { Metadata } from '@playwright/test';

export type ModelsMetadata = {
  models: ImageClassificationMetadata[];
};

export type ImageClassificationMetadata = {
  image: {
    name: string;
    file: string;
    labels: string[];
    dimensions: {
      width: number;
      height: number;
    };
  };
};

interface ExtractedData {
  valid: boolean;
  imageErrors: string[];
  imageModels: ImageClassificationMetadata[];
}

export const extractImageModels = (data: ImageClassificationMetadata[]): ExtractedData => {
  const imageModels: ImageClassificationMetadata[] = [];
  const imageErrors: string[] = [];
  data.forEach((model) => {
    if (model.image) {
      const result = validateImageMetadata(model.image);
      if (result.valid) {
        const imageMetadata = parseImageClassificationMetadata(model.image);
        if (imageMetadata) {
          imageModels.push(imageMetadata);
        }
      } else {
        return imageErrors.push(result.errors.join('\n'));
      }
    }
  });
  if (imageErrors.length !== 0) {
    return { valid: false, imageErrors: imageErrors, imageModels: imageModels };
  }

  return { valid: true, imageErrors: imageErrors, imageModels: imageModels };
};

export const validateMetadata = (
  metadata: Metadata,
): {
  valid: boolean;
  errors: string[];
  imageModels: ImageClassificationMetadata[];
} => {
  const errors: string[] = [];

  if (!metadata) {
    errors.push('Metadata object is missing.');
  }

  if (!metadata.models) {
    errors.push('No Models Data this need to be at least 1 in an Array');
  }

  const { valid, imageErrors, imageModels } = extractImageModels(metadata.models);

  if (!valid) {
    errors.push(imageErrors.join('\n'));
  }

  if (imageModels.length === 0) {
    errors.push('Image objects are missing.');
  }

  if (errors.length === 0) {
    return { valid: true, errors, imageModels };
  }

  return { valid: false, errors, imageModels };
};

export const validateImageMetadata = (metadata: Metadata): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (typeof metadata.file !== 'string') {
    errors.push('The "file" property should be a string.');
  }

  if (!Array.isArray(metadata.labels) || !metadata.labels.every((label: string) => typeof label === 'string')) {
    errors.push('The "labels" property should be an array of strings.');
  }

  if (
    !metadata.dimensions ||
    typeof metadata.dimensions.width !== 'number' ||
    typeof metadata.dimensions.height !== 'number'
  ) {
    errors.push('The "dimensions" property should be an object with "width" and "height" as numbers.');
  }

  if (errors.length === 0) {
    return { valid: true, errors };
  }

  return { valid: false, errors };
};

const parseImageClassificationMetadata = (image: Metadata): ImageClassificationMetadata => {
  return {
    image: {
      name: image.name,
      file: image.file,
      labels: image.labels,
      dimensions: {
        width: image.dimensions.width,
        height: image.dimensions.height,
      },
    },
  };
};
