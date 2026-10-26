import { describe, expect, it } from 'vitest';
import { contentChecks, cryptoCheck } from '../src/selftest';
import { measuresDue, weekly } from '../src/lib/progress';
import { newData } from '../src/lib/model';

describe('content and safety rules', () => {
  for (const c of contentChecks()) {
    it(c.name, () => expect(c.ok, c.detail).toBe(true));
  }
});

describe('crypto', () => {
  it('round-trips and rejects a wrong PIN', async () => {
    for (const c of await cryptoCheck()) expect(c.ok, c.name).toBe(true);
  });
});

describe('progress', () => {
  it('all measures are due on a new install', () => {
    expect(measuresDue(newData()).sort()).toEqual(['GAD7', 'PHQ9', 'WI7']);
  });
  it('weekly rows count surfed urges', () => {
    const d = newData();
    d.urges.push({ id: 'a', at: new Date().toISOString(), kind: 'ECG', start: 7, end: 3, minutes: 3, outcome: 'surfed' });
    const rows = weekly(d, 2);
    expect(rows[rows.length - 1].surfed).toBe(1);
  });
});

import { deriveKey, newSalt, seal } from '../src/lib/crypto';
import { isLegacyVault } from '../src/lib/store';
import { open } from '../src/lib/crypto';

describe('moving from the old PIN version', () => {
  it('recognises an old PIN vault and opens it with the right PIN', async () => {
    const d = newData({ name: 'Tester' });
    const salt = newSalt();
    const v = await seal(d, await deriveKey('2468', salt), salt);
    expect(isLegacyVault(v)).toBe(true);
    expect(isLegacyVault(d)).toBe(false);
    expect((await open<typeof d>(v, '2468')).data.profile.name).toBe('Tester');
    await expect(open(v, '1111')).rejects.toBeTruthy();
  });
});
