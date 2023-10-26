# Playwright Classification 

This library extends the capabilities of Playwright, a powerful UI automation tool, by introducing image classification matchers. It allows you to perform image classification within your end-to-end (E2E) testing using Playwright and TypeScript. With this library, you can incorporate machine learning techniques, such as convolutional neural networks, for image recognition and classification directly in your E2E tests.


## Usage Examples

Here's an example of how to use the library in your Playwright E2E test:

```javascript
test('Verify Image Classification', async ({ page }) => {
    // ...
    await expect(page.getByTestId("image-five")).toImageClassification("five");
});
```

### Optional

If you have more than one model in the metadata then the first will be used by default, to specify the model use the model name. The threshold is defaulted to 0.95, therefore this can be changes at the assertion level.

```javascript
test('verify toImageClassification when image not in class and low threshold', async ({ page }) => {
    // ...
    await expect(page.getByTestId("image-nofive")).toImageClassification(
        "four", { model: "category", threshold: 0.5 }
    );
});
```

In the above example, we navigate to a web page and use the `toImageClassification` matcher to classify an image with the label "five."

## Configuration

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

In this configuration, you specify models for different image classification tasks, including the model files, labels, and dimensions.

For more information on Playwright, refer to the [Playwright documentation](https://playwright.dev/).

Enjoy seamlessly integrating image classification into your Playwright E2E tests with the Playwright Image Classification Matchers!
```

