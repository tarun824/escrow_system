import { Queue } from "bullmq";
import { redisClient } from "../index";

async function SendEmail() {
  const notificationQueue = new Queue("email-queue", {
    connection: redisClient,
  });

  const notiStatus = await notificationQueue.add("Email", {
    email: "test@gmail.com",
    subject: "This is subject",
    body: "This is body",
  });
  console.log("Jod added", notiStatus.id);
}

export default SendEmail;
