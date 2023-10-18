import playwrightClassification from './src';
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
    image: {
      file: "./test/ml/model.json",
      labels: [
          "nofive",
          "five"
      ],
      dimensions: {
          width: 28,
          height: 28,
      }
    }
  }
};

export default config;