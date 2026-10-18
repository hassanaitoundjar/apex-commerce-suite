import prisma from "@/lib/prisma";

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    return prisma;
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Please define the DATABASE_URL environment variable inside .env");
  }

  try {
    await prisma.$connect();
    isConnected = true;
    return prisma;
  } catch (e) {
    isConnected = false;
    throw e;
  }
}

export default dbConnect;
