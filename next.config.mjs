/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['www.cpapmiami.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https', // or 'http' if needed
        hostname: 'www.cpapmiami.com', // Replace with your domain
        port: '', // Optional, specify port if needed
        pathname: '/**', // Optional, filter specific paths
      },
      {
        protocol: 'https', // or 'http' if needed
        hostname: 'res.cloudinary.com', // Replace with your domain
        port: '', // Optional, specify port if needed
        pathname: '/**', // Optional, filter specific paths
      },        // Add more patterns for other domains if necessary
      {
        protocol: 'https', // or 'http' if needed
        hostname: 'checkout.stripe.com', // Replace with your domain
        port: '', // Optional, specify port if needed
        pathname: '/**', // Optional, filter specific paths
      }, 
      {
        protocol: 'https', // or 'http' if needed
        hostname: 'files.stripe.com', // Replace with your domain
        port: '', // Optional, specify port if needed
        pathname: '/**', // Optional, filter specific paths
      }, 
      {
        protocol: 'https', // or 'http' if needed
        hostname: 'medicom.hexerve.s3.ap-south-1.amazonaws.com', // Replace with your domain
        port: '', // Optional, specify port if needed
        pathname: '/**', // Optional, filter specific paths
      }, 
      {
        protocol: 'https', // or 'http' if needed
        hostname: 's3.ap-south-1.amazonaws.com', // Replace with your domain
        port: '', // Optional, specify port if needed
        pathname: '/**', // Optional, filter specific paths
      }, 
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
