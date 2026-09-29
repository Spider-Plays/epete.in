import { authRepository } from "./auth.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;
  private readonly saltRounds: number;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || "your_access_token_secret";
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || "your_refresh_token_secret";
    this.accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
    this.refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
  }

  /**
   * Register a new user
   */
  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    // Check if user already exists
    const emailExists = await authRepository.emailExists(userData.email);
    if (emailExists) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      userData.password,
      this.saltRounds
    );

    // Create user
    const user = await authRepository.createUser({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      phone: userData.phone || null,
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    // Find user
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate access token
   */
  private generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresIn,
    });
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    return authRepository.findById(userId);
  }
}

// Export singleton instance
export const authService = new AuthService();
