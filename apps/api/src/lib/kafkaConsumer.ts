import { Kafka } from "kafkajs";
import { logger } from "../observability/safeLogger.js";
import { redis } from "../server.js"; // Import redis client

const kafka = new Kafka({
  clientId: "remotedesk-consumer",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

export const consumer = kafka.consumer({ groupId: "device-metrics-group" });

export async function startKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "device-metrics", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.value) {
        const data = JSON.parse(message.value.toString());
        logger.info("Received device metrics", { topic, partition, data });
                // Store data in Redis for now (mocking time-series DB)
        await redis.set(`device:${data.deviceId}:latestMetrics`, JSON.stringify(data.metrics));

        // Mock predictive analysis
        const prediction = mockPredictiveModel(data.metrics);
        if (prediction) {
          logger.info("Predicted issue", { prediction });
          await redis.lpush(`device:${data.deviceId}:predictions`, JSON.stringify(prediction));
        }
      }
    },
  });
  logger.info("Kafka consumer started");
}

function mockPredictiveModel(metrics: any): string | null {
  // Simple mock: if CPU usage is high, predict a potential issue
  if (metrics.cpu && metrics.cpu > 80) {
    return `High CPU usage detected (${metrics.cpu}%). Potential performance degradation.`;
  }
  if (metrics.disk && metrics.disk.free < 10) {
    return `Low disk space detected (${metrics.disk.free}% free).`;
  }
  return null;
}

export async function stopKafkaConsumer() {
  await consumer.disconnect();
  logger.info("Kafka consumer stopped");
}
