'use client';

import { commands } from '@/lib/commands/registry';
import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const runCallback = useCallback(async (id: string) => {
    if (id === 'copy-email') {
      await navigator.clipboard.writeText('brianc40722@gmail.com');
    }
  }, []);

  const groups = ['navigate', 'social', 'action'] as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[20vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              label="Command palette"
              className="overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-2xl"
            >
              <div className="flex items-center gap-3 border-[var(--color-border)] border-b px-5 py-4">
                <span className="font-mono text-[var(--color-fg-subtle)] text-xs">⌘K</span>
                <Command.Input
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent text-[var(--color-fg)] text-sm placeholder:text-[var(--color-fg-subtle)] focus:outline-none"
                />
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="p-6 text-center text-[var(--color-fg-subtle)] text-sm">
                  No results found.
                </Command.Empty>
                {groups.map((group) => {
                  const items = commands.filter((c) => c.group === group);
                  if (items.length === 0) return null;
                  return (
                    <Command.Group
                      key={group}
                      heading={group.toUpperCase()}
                      className="px-2 py-1 font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]"
                    >
                      {items.map((cmd) => (
                        <Command.Item
                          key={cmd.id}
                          value={`${cmd.label} ${cmd.keywords?.join(' ') ?? ''}`}
                          onSelect={async () => {
                            setOpen(false);
                            if (cmd.action.type === 'navigate') router.push(cmd.action.href);
                            else if (cmd.action.type === 'external')
                              window.open(cmd.action.href, '_blank', 'noopener,noreferrer');
                            else await runCallback(cmd.action.id);
                          }}
                          className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[var(--color-fg)] text-sm aria-selected:bg-[var(--color-bg-inset)] aria-selected:text-[var(--color-accent)]"
                        >
                          {cmd.label}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
