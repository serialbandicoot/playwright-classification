# Playwright Classification 

This library extends the capabilities of Playwright, a powerful UI automation tool, by introducing image classification matchers. It allows you to perform image classification within your end-to-end (E2E) testing using Playwright and TypeScript. With this library, you can incorporate machine learning techniques, such as Convolutional Neural Networks, for image recognition and classification directly in your E2E tests.

Enjoy integrating image classification into your Playwright E2E tests with the Playwright Image Classification Matchers!

## Installation

This module is distributed via [npm](https://npmjs.com/) which is bundled with [node](https://nodejs.org/) and
should be installed as one of your project's `devDependencies`:

```bash
npm i -D playwright-classification
```

## Usage

### TypeScript
1. Import `playwright-classification` module
2. Extend expect with custom image matchers

```typescript
// 1. In your playwright.config.ts
import { expect } from '@playwright/test';
import playwrightClassification from 'playwright-classification';

// 2. extend expect with custom image matchers
expect.extend(playwrightClassification);
```

### JavaScript

```javascript
// 1. In your playwright.config.js
const { expect } = require('@playwright/test');
const { default: playwrightClassification } = require('playwright-classification');

// 2. extend expect with custom image matchers
expect.extend(playwrightClassification);
```

## Usage Examples

Here's an example of how to use the library in your Playwright E2E test.

```javascript
test('Verify Image Classification', async ({ page }) => {
    // ...
    await expect(page.getByTestId("image-five")).toImageClassification("five");
});
```

This example, the macther will etract an image of the locator, this is saved to `test-results/{the-test-name}`. The locator In this example is found using `getByTestId`. The `toImageClassification` matcher will then classify the extracted element screenshot with model label `five.` See [Metadata Configuration](#metadata-configuration) below to setup classes.

### Optional

If you have more than one model in the metadata, the first one will be used by default. To specify a different model, use the model name. The threshold is set to a default value of `0.95`, but this can be changed at the assertion level.

In the following example, the threshold has been artificially set too low. In practice, this would be user-dependent; however, setting it too low would cause predictions to always pass. It is advisable to maintain a higher threshold and review the model's predictive ability.

```javascript
test('should pass when threshold has been set low', async ({ page }) => {
    // ...
    await expect(page.getByTestId("image-nofive")).toImageClassification(
        "four", { model: "category", threshold: 0.5 }
    );
});
```

## Metadata Configuration

To use the library, you need to configure metadata for the image classification models. Here's an example configuration:

```javascript
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
                height: 28
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
                height: 28
            }
        }
    }]
}
```

## Metadata Configuration Items

| Item          | Description                                                             |
|-------------- | ----------------------------------------------------------------------- |
| model         | The name of the model or a user-defined reference.                      |
| file          | The relative path to the model from the playwright.config.ts file       |
| classes       | The order in which the model's predictive layer refers to the classes.  |
| dimensions    | The width and height of the images on which the model has been trained. |


## Convolutional Neural Networks (CNN)

A CNN is a type of artificial intelligence algorithm used for tasks like image recognition. It's inspired by the way the human visual system works. The question, why do I need this in my playwright tests? Is a question related to why do you need a matcher which can be ambiguous in nature, due to a machine models predictive ability.

The image below show's a collection of MNIST numbers and a completely unrelated image, which has made up the set of two models used in creating this library. The first a Binary CNN, this has been defined as Five or Not Five. The second Category defined as Two, Four and Nine. The underlying images, all found in the `cnn/data` folder have been used to create a model, which was then converted to a Tensorflow JSON model (with it's associated weights). 

<img
    alt="image-site"
    src="https://raw.githubusercontent.com/serialbandicoot/playwright-classification/main/docs/image-site.png"
  />

In the `cnn` folder there are two Jupyter notebooks, both of these have the full workings in how the model has been created. In test these models achieved a predictive value of `99%`. 

### Why?

Simply, there are conditions when testing websites where a deterministic approach can be difficult to create the conditions required to use tools such as Visual Comparison or other Functional Testing approaches. The inspiration for this library was about testing science outputs. These outputs are complex images, which in large numbers made the creation of a machine-learned model relatively straightforward.

The Binary and Category Jupyter notebooks should be used as the basis for creating ML Models for this library. It's advised to use these or the `.py` version in your own codebase so that you can validate the effectiveness of your model and appropriately set the model threshold.

The `CNN` folder can also be completly copied and has been tested using `python-3.11`. There are associated tests, which can be used to validate your model.

### Notes on the TensorFlow model

1. Must be a TensorFlow JSON model
2. Must include the bin weights

For more information on Playwright, refer to the [Playwright documentation](https://playwright.dev/). And thanks to [Odottaa](https://github.com/elaichenkov/odottaa/) for the fantastic example used in creating this library.
