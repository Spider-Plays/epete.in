// Job scheduler for processing background tasks
import { processEmailQueue } from "./email.job";

// Process email queue every minute
const EMAIL_QUEUE_PROCESSING_INTERVAL = 60 * 1000; // 1 minute

export const startJobScheduler = () => {
  console.log("Starting job scheduler...");
  
  // Process email queue every minute
  setInterval(async () => {
    try {
      await processEmailQueue();
    } catch (error) {
      console.error("Error processing email queue:", error);
    }
  }, EMAIL_QUEUE_PROCESSING_INTERVAL);
  
  // Process email queue immediately on startup
  processEmailQueue().catch(console.error);
};

export default { startJobScheduler };
