import { expect, test } from '@playwright/test';

test('one-phone round: reveal, discuss, vote, and play again', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /TRUST NO/i })).toBeVisible();
  await page.getByRole('button', { name: /^start the game$/i }).click();

  for (let player = 1; player <= 4; player += 1) {
    await expect(page.getByText(`Player ${player}`, { exact: true }).first()).toBeVisible();
    await page.getByRole('button', { name: /I have the phone/i }).click();
    const secretCard = page.getByRole('button', { name: 'Hold to reveal' });
    await expect(secretCard).toBeVisible();
    await expect(page.getByRole('button', { name: /Pass the phone/i })).toBeEnabled();
    await page.getByRole('button', { name: /Pass the phone/i }).click();
  }

  await expect(page.getByText('CREW DISCUSSION')).toBeVisible();
  await page.getByRole('button', { name: /Time to vote/i }).click();
  await expect(page.getByRole('heading', { name: /bluffing/i })).toBeVisible();
  await page.getByRole('button', { name: /Player 1, not selected/i }).click();
  await page.getByRole('button', { name: /Confirm vote/i }).click();
  await page.getByRole('button', { name: /play again/i }).click();
  await expect(page.getByRole('button', { name: /I have the phone/i })).toBeVisible();
});

test('new game during discussion never reveals the previous answer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^start the game$/i }).click();
  for (let i = 0; i < 4; i += 1) {
    await page.getByRole('button', { name: /I have the phone/i }).click();
    await page.getByRole('button', { name: /Pass the phone/i }).click();
  }
  await page.getByRole('button', { name: /New game/i }).click();
  await expect(page.getByRole('button', { name: /I have the phone/i })).toBeVisible();
  await expect(page.getByText('THE FINAL VOTE')).toHaveCount(0);
});

test('no horizontal page overflow on narrow phone screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /TRUST NO/i })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
