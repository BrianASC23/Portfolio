'use client';

import { fontMono } from '@/app/fonts';
import { Container } from '@/components/primitives/Container';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { SectionIntro } from './SectionIntro';
import { SKILL_GROUPS, type Skill, type SkillGroup } from './skills-data';

const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
/** Per-key stagger inside a group; each group runs its own sequence as it arrives. */
const KEY_STAGGER = 0.035;

/** Skills: one keyboard row per category, from specializations down to languages. */
export function SkillsSection() {
  return (
    <section aria-label="Skills" className="pb-24 pt-12 md:pb-32 md:pt-16">
      <Container size="wide">
        <SectionIntro title="Skills" />

        <div className="mx-auto mt-14 flex max-w-[1180px] flex-col gap-10 md:mt-16 md:gap-12">
          {SKILL_GROUPS.map((group) => (
            <SkillGroupRow key={group.id} group={group} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/**
 * One category as a horizontal row: label on the left, an amber bar, then its
 * keys running left to right. Stacked on a phone, the bar sits under the label.
 */
function SkillGroupRow({ group }: { group: SkillGroup }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  const enter = (delay: number) =>
    inView ? { animation: `project-in-up 0.6s ${EASING} ${delay}s both` } : { opacity: 0 };

  return (
    <div ref={ref} className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
      <h3
        className={`shrink-0 border-b-2 border-[var(--color-accent)] pb-3 text-xs uppercase leading-relaxed tracking-[0.28em] text-[var(--color-fg-muted)] md:w-44 md:self-stretch md:border-r-2 md:border-b-0 md:pr-8 md:pb-0 md:text-right md:flex md:items-center md:justify-end ${fontMono.className}`}
        style={enter(0)}
      >
        {group.label}
      </h3>

      <ul className="flex list-none flex-wrap gap-3">
        {group.skills.map((skill, i) => (
          <li key={skill.name} className={group.wide ? '' : 'w-[4.75rem]'}>
            <Keycap skill={skill} wide={group.wide} style={enter(0.08 + i * KEY_STAGGER)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Keycap({
  skill,
  wide = false,
  style,
}: {
  skill: Skill;
  wide?: boolean;
  style?: React.CSSProperties;
}) {
  const Icon = skill.icon;
  const legend = wide ? skill.name : (skill.key ?? skill.name);

  return (
    <div
      title={skill.name}
      className={`keycap group flex h-full cursor-default items-center justify-center rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] transition-all duration-100 select-none hover:translate-y-[3px] ${
        wide ? 'flex-row gap-2 px-3 py-3' : 'flex-col gap-2 px-3 py-4'
      }`}
      style={{ ...style, '--keycap-color': skill.color } as React.CSSProperties}
    >
      <Icon
        aria-hidden="true"
        className={`shrink-0 drop-shadow-sm transition-[transform,filter] duration-150 group-hover:scale-110 ${
          wide ? 'h-5 w-5' : 'h-7 w-7'
        }`}
        style={{ color: skill.color }}
      />
      <span
        className={`uppercase text-[var(--color-fg-subtle)] transition-colors duration-150 group-hover:text-[var(--color-fg)] ${
          wide
            ? 'whitespace-nowrap text-[11px] tracking-[0.06em]'
            : 'text-center text-[10px] tracking-[0.14em]'
        } ${fontMono.className}`}
      >
        <span className="sr-only">{skill.name}</span>
        <span aria-hidden="true">{legend}</span>
      </span>
    </div>
  );
}
