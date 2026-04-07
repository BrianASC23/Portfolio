export function HeroStaticFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 50%, oklch(0.78 0.16 75 / 0.28) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, oklch(0.55 0.12 70 / 0.22) 0%, transparent 60%)',
        }}
      />
      <div
        className="-translate-y-1/2 absolute top-1/2 right-[15%] h-[380px] w-[380px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, oklch(0.82 0.16 75) 0%, oklch(0.42 0.11 65) 60%, transparent 72%)',
          filter: 'blur(10px)',
        }}
      />
    </div>
  );
}
