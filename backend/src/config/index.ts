import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Database
  databaseUrl: process.env.DATABASE_URL || "",
  
  // JWT
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your_access_token_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your_refresh_token_secret",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  
  // Bcrypt
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
  
  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  
  // Razorpay
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  
  // Email
  emailHost: process.env.EMAIL_HOST || "",
  emailPort: parseInt(process.env.EMAIL_PORT || "587", 10),
  emailUser: process.env.EMAIL_USER || "",
  emailPass: process.env.EMAIL_PASS || "",
  
  // Frontend URL(s) for CORS — comma-separated allowed
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};

function allowedOrigins(): string[] {
  return config.frontendUrl
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

export { allowedOrigins };

// Validate required environment variables in production
if (config.nodeEnv === "production") {
  const requiredVars = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}

export default config;
