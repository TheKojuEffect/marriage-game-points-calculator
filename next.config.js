/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true
    }
}

const withPWA = require('next-pwa')({
    dest: 'public',
    // To fix an issue with webpack --watch mode in development
    // https://github.com/GoogleChrome/workbox/issues/1790
    disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA(nextConfig)
