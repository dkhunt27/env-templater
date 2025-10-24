import { TestBed } from '@suites/unit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrunoUtilities } from '../../src/commands/bruno/bruno.utilities.ts';

describe('BrunoUtilities', () => {
  let brunoUtilities: BrunoUtilities;

  beforeEach(async () => {
    const { unit } = await TestBed.solitary(BrunoUtilities).compile();

    brunoUtilities = unit;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseConfig', () => {
    it('should return expected value', () => {
      const configFullPath = './bruno-env-templater.config.json';

      const expected = require(configFullPath);

      expect(brunoUtilities.parseConfig({ configFile: './bruno-env-templater.config.json' })).toEqual(expected);
    });
  });
});
