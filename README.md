# Playwright Classification 

This library extends the capabilities of Playwright, a powerful UI automation tool, by introducing image classification matchers. It allows you to perform image classification within your end-to-end (E2E) testing using Playwright and TypeScript. With this library, you can incorporate machine learning techniques, such as convolutional neural networks, for image recognition and classification directly in your E2E tests.

Enjoy integrating image classification into your Playwright E2E tests with the Playwright Image Classification Matchers!

## Usage Examples

Here's an example of how to use the library in your Playwright E2E test.

```javascript
test('Verify Image Classification', async ({ page }) => {
    // ...
    await expect(page.getByTestId("image-five")).toImageClassification("five");
});
```

This example, the macther will etract an image of the locator, this is saved to `test-results/{the-test-name}`. The locator In this example is found using `getByTestId`. The `toImageClassification` matcher will then classify the extracted element screenshot with model label `five.` See [Metadata Configuration](#metadata-configuration) below to setup labels.

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
            labels: [
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
            labels: [
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

| Item         | Description                                                |
|-------------- | ---------------------------------------------------------- |
| model        | The name of the model or a user-defined reference.         |
| file         | The relative path to the model.                             |
| labels       | The order in which the model's predictive layer refers to the class labels. |
| dimensions   | The width and height of the images on which the model has been trained. |

## playwright.config.ts

Don't forget to add the library!

```typescript
    import { playwrightClassification } from 'playwrightClassification';

    expect.extend(playwrightClassification);
```

For more information on Playwright, refer to the [Playwright documentation](https://playwright.dev/).
