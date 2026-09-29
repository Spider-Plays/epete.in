import { Request, Response, NextFunction } from "express";

/**
 * Wrapper for async route handlers to avoid try/catch in every controller
 */
export const asyncHandler = 
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Utility function to validate pagination parameters
 */
export const validatePagination = (
  page: number | string,
  limit: number | string
): { page: number; limit: number } => {
  const parsedPage = parseInt(String(page), 10) || 1;
  const parsedLimit = parseInt(String(limit), 10) || 10;
  
  return {
    page: Math.max(1, parsedPage),
    limit: Math.max(1, Math.min(100, parsedLimit)), // Cap limit at 100
  };
};

/**
 * Utility function to calculate pagination offset
 */
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Utility function to generate pagination metadata
 */
export const generatePaginationMeta = (
  totalItems: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    totalPages,
    currentPage: page,
    pageSize: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export default {
  asyncHandler,
  validatePagination,
  calculateOffset,
  generatePaginationMeta,
};
