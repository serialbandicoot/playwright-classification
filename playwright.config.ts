import playwrightClassification from './src'
import { expect, PlaywrightTestConfig } from '@playwright/test';

expect.extend(playwrightClassification);

const config: PlaywrightTestConfig = {
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: 'npm start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000/',
  },
  metadata: {
    models: [{
      image: {
        model: "binary",
        file: "./cnn/model_output/binary/model.json",
        labels: [
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
        labels: [
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