import { PrismaClient } from "@prisma/client";

// Create a single PrismaClient instance
export const prisma = new PrismaClient();

// Export a utility function to handle Prisma errors
export const handlePrismaError = (error: any) => {
  console.error("Prisma Error:", error);
  
  if (error.code === "P2002") {
    // Unique constraint violation
    throw new Error("A record with this value already exists");
  } else if (error.code === "P2025") {
    // Record not found
    throw new Error("Record not found");
  } else if (error.code === "P2003") {
    // Foreign key constraint failed
    throw new Error("Related record not found or invalid");
  } else if (error.code === "P2024") {
    // Too many records found
    throw new Error("Expected exactly one record but found multiple");
  } else {
    // Other Prisma errors
    throw new Error(`Database error: ${error.message}`);
  }
};

// Export a utility function for transactions
export const runTransaction = async <T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> => {
  return prisma.$transaction(async (tx) => {
    return callback(tx);
  });
};

export default prisma;
