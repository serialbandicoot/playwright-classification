import { test, expect } from '@playwright/test';

test.describe('Binary classification', () => {

    test('verify toImageClassification confirmed', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-five")).toImageClassification("five");
    });

    test('verify toImageClassification confirmed with optional model name', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-five")).toImageClassification("five", {model: "binary"});
    });

    test('verify toImageClassification un-confirmed', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-nofive")).toImageClassification("nofive");
    });

    test('verify toImageClassification confirmed by applying threhold', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-five")).toImageClassification("nofive", {threshold: 0.00001});
    });

    test('verify toImageClassification fails on prediction', async ({ page }) => {
        await page.goto("/");
        try {
            await expect(page.getByTestId("image-five")).toImageClassification("nofive");
        } catch (error) {            
            expect(error.message).toEqual("Expected Label to classify as 'nofive', but the highest classification was 'five'")
        }
    });

    test('verify toImageClassification fails on prediction2', async ({ page }) => {
        await page.goto("/");
        try {
            await expect(page.getByTestId("image-nofive")).toImageClassification("five");
        } catch (error) {
            expect(error.message).toContain("Expected Label to classify as 'five', but the highest classification was 'nofive'")
        }
    });

});