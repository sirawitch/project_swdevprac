/** @type {import('next').NextConfig} */
const nextConfig = {
  // เพิ่มส่วนนี้เข้าไป
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // อนุญาตทุก Hostname ที่ใช้ HTTPS (วิธีที่ง่ายแต่ปลอดภัยน้อยกว่า)
        // หรือถ้าคุณรู้ Domain ที่แน่นอน: hostname: 'storage.googleapis.com',
      },
    ],
    // หรือใช้วิธี domains แบบเดิม (ง่ายกว่าสำหรับ Next.js v13/14)
    // domains: ['images.unsplash.com', 'your-image-cdn.com', 'i.imgur.com'],
  },
};

module.exports = nextConfig;
