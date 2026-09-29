import { Request, Response, NextFunction } from "express";
import { authService } from "../modules/auth/auth.service";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  const decoded = authService.verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }

  // Attach user info to request object
  (req as any).user = decoded;
  next();
};

export const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // In a real app, you would fetch the user from database to get their role
    // For now, we'll assume the role is in the token
    const userRole = (req as any).user.role || "customer";
    
    if (userRole !== role && role !== "any") {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }
    
    next();
  };
};
