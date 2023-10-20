import { test, expect } from '@playwright/test';

test.describe('Category classification', () => {

    test('verify toImageClassification confirmed with label four with default', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-four")).toImageClassification("four",  {modelName: "category"});
    });

    test('verify toImageClassification confirmed with label two', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-two")).toImageClassification("two", {modelName: "category", threshold: 0.95});
    });

    test('verify toImageClassification confirmed with label nine', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-nine")).toImageClassification("nine", {modelName: "category"});
    });

    test('verify toImageClassification threshold too high', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-two")).toImageClassification("", {modelName: "category", threshold: 0.999});
    });

    test('verify toImageClassification fails on category class prediction', async ({ page }) => {
        await page.goto("/");
        try {
            await expect(page.getByTestId("image-nine")).toImageClassification("two", {modelName: "category"});
        } catch (error) {
            
            expect(error.message).toContain("toImageClassification() assertion failed.\nYou expected 'two' but receieved 'nine'");
        }
    });

    test('verify toImageClassification when image not in class and low threshold', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-nofive")).toImageClassification("four", { modelName: "category", threshold: 0.5 });
    });

});