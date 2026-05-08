/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https: blob:;
              connect-src 'self' ${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'} wss://${process.env.NEXT_PUBLIC_SERVER_URL?.replace(/^https?:\/\//, '') || 'localhost:5000'} ${process.env.NEXT_PUBLIC_SUPABASE_URL} wss://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//, '')};
              media-src 'self' https:;
              frame-src 'self' https://*.khalti.com https://*.esewa.com.np;
            `.replace(/\s+/g, ' ').trim()
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
