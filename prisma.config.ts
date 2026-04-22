// @ts-nocheck
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local specifically
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default {
  schema: "prisma/schema.prisma",
  datasource: {
    // This will now correctly find your DIRECT_URL from .env.local
    url: process.env.DIRECT_URL,
  },
};