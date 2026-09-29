import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";

// Import config
import config from "./config";
// Import routes
import authRoutes from "./modules/auth/auth.routes";
import swaggerRoutes from "./services/swagger.service";
// Import other routes as they are created
// import userRoutes from "./modules/users/user.routes";
// import productRoutes from "./modules/products/product.routes";
// ... and so on

// Import middleware
import { errorHandler, notFound } from "./middleware/error.middleware";
import { authenticateToken } from "./middleware/auth.middleware";

// Import job scheduler
import { startJobScheduler } from "./jobs/scheduler";

// Initialize express app
const app: Express = express();
const PORT = config.port;

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(json({ limit: "10mb" }));
app.use(urlencoded({ extended: true, limit: "10mb" }));
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
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// ... and so on for other modules

// Documentation
app.use("/api-docs", swaggerRoutes);

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
    // Start job scheduler
    startJobScheduler();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
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
