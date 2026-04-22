import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // 1. Initialize a standard Postgres connection pool using your env variable
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
  
  // 2. Wrap the pool in the Prisma 7 Adapter
  const adapter = new PrismaPg(pool)
  
  // 3. Pass the adapter to the Prisma Client (No datasources needed!)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma