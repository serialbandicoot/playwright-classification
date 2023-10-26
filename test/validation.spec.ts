import { test, expect } from '@playwright/test';

test.describe('Vaidation', () => {

    test('verify toImageClassification metadata model name does not exist', async ({ page }) => {
        await page.goto("/");
        try {
            await expect(page.getByTestId("image-nine")).toImageClassification("two", {model: "blah"});
        } catch (error) {            
            expect(error.message).toContain("The model blah was not found check Metdata")
        }
    });

});