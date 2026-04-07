import { commands } from '@/lib/commands/registry';
import { describe, expect, it } from 'vitest';

describe('commands registry', () => {
  it('contains navigation commands', () => {
    const ids = commands.map((c) => c.id);
    expect(ids).toContain('nav-home');
    expect(ids).toContain('nav-projects');
    expect(ids).toContain('nav-writing');
  });

  it('each command has required fields', () => {
    for (const cmd of commands) {
      expect(cmd.id).toBeTruthy();
      expect(cmd.label).toBeTruthy();
      expect(cmd.group).toBeTruthy();
    }
  });
});
