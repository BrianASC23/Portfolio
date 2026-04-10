import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        color: '#2563eb',
        fontSize: 22,
        fontFamily: 'serif',
        fontStyle: 'italic',
        fontWeight: 600,
        borderRadius: 6,
      }}
    >
      b
    </div>,
    size,
  );
}
