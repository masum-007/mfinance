// @ts-nocheck
// Using a plain export bypasses the Next.js module resolution error on Vercel
export default {
  schema: "prisma/schema.prisma",
  datasource: {
    // Vercel will automatically provide this from the dashboard environment variables
    url: process.env.DIRECT_URL,
  },
};