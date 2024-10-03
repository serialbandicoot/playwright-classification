import { PlaywrightClassification } from './src'
import { expect, PlaywrightTestConfig } from '@playwright/test';

expect.extend(PlaywrightClassification);

const config: PlaywrightTestConfig = {
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: 'npm start',
    port: 3000,
    timeout: 60 * 1000,
  },
  use: {
    baseURL: 'http://localhost:3000/',
  },
  metadata: {
    models: [{
      image: {
        model: "binary",
        file: "./cnn/model_output/binary/model.json",
        classes: [
          "nofive",
          "five"
        ],
        dimensions: {
          width: 28,
          height: 28,
        }
      }
    }, {
      image: {
        model: "category",
        file: "./cnn/model_output/category/model.json",
        classes: [
          "four",
          "nine",
          "two"
        ],
        dimensions: {
          width: 28,
          height: 28,
        }
      }
    }],
  }
};

export default config;