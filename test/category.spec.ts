import { test, expect } from '@playwright/test';

test.describe('Category classification', () => {

    test('verify toImageClassification confirmed with label four with default', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-four")).toImageClassification("four",  {model: "category"});
    });

    test('verify toImageClassification confirmed with label two', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-two")).toImageClassification("two", {model: "category", threshold: 0.95});
    });

    test('verify toImageClassification confirmed with label nine', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-nine")).toImageClassification("nine", {model: "category"});
    });

    test('verify toImageClassification threshold too high', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-two")).toImageClassification("", {model: "category", threshold: 0.999});
    });

    test('verify toImageClassification fails on category class prediction', async ({ page }) => {
        await page.goto("/");
        try {
            await expect(page.getByTestId("image-nine")).toImageClassification("two", {model: "category"});
        } catch (error) {
            const withoutColorCodes: string = error.message.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
            
            // expect(withoutColorCodes).toContain("toImageClassification() assertion failed.\nYou expected 'five' but receieved 'nofive'")
            expect(withoutColorCodes).toContain("expect(received).toImageClassification(expected) // Object.is equality")
            expect(withoutColorCodes).toContain("Expected Expected: \"two\"")
            expect(withoutColorCodes).toContain("Received Expected: \"nine\"")
        }
    });

    test('verify toImageClassification when image not in class and low threshold', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("image-nofive")).toImageClassification(
            "four", { model: "category", threshold: 0.5 });
    });

});