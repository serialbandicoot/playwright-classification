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
            const withoutColorCodes: string = error.message.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
            
            expect(withoutColorCodes).toContain("toImageClassification() assertion failed.\nYou expected 'nofive' but receieved 'five'")
        }
    });

    test('verify toImageClassification fails on prediction2', async ({ page }) => {
        await page.goto("/");
        try {
            await expect(page.getByTestId("image-nofive")).toImageClassification("five");
        } catch (error) {
            const withoutColorCodes: string = error.message.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
            
            expect(withoutColorCodes).toContain("toImageClassification() assertion failed.\nYou expected 'five' but receieved 'nofive'")
        }
    });

});