/** @type {import('next').NextConfig} */
const nextConfig = {
      async headers() {
        const allowedOrigin = process.env.NODE_ENV === 'production' 
            ? 'https://utilfacts.com'
            : 'http://localhost:3000';
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: allowedOrigin }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
                ]
            }
        ]
    },
    logging: {
        fetches: {
          fullUrl: true,
        },
      },
    // use below when deploying to java application
    // output:'export'
    transpilePackages: ['mui-tel-input', 'resend'],
};

export default nextConfig;
