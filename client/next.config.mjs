/** @type {import('next').NextConfig} */
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const serverHost = serverUrl.replace(/^https?:\/\//, "");
const wsProtocol = serverUrl.startsWith("https") ? "wss" : "ws";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseHost = supabaseUrl.replace(/^https?:\/\//, "");
const supabaseWsProtocol = supabaseUrl.startsWith("https") ? "wss" : "ws";

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              `connect-src 'self' ${serverUrl} ${wsProtocol}://${serverHost} ${supabaseUrl} ${supabaseWsProtocol}://${supabaseHost}`,
              "media-src 'self' https:",
              "frame-src 'self' https://*.khalti.com https://*.esewa.com.np",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
