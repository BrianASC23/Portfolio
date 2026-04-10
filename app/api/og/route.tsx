import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Brian Cao';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Brian Cao';
  const subtitle =
    searchParams.get('subtitle') ??
    'Full-stack engineer building systems at the edge of software and AI';
  const eyebrow = searchParams.get('eyebrow') ?? 'PORTFOLIO';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 72px',
        background: 'radial-gradient(ellipse at 70% 40%, #2563eb22 0%, transparent 55%), #ffffff',
        color: '#111111',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 16,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#999999',
        }}
      >
        <span>{eyebrow}</span>
        <span>briancao.dev</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
        <h1
          style={{
            fontSize: 88,
            fontFamily: 'serif',
            lineHeight: 0.98,
            color: '#111111',
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 28, color: '#666666', marginTop: 24, maxWidth: 820 }}>{subtitle}</p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 16,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#999999',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              width: 10,
              height: 10,
              background: '#2563eb',
              borderRadius: 999,
              marginRight: 12,
            }}
          />
          Available · Summer 2026
        </span>
        <span>Brian Cao · Stony Brook '27</span>
      </div>
    </div>,
    size,
  );
}
