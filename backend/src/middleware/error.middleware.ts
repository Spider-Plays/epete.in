import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // Handle specific error types
  if (err.code === "P2002") { // Prisma unique constraint violation
    statusCode = 409;
    message = "Resource already exists";
  } else if (err.code === "P2025") { // Prisma record not found
    statusCode = 404;
    message = "Resource not found";
  } else if (
    message === "Invalid credentials" ||
    message === "User with this email already exists"
  ) {
    statusCode = message.includes("exists") ? 409 : 401;
  }

  // In development, include stack trace
  if (process.env.NODE_ENV === "development") {
    errors = {
      stack: err.stack,
      ...(err.errors && { validationErrors: err.errors }),
    };
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

// Not found middleware
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
