import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { runCreateShortcut } from './shortcut.js';
import { mockAndCaptureOutput } from '@shopify/cli-kit/node/testing/output';
import { createPlatformShortcut } from '../../lib/shell.js';

vi.mock("../../lib/shell.js");
describe("shortcut", () => {
  const outputMock = mockAndCaptureOutput();
  beforeEach(() => {
    vi.resetAllMocks();
  });
  afterEach(() => {
    outputMock.clear();
  });
  it("shows created aliases", async () => {
    vi.mocked(createPlatformShortcut).mockResolvedValue([
      "zsh",
      "bash",
      "fish"
    ]);
    await runCreateShortcut();
    expect(outputMock.info()).toMatch(`zsh, bash, fish`);
  });
  it("warns when not finding shells", async () => {
    vi.mocked(createPlatformShortcut).mockResolvedValue([]);
    await runCreateShortcut();
    expect(outputMock.info()).toBeFalsy();
    expect(outputMock.error()).toBeTruthy();
  });
});
