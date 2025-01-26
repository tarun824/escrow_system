import { Worker } from "bullmq";
import IORedis from "ioredis";

const redisClient = new IORedis("redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

const EmailServiceWorker = new Worker(
  "email-queue",
  async (job) => {
    // will send mail
    console.log("Came to job");
    console.log(job);
    console.log(job.data);
    sendEmail({
      toEmail: job.data.toEmail,
      subject: job.data.subject,
      text: job.data.text,
    });

    setTimeout(() => {}, 3000);
  },
  { connection: redisClient }
);
