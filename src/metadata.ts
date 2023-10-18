import { Metadata } from "@playwright/test";

export type ImageClassificationMetadata = {
  image: {
    file: string;
    labels: string[];
    dimensions: {
      width: number;
      height: number;
    };
  };
};

export const validateImageMetadata = (
  metadata: Metadata,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!metadata) {
    errors.push("Metadata object is missing.");
  }

  if (!metadata.image) {
    errors.push("Image object is missing.");
  }

  if (typeof metadata.image.file !== "string") {
    errors.push('The "file" property should be a string.');
  }

  if (
    !Array.isArray(metadata.image.labels) ||
    !metadata.image.labels.every((label: string) => typeof label === "string")
  ) {
    errors.push('The "labels" property should be an array of strings.');
  }

  if (
    !metadata.image.dimensions ||
    typeof metadata.image.dimensions.width !== "number" ||
    typeof metadata.image.dimensions.height !== "number"
  ) {
    errors.push(
      'The "dimensions" property should be an object with "width" and "height" as numbers.',
    );
  }

  if (errors.length === 0) {
    return { valid: true, errors };
  }

  return { valid: false, errors };
};

export function parseImageClassificationMetadata(
  metadata: Metadata,
): ImageClassificationMetadata | null {
  try {
    const image = metadata.image;
    if (
      image &&
      typeof image.file === "string" &&
      Array.isArray(image.labels) &&
      image.labels.every((label: string) => typeof label === "string") &&
      image.dimensions &&
      typeof image.dimensions.width === "number" &&
      typeof image.dimensions.height === "number"
    ) {
      return { image };
    }
    return null; // Invalid JSON structure
  } catch (error) {
    return null; // Error while parsing
  }
}
