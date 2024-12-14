module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store', // API 전역 캐싱 방지
          },
        ],
      },
    ];
  },
};
