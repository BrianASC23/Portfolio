import { Container } from '@/components/primitives/Container';
import { SKILL_GROUPS, type SkillGroup } from './skills-data';

/**
 * One category as a row: mono label left of a hairline-ruled list of names.
 *
 * The middot separator is the same one `SelectedWork` sets between a project
 * and its caption, in the same hairline tone, so the two sections read as one
 * system. It trails its word inside a nowrap span, which keeps a wrapped line
 * from opening on a dangling separator.
 */
function SkillRow({ group }: { group: SkillGroup }) {
  const last = group.skills.length - 1;

  return (
    <div className="grid gap-x-8 gap-y-2 border-t border-[var(--color-border)] py-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] sm:pt-1">
        {group.label}
      </dt>
      <dd className="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1.5 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
        {group.skills.map((skill, i) => (
          <span key={skill} className="whitespace-nowrap">
            {skill}
            {i < last && (
              <span aria-hidden="true" className="ml-2 text-[var(--color-border-strong)]">
                ·
              </span>
            )}
          </span>
        ))}
      </dd>
    </div>
  );
}

/**
 * Skills, as a list rather than a keyboard.
 *
 * This used to be rows of raised 3D keys in per-skill brand colours. The grid was
 * the loudest thing on a page whose argument is made in type, and it read as
 * decoration rather than as credentials. Names on hairlines say the same thing
 * in a quarter of the space, and the section is static markup — no icons, no
 * client JavaScript.
 */
export function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-20 pb-24 md:pb-32">
      <Container size="wide">
        <h2
          id="skills-heading"
          className="border-t border-[var(--color-border)] pt-5 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"
        >
          Skills
        </h2>

        <dl className="mt-8 md:mt-10">
          {SKILL_GROUPS.map((group) => (
            <SkillRow key={group.id} group={group} />
          ))}
        </dl>
      </Container>
    </section>
  );
}
