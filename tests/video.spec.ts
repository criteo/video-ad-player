import { expect, test } from "@playwright/test";
import { mockAssetResponses } from "./mocks/responses";

test("can load vast and click on button", async ({ page }) => {
  await mockAssetResponses(page);

  await page.goto("./tests/test-page.html");
  await page.waitForTimeout(2000);

  await page.getByTestId("play-button").click();
  await expect(page.getByTestId("video-element")).toHaveJSProperty(
    "paused",
    true
  );
});
