import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Import config
import config, { allowedOrigins } from "./config";
// Import routes
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/product.routes";
// Import other routes as they are created
// import userRoutes from "./modules/users/user.routes";
// import productRoutes from "./modules/products/product.routes";
// ... and so on

// Import middleware
import { errorHandler, notFound } from "./middleware/error.middleware";
import { authenticateToken } from "./middleware/auth.middleware";


// Initialize express app
const app: Express = express();
const PORT = config.port;

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowed = allowedOrigins();
    // Allow non-browser clients (no Origin) and configured frontends
    if (!origin || allowed.includes(origin) || allowed.includes("*")) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
// ... and so on for other modules


// Protected routes example (uncomment to use)
// app.use("/api/protected", authenticateToken, (req, res) => {
//   res.json({ message: "This is a protected route", user: (req as any).user });
// });

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start listening
const startServer = async () => {
  try {
    // Start listening
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Export for testing
export default app;
