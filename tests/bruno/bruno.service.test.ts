import { existsSync, unlinkSync } from 'node:fs';
import { TestBed } from '@suites/unit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrunoEnvTemplateService } from '../../src/commands/bruno/bruno.service.ts';
import { BrunoUtilities } from '../../src/commands/bruno/bruno.utilities.ts';

describe('BrunoEnvTemplateService', () => {
  let brunoService: BrunoEnvTemplateService;
  beforeEach(async () => {
    const { unit } = await TestBed.sociable(BrunoEnvTemplateService).expose(BrunoUtilities).compile();

    brunoService = unit;

    vi.useFakeTimers().setSystemTime(new Date('2024-09-01T12:34:56Z').getTime());
  });

  afterEach(() => {
    if (existsSync('./_bruno/Collection1/.env-backup-1725194096000')) {
      unlinkSync('./_bruno/Collection1/.env-backup-1725194096000');
    }
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('execute', () => {
    it('should return expected value', async () => {
      const actual = await brunoService.execute({ configFile: './bruno-env-templater.config.json' });
      await expect(actual.length).toEqual(1);
      await expect(actual[0]).toEqual(
        expect.objectContaining({
          collectionName: 'Collection1',
          envBackupFilePath: expect.stringContaining('_bruno/Collection1/.env-backup-1725194096000'),
          envFilePath: expect.stringContaining('_bruno/Collection1/.env'),
          finished: true,
          processedEnvVars: [
            {
              key: 'SECRET1',
              value: undefined,
            },
            {
              key: 'SECRET2',
              value: undefined,
            },
          ],
        }),
      );
    });
  });
});
