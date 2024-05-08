/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //DONE 要加圖片的host
  images: {
    remotePatterns: [
      {
        protocol: 'https', // or http
        hostname: 'rickandmortyapi.com', // if your website has no www, drop it
        pathname: '**',
        port: '',
      },
    ],
  },
};

export default nextConfig;
