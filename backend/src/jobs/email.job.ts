import nodemailer from "nodemailer";
import { prisma } from "../services/prisma.service";
import { Logger } from "../utils/logger";

// Email job queue (in a real app, you would use a proper job queue like Bull or RabbitMQ)
const emailQueue: Array<{
  to: string;
  subject: string;
  html: string;
  text?: string;
}> = [];

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

/**
 * Add email to queue
 */
export const enqueueEmail = (
  to: string,
  subject: string,
  html: string,
  text?: string
) => {
  emailQueue.push({ to, subject, html, text });
  Logger.info(`Email queued for ${to}: ${subject}`);
};

/**
 * Process email queue
 * In a real app, this would run continuously or be triggered by a job scheduler
 */
export const processEmailQueue = async () => {
  while (emailQueue.length > 0) {
    const email = emailQueue.shift();
    if (!email) continue;

    try {
      await transporter.sendMail({
        from: `"StyleMart" <${process.env.EMAIL_USER || ""}>`,
        to: email.to,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });

      Logger.info(`Email sent to ${email.to}: ${email.subject}`);
    } catch (error) {
      Logger.error(`Failed to send email to ${email.to}`, error);
      // In a real app, you might want to retry or move to a dead letter queue
      // For now, we'll just log the error and continue
    }
  }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await enqueueEmail(
      user.email,
      "Welcome to StyleMart!",
      `
        <h1>Welcome to StyleMart, ${user.name}!</h1>
        <p>Thank you for joining our fashion community.</p>
        <p>Here's a special welcome gift: 10% off your first order with code WELCOME10</p>
        <p>Happy shopping!</p>
      `,
      `
        Welcome to StyleMart, ${user.name}!
        
        Thank you for joining our fashion community.
        
        Here's a special welcome gift: 10% off your first order with code WELCOME10
        
        Happy shopping!
      `
    );

    Logger.info(`Welcome email queued for user ${userId}`);
  } catch (error) {
    Logger.error(`Failed to queue welcome email for user ${userId}`, error);
    throw error;
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (orderId: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: {
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const itemsHtml = order.items.map(item => `
      <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <img src="${item.product.images[0]?.url || '#'}" alt="${item.product.name}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px;">
        <div>
          <h3>${item.product.name}</h3>
          <p>Quantity: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}</p>
        </div>
      </div>
    `).join("");

    await enqueueEmail(
      order.user.email,
      `Order Confirmation #${order.orderNumber}`,
      `
        <h1>Thank you for your order!</h1>
        <p>Hi ${order.user.name},</p>
        <p>Your order has been received and is being processed.</p>
        
        <h2>Order Details</h2>
        <p>Order #: ${order.orderNumber}</p>
        <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Total: $${order.totalAmount.toFixed(2)}</p>
        
        <h2>Items</h2>
        ${itemsHtml}
        
        <p>You will receive another email when your order ships.</p>
        <p>Thank you for shopping with StyleMart!</p>
      `,
      `
        Thank you for your order!
        
        Hi ${order.user.name},
        
        Your order has been received and is being processed.
        
        Order #: ${order.orderNumber}
        Date: ${new Date(order.createdAt).toLocaleDateString()}
        Total: $${order.totalAmount.toFixed(2)}
        
        Items:
        ${order.items.map(item => `- ${item.product.name} (Qty: ${item.quantity}) - $${(item.quantity * item.price).toFixed(2)}`).join("\n")}
        
        You will receive another email when your order ships.
        Thank you for shopping with StyleMart!
      `
    );

    Logger.info(`Order confirmation email queued for order ${orderId}`);
  } catch (error) {
    Logger.error(`Failed to queue order confirmation email for order ${orderId}`, error);
    throw error;
  }
};

// Export the queue processor so it can be called periodically
export default {
  enqueueEmail,
  processEmailQueue,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
};
