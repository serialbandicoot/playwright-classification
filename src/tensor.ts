import * as tf from '@tensorflow/tfjs';
import * as tfn from '@tensorflow/tfjs-node';
import * as fs from 'fs';

export type ActualResult = {
  highestLabel: string
  highestValue?: number
}

export const getImageTensor = async (
  path: string,
  width: number,
  height: number,
): Promise<tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[]> => {
  const imageBuffer = fs.readFileSync(path);
  const decodedImage = tfn.node.decodeJpeg(imageBuffer);
  const resizedImage = tf.image.resizeBilinear(decodedImage, [width, height]);

  // Normalize pixel values to [0, 1]
  const normalizedImage = tf.div(resizedImage, 255.0);

  // Expand dimensions to match the expected shape (1x244x244x3)
  const inputTensor = normalizedImage.expandDims(0).cast('float32');

  return inputTensor;
};

// loadModel does loadModel

export const loadModel = async (path: string): Promise<tf.LayersModel> => {
  const handler = tfn.io.fileSystem(path);
  return await tf.loadLayersModel(handler);
};

// predictImage returns the InputTensor image
// predictions

export const predictImage = (
  model: tf.LayersModel,
  inputTensor: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[],
): tf.Tensor | tf.Tensor[] => {
  const predictions = model.predict(inputTensor);
  return predictions;
};

// getPredictionsFromModel combines the load and
// predictionImage to return the predictions

export const getPredictionsFromModel = async (
  model: tf.LayersModel,
  inputTensor: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[],
) => {
  return predictImage(model, inputTensor);
};

// Enum for ClassificationType
export enum ClassificationType {
  Category = 'Category',
  Binary = 'Binary',
  Unknown = 'Unknown',
}

// getClassificationType will return the "binary" or "category"
// by checking the last layer, if this is softmax it will
// return "category"

export const getClassificationType = (model: tf.LayersModel) => {
  const outputLayer = model.layers[model.layers.length - 1]; // Get the last layer
  const outputLayerConfig = outputLayer.getConfig();

  if (outputLayerConfig.activation === 'softmax') {
    return ClassificationType.Category;
  } else if (outputLayerConfig.activation === 'sigmoid') {
    return ClassificationType.Binary;
  } else {
    return ClassificationType.Unknown;
  }
};
export const mapBinaryPrediction = (
  predictions: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[],
  threshold: number,
  labels: string[],
): ActualResult => {
  if (!Array.isArray(labels) || labels.length !== 2) {
    throw new Error('Labels should be an array of length 2.');
  }

  if (Array.isArray(predictions)) {
    throw new Error('Binary predictions should not be an array but a 1d tensor.');
  }

  // Assuming you want to compare the first tensor from predictions
  // Extract the numeric value from the tensor
  const predictedValue = predictions.dataSync()[0];

  const prediction = predictedValue >= threshold ? labels[0] : labels[1];

  return {
    highestLabel: prediction,
  };
  
};

// mapCategoryPrediction will run validation checks on the
// inputs, extract the predictions and then rank the
// the order. The top 1 is then compared to the threhold.

export const mapCategoryPrediction = (
  predictions: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[],
  threshold: number,
  labels: string[],
): ActualResult => {
  if (!Array.isArray(labels) || labels.length === 2) {
    throw new Error('Labels should be an array of more than two.');
  }

  if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
    throw new Error('Threshold should be a number between 0 and 1.');
  }

  if (Array.isArray(predictions)) {
    throw new Error('Category predictions should not be an array but a 1d tensor.');
  }

  // Assuming you want to compare the first tensor from predictions
  // Extract the numeric value from the tensor
  const predicted = predictions.dataSync();

  if (predicted.length !== labels.length) {
    throw new Error(`Incorrect number of categories, provided ${labels.length} got ${predicted.length}`);
  }

  // Map predictions with labels
  const predictedKV = labels.map((key, index) => ({ [key]: predicted[index] }));

  // Get the highest match
  let highestKey = '';
  let highestValue = -Infinity;

  predictedKV.forEach((item) => {
    const key = Object.keys(item)[0];
    const value = item[key];
    if (value > highestValue) {
      highestValue = value;
      highestKey = key;
    }
  });

  if (highestValue >= threshold) {
    return {
      highestLabel: highestKey,
      highestValue: highestValue,
    };
  }

  return {
    highestLabel: ''
  };
};
